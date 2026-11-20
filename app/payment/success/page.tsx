"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api/client";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || !bookingId) {
        setErrorMsg("Missing session or booking reference in payment callback.");
        setVerifying(false);
        return;
      }

      try {
        await apiClient.get(
          `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}&booking_id=${encodeURIComponent(bookingId)}`
        );
        setVerified(true);
      } catch (err: unknown) {
        const error = err as { message?: string };
        setErrorMsg(error.message || "Failed to verify Stripe payment fulfillment.");
      } finally {
        setVerifying(false);
      }
    }

    verifyPayment();
  }, [sessionId, bookingId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#DCE5DF] bg-white p-8 shadow-xl text-center space-y-6">
        {verifying ? (
          <div className="py-8 space-y-4">
            <Loader2 className="mx-auto h-12 w-12 text-[#18756B] animate-spin" />
            <h2 className="text-lg font-bold text-[#152C2B]">Verifying Stripe Settlement...</h2>
            <p className="text-xs text-[#526564]">
              Confirming transaction tokens with Stripe test infrastructure.
            </p>
          </div>
        ) : verified ? (
          <div className="space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Payment Confirmed</span>
              </div>
              <h1 className="text-2xl font-black text-[#152C2B] tracking-tight pt-2">
                Repair Invoice Settled!
              </h1>
              <p className="text-xs text-[#526564] leading-relaxed">
                Thank you! Your payment has been successfully processed and recorded. The technician and repair log have been updated.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE5DF] bg-[#F6F5EF] p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#526564]">Status:</span>
                <span className="font-bold text-emerald-700">Paid in Full</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526564]">Session ID:</span>
                <span className="font-mono text-[10px] text-[#152C2B] truncate max-w-[180px]">
                  {sessionId}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard/customer/bookings"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-5 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
              >
                <span>Return to My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#152C2B]">Payment Notice</h2>
              <p className="text-xs text-[#526564] leading-relaxed">
                {errorMsg || "We could not immediately verify this transaction."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard/customer/bookings"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3638] px-5 py-3 text-xs font-bold text-white hover:bg-[#152C2B] transition"
              >
                <span>Go to My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#18756B] animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
