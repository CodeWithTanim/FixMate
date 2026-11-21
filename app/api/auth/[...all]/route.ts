import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  try {
    const res = await handlers.GET(req);
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
