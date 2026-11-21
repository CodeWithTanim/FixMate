import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handlers = toNextJsHandler(auth);

function withAuthErrors(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    try {
      const response = await handler(request);
      if (response.status < 500) return response;
    } catch (error) {
      console.error("Authentication request failed", {
        type: error instanceof Error ? error.name : "UnknownError",
      });
    }
    return NextResponse.json({
      code: "AUTH_SERVICE_UNAVAILABLE",
      message: "Authentication is temporarily unavailable. Please try again shortly.",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  };
}

export const GET = withAuthErrors(handlers.GET);
export const POST = withAuthErrors(handlers.POST);
