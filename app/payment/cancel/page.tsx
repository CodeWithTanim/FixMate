"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";

function PaymentCancelContent() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#DCE5DF] bg-white p-8 shadow-xl text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">
            Checkout Cancelled
          </h1>
          <p className="text-xs text-[#526564] leading-relaxed">
            No charge was made to your card. Your repair booking remains intact and marked completed. You can settle the payment whenever you are ready.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/dashboard/customer/bookings"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-5 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
          >
            <span>Return to My Bookings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-5 py-2.5 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-[#18756B] border-t-transparent animate-spin" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
