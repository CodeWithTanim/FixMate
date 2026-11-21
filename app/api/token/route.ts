import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export async function POST() {
  const noStoreHeaders = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const reqHeaders = await headers();

    // Validate origin header if present (browser requests)
    const origin = reqHeaders.get("origin");
    if (origin) {
      const normalizeOrigin = (val: string): string => {
        try {
          return new URL(val).origin.toLowerCase();
        } catch {
          return val.replace(/\/+$/, "").toLowerCase();
        }
      };

      const trustedList = process.env.BETTER_AUTH_TRUSTED_ORIGINS
        ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
        : [];
      const isDev = process.env.NODE_ENV !== "production";
      const devLoopbacks = isDev ? ["http://localhost:3000", "http://127.0.0.1:3000"] : [];
      const allowedOrigins = [
        ...devLoopbacks,
        process.env.BETTER_AUTH_URL,
        process.env.JWT_ISSUER,
        process.env.CLIENT_URL,
        ...trustedList,
      ].filter(Boolean) as string[];

      const normalizedReqOrigin = normalizeOrigin(origin);
      const normalizedAllowed = allowedOrigins.map(normalizeOrigin);

      const isAllowed = normalizedAllowed.includes(normalizedReqOrigin);
      if (!isAllowed) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden", message: "Origin not allowed to issue tokens" }),
          { status: 403, headers: noStoreHeaders }
        );
      }
    }

    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized", message: "Active session required to issue API token" }),
        { status: 401, headers: noStoreHeaders }
      );
    }

    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) {
      return new NextResponse(
        JSON.stringify({ error: "Configuration Error", message: "Server token configuration unavailable" }),
        { status: 500, headers: noStoreHeaders }
      );
    }

    const issuer = process.env.JWT_ISSUER || "http://localhost:3000";
    const audience = process.env.JWT_AUDIENCE || "fixmate-api";
    const secretKey = new TextEncoder().encode(secretStr);

    const user = session.user as { id: string; email: string; role?: string };
    const role = user.role || "customer";

    const token = await new SignJWT({
      email: user.email,
      role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(secretKey);

    return new NextResponse(
      JSON.stringify({
        token,
        expiresIn: 300,
        tokenType: "Bearer",
      }),
      {
        status: 200,
        headers: noStoreHeaders,
      }
    );
  } catch (err: unknown) {
    console.error("Token issuance failed:", err instanceof Error ? err.message : err);
    return new NextResponse(
      JSON.stringify({ error: "Server Error", message: "Failed to generate API token" }),
      { status: 500, headers: noStoreHeaders }
    );
  }
}
