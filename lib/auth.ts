import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { mongoClient, mongoDb } from "./db";

const secret =
  process.env.BETTER_AUTH_SECRET || "mUNlQHnq42lbdvckTNnfLwbwH1kmh4D1";

const trustedOrigins = [
  "https://fix-mate-flame.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : []),
];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://fix-mate-flame.vercel.app",
  secret,
  trustedOrigins,
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
          const password = body.password as string | undefined;
          if (!password || password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
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
          const newPassword = body.newPassword as string | undefined;
          if (!newPassword || newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
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
    session: {
      create: {
        before: async (session, ctx) => {
          try {
            const context = ctx as { headers?: { get?: (name: string) => string | null; cookie?: string } } | undefined;
            const cookieHeader = context?.headers?.get ? context.headers.get("cookie") : context?.headers?.cookie;
            if (cookieHeader) {
              const match = cookieHeader.match(/fixmate_intended_role=([^;]+)/);
              if (match && match[1]) {
                const intendedRole = decodeURIComponent(match[1]).trim().toLowerCase();
                if (intendedRole === "technician" || intendedRole === "customer") {
                  const rawUserId = (session as { userId?: unknown })?.userId;
                  if (rawUserId) {
                    const userIdStr = String(rawUserId);
                    const { ObjectId } = await import("mongodb");
                    const filter = ObjectId.isValid(userIdStr)
                      ? { $or: [{ _id: new ObjectId(userIdStr) }, { id: userIdStr }] }
                      : { id: userIdStr };
                    const existingUser = await mongoDb.collection("user").findOne(filter);
                    if (existingUser && existingUser.role !== "admin" && existingUser.role !== intendedRole) {
                      await mongoDb.collection("user").updateOne(filter, { $set: { role: intendedRole, updatedAt: new Date() } });
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.warn("Could not sync intended role in session create hook:", err);
          }
          return { data: session };
        },
      },
    },
    user: {
      create: {
        before: async (user, ctx) => {
          let selectedRole = (user as { role?: string })?.role;
          try {
            const context = ctx as { headers?: { get?: (name: string) => string | null; cookie?: string } } | undefined;
            const cookieHeader = context?.headers?.get ? context.headers.get("cookie") : context?.headers?.cookie;
            if (cookieHeader) {
              const match = cookieHeader.match(/fixmate_intended_role=([^;]+)/);
              if (match && match[1]) {
                const roleFromCookie = decodeURIComponent(match[1]).trim().toLowerCase();
                if (roleFromCookie === "technician" || roleFromCookie === "customer") {
                  selectedRole = roleFromCookie;
                }
              }
            }
          } catch (e) {
            console.warn("Could not read fixmate_intended_role cookie in create hook:", e);
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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
});
