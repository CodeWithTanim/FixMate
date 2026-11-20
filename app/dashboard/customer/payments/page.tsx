"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

interface CustomerPayment {
  id: string;
  _id?: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        const res = await apiClient.get<{ data: CustomerPayment[] }>("/api/payments/my");
        setPayments(res.data || []);
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to load payment receipts");
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Payment Receipts</h1>
          <p className="text-xs text-[#526564] mt-0.5">
            Verified invoice settlements for repairs completed by FixMate partner technicians.
          </p>
        </div>
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-white px-4 py-2.5 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF] transition shadow-2xs self-start sm:self-auto"
        >
          <span>Active Bookings</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#526564]">Total Settled Spending</div>
            <div className="text-2xl font-black text-[#152C2B]">${totalSpent.toFixed(2)} USD</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-[#526564]">Total Invoices Paid</div>
          <div className="text-xl font-bold text-[#18756B]">{payments.length}</div>
        </div>
      </div>

      {/* Receipts List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <CreditCard className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No payment receipts yet</h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto mt-1 mb-5">
            When a repair is completed, you can settle your bill directly using Stripe test card checkout.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition"
          >
            <span>Browse Repair Services</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const payId = p.id || p._id || p.stripeSessionId;

            return (
              <div
                key={payId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-[#DCE5DF] bg-white shadow-2xs gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Paid Succeeded</span>
                    </span>
                    <span className="text-[11px] text-[#526564] flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#526564]/60" />
                      <span>{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#152C2B]">{p.serviceTitle}</h3>
                  <div className="text-xs text-[#526564] flex items-center gap-1.5">
                    <Wrench className="h-3 w-3 text-[#18756B]" />
                    <span>Technician: {p.technicianName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-slate-400">Ref: {p.stripePaymentIntentId || p.stripeSessionId}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right self-end sm:self-center">
                  <div className="text-[10px] uppercase font-bold text-[#526564]">Amount Paid</div>
                  <div className="text-xl font-black text-emerald-700">
                    ${p.amount.toFixed(2)} <span className="text-xs font-semibold text-[#526564]">{p.currency.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
