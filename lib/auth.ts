import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { mongoClient, mongoDb } from "./db";

const secret = process.env.BETTER_AUTH_SECRET || "fixmate-temporary-build-secret-key-minimum-32-chars";

const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : ["http://localhost:3000"];

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
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

      // Prevent role or email escalation in user update
      if (ctx.path === "/update-user") {
        const body = ctx.body as Record<string, unknown> | undefined;
        if (body) {
          delete body.role;
          delete body.email;
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
        before: async (user) => {
          const requested = user as { role?: string };
          const safeRole = requested.role === "technician" ? "technician" : "customer";
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
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
});
