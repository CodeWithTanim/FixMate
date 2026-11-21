import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { publicAccountRole, withAccountRole, type AccountRole } from "@/lib/account-role";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const handlers = toNextJsHandler(async (request: Request) => {
  const auth = await getAuth();
  const path = new URL(request.url).pathname;
  const requestedRole = request.headers.get("x-fixmate-account-role");
  let role: AccountRole = request.method === "POST" && path.endsWith("/sign-in/email") && requestedRole === "admin"
    ? "admin"
    : publicAccountRole(requestedRole);
  if (request.method === "POST" && path.endsWith("/sign-up/email")) {
    const body = await request.clone().json().catch(() => ({}));
    role = publicAccountRole(body.role);
  }
  return withAccountRole(role, () => auth.handler(request));
});

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
