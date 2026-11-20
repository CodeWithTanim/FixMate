import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Active session required to issue API token" },
        { status: 401 }
      );
    }

    const secretStr = process.env.JWT_SECRET;
    if (!secretStr) {
      return NextResponse.json(
        { error: "Configuration Error", message: "JWT secret is not configured" },
        { status: 500 }
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
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Token generation failed";
    return NextResponse.json({ error: "Server Error", message }, { status: 500 });
  }
}
