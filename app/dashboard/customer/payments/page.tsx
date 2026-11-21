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
  FileText,
  Printer,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useFocusTrap } from "@/lib/useFocusTrap";
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
  const [selectedReceipt, setSelectedReceipt] = useState<CustomerPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const receiptModalRef = useFocusTrap(Boolean(selectedReceipt));

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await apiClient.get<{ data: CustomerPayment[] }>("/api/payments/my");
        setPayments(res.data || []);
      } catch (err: unknown) {
        const error = err as { message?: string };
        const msg = error.message || "Failed to load payment receipts";
        toast.error(msg);
        setFetchError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, [refreshKey]);

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
      ) : fetchError ? (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">Payment History Unavailable</h3>
            <p className="text-xs text-rose-800 dark:text-rose-300/80 mt-1 max-w-md mx-auto">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Retry Loading Receipts
          </button>
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

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-bold text-[#526564]">Amount Paid</div>
                    <div className="text-xl font-black text-emerald-700">
                      ${p.amount.toFixed(2)} <span className="text-xs font-semibold text-[#526564]">{p.currency.toUpperCase()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(p)}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-3 py-1.5 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#18756B]" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReceipt(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div
            ref={receiptModalRef}
            tabIndex={-1}
            className="relative w-full max-w-md rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-2xl space-y-6 focus:outline-hidden"
          >
            <div className="flex items-start justify-between border-b border-[#DCE5DF] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B]">
                  Official Settlement Receipt
                </span>
                <h3 id="receipt-dialog-title" className="text-lg font-black text-[#152C2B]">FixMate Repair Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close receipt dialog"
                className="p-1 rounded-lg text-[#526564] hover:bg-[#F6F5EF] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-[#DCE5DF]/60">
                <span className="text-[#526564]">Service Performed:</span>
                <strong className="text-[#152C2B] text-right">{selectedReceipt.serviceTitle}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE5DF]/60">
                <span className="text-[#526564]">Assigned Technician:</span>
                <span className="font-semibold text-[#152C2B]">{selectedReceipt.technicianName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE5DF]/60">
                <span className="text-[#526564]">Settlement Date:</span>
                <span>{new Date(selectedReceipt.createdAt).toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE5DF]/60">
                <span className="text-[#526564]">Payment Provider:</span>
                <span className="font-semibold text-[#18756B]">Stripe Test Gateway</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#DCE5DF]/60">
                <span className="text-[#526564]">Transaction Ref:</span>
                <span className="font-mono text-[10px] text-[#152C2B] truncate max-w-[200px]">
                  {selectedReceipt.stripePaymentIntentId || selectedReceipt.stripeSessionId}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-black text-[#152C2B] bg-[#F6F5EF] p-3 rounded-xl border border-[#DCE5DF]">
                <span>Total Amount Paid:</span>
                <span className="text-base text-emerald-700">
                  ${selectedReceipt.amount.toFixed(2)} {selectedReceipt.currency.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3638] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#152C2B] transition"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-5 py-2.5 text-xs font-bold text-[#526564] hover:bg-[#DCE5DF]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
