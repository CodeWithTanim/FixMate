import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAuth } from "@/lib/auth";
import { mongoDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const reqHeaders = await headers();
    const session = await (await getAuth()).api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetRole = String(body.role || "").trim().toLowerCase();

    if (targetRole !== "customer" && targetRole !== "technician") {
      return NextResponse.json(
        { error: "Invalid role. Role must be 'customer' or 'technician'." },
        { status: 400 }
      );
    }

    const currentUser = session.user as Record<string, unknown>;
    // Protect admin accounts from role modifications
    if (currentUser.role === "admin") {
      return NextResponse.json(
        { error: "Admin role cannot be switched." },
        { status: 403 }
      );
    }

    const rawId = String(currentUser.id || currentUser._id || "");
    const filter = ObjectId.isValid(rawId)
      ? { $or: [{ _id: new ObjectId(rawId) }, { id: rawId }] }
      : { id: rawId };

    await mongoDb.collection("user").updateOne(filter, {
      $set: {
        role: targetRole,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      role: targetRole,
      redirectUrl: `/dashboard/${targetRole}`,
    });
  } catch (err: unknown) {
    console.error("Switch role error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
