import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handlers = toNextJsHandler(auth.handler);

export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req);
  } catch (err) {
    console.error("Auth GET error:", err);
    return NextResponse.json(
      { error: "Internal Auth Error", message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req);
  } catch (err) {
    console.error("Auth POST error:", err);
    return NextResponse.json(
      { error: "Internal Auth Error", message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
