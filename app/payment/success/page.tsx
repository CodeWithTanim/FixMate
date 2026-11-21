"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck, RefreshCw, Wrench } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface PaymentReceipt {
  transactionId: string;
  amount: number;
  currency: string;
  serviceTitle: string;
  createdAt: string;
  bookingId: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  const [verifying, setVerifying] = useState(Boolean(sessionId && bookingId));
  const [verified, setVerified] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    !sessionId || !bookingId ? "Missing session or booking reference in payment callback." : null
  );
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    if (!sessionId || !bookingId) {
      return;
    }

    let active = true;
    async function doVerify() {
      try {
        setErrorMsg(null);
        const res = await apiClient.get<{
          success: boolean;
          booking?: { _id?: string; serviceTitle?: string; finalAmount?: number; basePrice?: number };
          payment?: {
            id?: string;
            transactionId?: string;
            stripePaymentIntentId?: string;
            stripeSessionId?: string;
            amount?: number;
            currency?: string;
            createdAt?: string;
          };
        }>(
          `/api/payments/verify?session_id=${encodeURIComponent(sessionId!)}&booking_id=${encodeURIComponent(bookingId!)}`
        );

        if (active) {
          if (res.success) {
            setReceipt({
              transactionId: res.payment?.transactionId || res.payment?.stripePaymentIntentId || sessionId!,
              amount: res.payment?.amount ?? res.booking?.finalAmount ?? res.booking?.basePrice ?? 0,
              currency: (res.payment?.currency || "USD").toUpperCase(),
              serviceTitle: res.booking?.serviceTitle || "Repair Service",
              createdAt: res.payment?.createdAt || new Date().toISOString(),
              bookingId: (res.booking?._id || bookingId!) as string,
            });
            setVerified(true);
          } else {
            setErrorMsg("Payment verification could not be confirmed.");
          }
        }
      } catch (err: unknown) {
        if (active) {
          const error = err as { message?: string };
          setErrorMsg(error.message || "Failed to verify Stripe payment fulfillment.");
        }
      } finally {
        if (active) {
          setVerifying(false);
        }
      }
    }

    doVerify();
    return () => {
      active = false;
    };
  }, [sessionId, bookingId, retryTrigger]);

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
        ) : verified && receipt ? (
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
                Thank you! Your payment has been successfully recorded in the platform ledger. The technician and repair history have been updated.
              </p>
            </div>

            {/* Authoritative Receipt Details per PDF p.12 */}
            <div className="rounded-2xl border border-[#DCE5DF] bg-[#F6F5EF] p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#DCE5DF]">
                <span className="text-[#526564]">Service:</span>
                <span className="font-bold text-[#152C2B] text-right truncate max-w-[200px]">
                  {receipt.serviceTitle}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#526564]">Settled Amount:</span>
                <span className="font-black text-base text-[#18756B]">
                  ${receipt.amount.toFixed(2)} {receipt.currency}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#526564]">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  Paid in Full
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#526564]">Transaction ID:</span>
                <span className="font-mono text-[10px] text-[#152C2B] truncate max-w-[180px]" title={receipt.transactionId}>
                  {receipt.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#526564]">Booking ID:</span>
                <span className="font-mono text-[10px] text-[#526564] truncate max-w-[180px]">
                  {receipt.bookingId}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/dashboard/customer/bookings"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-5 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
              >
                <span>Return to My Bookings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-white px-5 py-2.5 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF] transition"
              >
                <Wrench className="h-3.5 w-3.5 text-[#18756B]" />
                <span>Browse More Services</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#152C2B]">Verification Pending or Interrupted</h2>
              <p className="text-xs text-[#526564] leading-relaxed">
                {errorMsg || "We could not immediately verify this transaction against Stripe."}
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setVerifying(true);
                  setRetryTrigger((t) => t + 1);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-5 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Verification</span>
              </button>

              <Link
                href="/dashboard/customer/bookings"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-white px-5 py-2.5 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF] transition"
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
