import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default async function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const session = await (await getAuth()).api.getSession({
    headers: reqHeaders,
  });

  const pathname = reqHeaders.get("x-pathname") || "/payment/success";
  const search = reqHeaders.get("x-search") || "";
  const fullTarget = pathname + search;

  if (!session || !session.user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(fullTarget)}`);
  }

  const role = (session.user as { role?: string }).role || "customer";
  if (role !== "customer") {
    if (role === "admin") redirect("/dashboard/admin");
    else redirect("/dashboard/technician");
  }

  // Prevent direct navigation: customer can only visit with legitimate checkout callback parameters
  const params = new URLSearchParams(search);
  if (pathname.includes("/payment/success")) {
    const sessionId = params.get("session_id");
    const bookingId = params.get("booking_id");
    if (!sessionId || !bookingId) {
      redirect("/dashboard/customer/bookings");
    }
  }

  if (pathname.includes("/payment/cancel")) {
    const bookingId = params.get("booking_id");
    if (!bookingId) {
      redirect("/dashboard/customer/bookings");
    }
  }

  return <>{children}</>;
}
