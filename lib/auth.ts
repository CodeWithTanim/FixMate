import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { getDatabase, mongoClient, mongoDb } from "./db";
import { getAuthConfiguration } from "./auth-config";

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
  database: mongodbAdapter(mongoDb, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
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
        required: false,
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
    user: {
      create: {
        before: async (user, ctx) => {
          let selectedRole = (user as { role?: string })?.role;
          try {
            const context = ctx as { path?: string; headers?: { get?: (name: string) => string | null; cookie?: string } } | undefined;
            const cookieHeader = context?.headers?.get ? context.headers.get("cookie") : context?.headers?.cookie;
            if (cookieHeader && context?.path?.startsWith("/callback/")) {
              const match = cookieHeader.match(/fixmate_intended_role=([^;]+)/);
              if (match && match[1]) {
                const roleFromCookie = decodeURIComponent(match[1]).trim().toLowerCase();
                if (roleFromCookie === "technician" || roleFromCookie === "customer") {
                  selectedRole = roleFromCookie;
                }
              }
            }
          } catch {
            console.warn("Could not read the intended signup role.");
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
