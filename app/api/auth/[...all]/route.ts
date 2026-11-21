import { auth } from "@/lib/auth";
import { mongoDb } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  try {
    const res = await handlers.GET(req);

    // Synchronize intended role (technician or customer) on OAuth callback
    if (req.nextUrl.pathname.includes("/callback/google")) {
      try {
        const intendedRole = req.cookies.get("fixmate_intended_role")?.value?.trim().toLowerCase();
        if (intendedRole === "technician" || intendedRole === "customer") {
          const setCookie = res.headers.get("set-cookie") || "";
          const tokenMatch = setCookie.match(/better-auth\.session_token=([^;]+)/);
          if (tokenMatch && tokenMatch[1]) {
            const tokenVal = decodeURIComponent(tokenMatch[1]).split(".")[0];
            const sessionDoc = await mongoDb.collection("session").findOne({
              $or: [{ token: tokenVal }, { sessionToken: tokenVal }],
            });
            if (sessionDoc?.userId) {
              const { ObjectId } = await import("mongodb");
              const uid = String(sessionDoc.userId);
              const filter = ObjectId.isValid(uid) ? { $or: [{ _id: new ObjectId(uid) }, { id: uid }] } : { id: uid };
              const user = await mongoDb.collection("user").findOne(filter);
              if (user && user.role !== "admin" && user.role !== intendedRole) {
                await mongoDb.collection("user").updateOne(filter, { $set: { role: intendedRole, updatedAt: new Date() } });
              }
            }
          }
        }
      } catch (err) {
        console.warn("OAuth callback role sync non-fatal error:", err);
      }
    }

    if (res.status >= 500) {
      const cloned = res.clone();
      const text = await cloned.text().catch(() => "");
      return NextResponse.json(
        {
          error: "BetterAuth 5xx Response",
          status: res.status,
          body: text,
          hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID),
          hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
          hasMongoUri: Boolean(process.env.MONGODB_URI),
          hasAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
          authUrl: process.env.BETTER_AUTH_URL,
        },
        { status: res.status }
      );
    }
    return res;
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        error: "BetterAuth GET Caught Exception",
        message: error.message,
        stack: error.stack,
        hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID),
        hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
        hasMongoUri: Boolean(process.env.MONGODB_URI),
        hasAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
        authUrl: process.env.BETTER_AUTH_URL,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const res = await handlers.POST(req);
    if (res.status >= 500) {
      const cloned = res.clone();
      const text = await cloned.text().catch(() => "");
      return NextResponse.json(
        {
          error: "BetterAuth 5xx Response",
          status: res.status,
          body: text,
          hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID),
          hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
          hasMongoUri: Boolean(process.env.MONGODB_URI),
          hasAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
          authUrl: process.env.BETTER_AUTH_URL,
        },
        { status: res.status }
      );
    }
    return res;
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        error: "BetterAuth POST Caught Exception",
        message: error.message,
        stack: error.stack,
        hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID),
        hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
        hasMongoUri: Boolean(process.env.MONGODB_URI),
        hasAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
        authUrl: process.env.BETTER_AUTH_URL,
      },
      { status: 500 }
    );
  }
}
