import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError, addOAuthServerContext } from "better-auth/api";
import { ObjectId } from "mongodb";
import { getDatabase, mongoDb } from "./db";
import { getAuthConfiguration } from "./auth-config";
import { getAccountRole } from "./account-role";
import { roleAuthAdapter } from "./role-auth-adapter";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) throw new Error("BETTER_AUTH_SECRET must be configured for authentication.");
const configuration = getAuthConfiguration(process.env);

function createAuth() {
  return betterAuth({
  baseURL: configuration.baseURL,
  secret,
  trustedOrigins: configuration.trustedOrigins,
  onAPIError: { errorURL: "/sign-in" },
  advanced: { trustedProxyHeaders: process.env.VERCEL === "1" },
  database: roleAuthAdapter(),
  plugins: [{
    id: "fixed-role-accounts",
    schema: {
      user: {
        fields: {},
        indexes: [{ name: "user_email_role_uidx", fields: ["email", "role"], unique: true }],
      },
      account: {
        fields: { accountRole: { type: "string", required: true, input: false, defaultValue: "customer" } },
        indexes: [{ name: "account_provider_role_uidx", fields: ["providerId", "accountId", "accountRole"], unique: true }],
      },
    },
  }],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/social" || ctx.path === "/link-social") {
        let role = await getAccountRole();
        if (ctx.path === "/link-social") {
          const session = await (await getAuth()).api.getSession({ headers: ctx.headers || new Headers() });
          const savedRole = (session?.user as { role?: string } | undefined)?.role;
          if (savedRole === "customer" || savedRole === "technician" || savedRole === "admin") role = savedRole;
        }
        await addOAuthServerContext({ accountRole: role });
      }
      // Server-side password policy & role sanitization
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body as Record<string, unknown> | undefined;
        if (body) {
          const password = body.password;
          if (typeof password !== "string" || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            throw new APIError("BAD_REQUEST", {
              message: "Password must be at least 6 characters and contain at least one uppercase and one lowercase letter.",
            });
          }

          // Strictly enforce allowed roles: customer or technician. Never allow admin self-selection!
          const requestedRole = body.role as string | undefined;
          body.role = requestedRole === "technician" ? "technician" : "customer";
        }
      }

      // Password policy validation on change-password
      if (ctx.path === "/change-password") {
        const body = ctx.body as Record<string, unknown> | undefined;
        if (body) {
          const newPassword = body.newPassword;
          if (typeof newPassword !== "string" || newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
            throw new APIError("BAD_REQUEST", {
              message: "New password must be at least 6 characters and contain at least one uppercase and one lowercase letter.",
            });
          }
        }
      }

      // Prevent role or email escalation in user update & enforce strict profile validation
      if (ctx.path === "/update-user") {
        const body = ctx.body as Record<string, unknown> | undefined;
        if (body) {
          delete body.role;
          delete body.email;
          delete body.id;
          delete body._id;

          if (body.name !== undefined) {
            if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 70) {
              throw new APIError("BAD_REQUEST", {
                message: "Name must be a valid string between 2 and 70 characters.",
              });
            }
            body.name = body.name.trim();
          }

          if (body.phone !== undefined && body.phone !== null && body.phone !== "") {
            if (typeof body.phone !== "string" || body.phone.trim().length < 7 || body.phone.trim().length > 30) {
              throw new APIError("BAD_REQUEST", {
                message: "Phone number must be between 7 and 30 characters.",
              });
            }
            body.phone = body.phone.trim();
          }

          const areaVal = body.area !== undefined ? body.area : body.serviceArea;
          if (areaVal !== undefined && areaVal !== null && areaVal !== "") {
            if (typeof areaVal !== "string" || areaVal.trim().length < 2 || areaVal.trim().length > 100) {
              throw new APIError("BAD_REQUEST", {
                message: "Area must be between 2 and 100 characters.",
              });
            }
            body.area = (areaVal as string).trim();
            body.serviceArea = (areaVal as string).trim();
          }

          if (body.bio !== undefined && body.bio !== null && body.bio !== "") {
            if (typeof body.bio !== "string" || body.bio.trim().length > 500) {
              throw new APIError("BAD_REQUEST", {
                message: "Bio cannot exceed 500 characters.",
              });
            }
            body.bio = body.bio.trim();
          }

          if (body.image !== undefined && body.image !== null && body.image !== "") {
            if (typeof body.image !== "string" || !/^https?:\/\/.+/.test(body.image.trim())) {
              throw new APIError("BAD_REQUEST", {
                message: "Image must be a valid URL string or empty.",
              });
            }
            body.image = body.image.trim();
          }
        }
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      area: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    account: {
      create: {
        before: async (account) => {
          const id = String(account.userId);
          const user = await mongoDb.collection("user").findOne(ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id });
          return { data: { ...account, accountRole: user?.role || await getAccountRole() } };
        },
      },
    },
    user: {
      create: {
        before: async (user) => {
          const selectedRole = await getAccountRole();
          const reservedAdmin = await mongoDb.collection("user").findOne({ email: user.email.toLowerCase(), role: "admin" }, { projection: { _id: 1 } });
          if (reservedAdmin) {
            throw new APIError("FORBIDDEN", { message: "This email is reserved for an administrator account." });
          }
          const safeRole = selectedRole === "technician" ? "technician" : "customer";
          return {
            data: {
              ...user,
              role: safeRole,
            },
          };
        },
      },
      update: {
        before: async (update) => {
          const safeData = { ...update } as Record<string, unknown>;
          delete safeData.role;
          delete safeData.email;
          return {
            data: safeData,
          };
        },
      },
    },
  },
  socialProviders: configuration.googleConfigured ? {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  } : {},
  });
}

let authPromise: Promise<ReturnType<typeof createAuth>> | undefined;

export async function getAuth() {
  // Never initialize the adapter's background index builds on an unconnected
  // client. Reconnect before every request so failed cold starts can recover.
  await getDatabase();
  if (!authPromise) {
    authPromise = (async () => {
      const instance = createAuth();
      await instance.$context;
      return instance;
    })().catch(error => {
      authPromise = undefined;
      throw error;
    });
  }
  return authPromise;
}
