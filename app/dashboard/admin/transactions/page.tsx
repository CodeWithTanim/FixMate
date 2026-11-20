"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  Search,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  _id?: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  bookingId: string;
  serviceTitle: string;
  customerEmail: string;
  customerName: string;
  technicianEmail: string;
  technicianName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{
        data: Transaction[];
        totalRevenue: number;
        total: number;
      }>("/api/admin/payments");
      setPayments(res.data || []);
      setTotalRevenue(res.totalRevenue || 0);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to load transactions ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    return (
      p.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.technicianEmail.toLowerCase().includes(search.toLowerCase()) ||
      (p.stripeSessionId && p.stripeSessionId.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Financial Transactions Ledger</h1>
        <p className="text-xs text-[#526564] mt-0.5">
          Audited Stripe test-mode payments settled for completed repair orders across the marketplace.
        </p>
      </div>

      {/* Revenue Card Banner */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-[#0B3638] text-white p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">
            Gross Platform Settled Volume
          </span>
          <div className="mt-1 text-3xl font-black text-white flex items-center">
            <span>${totalRevenue.toFixed(2)}</span>
            <span className="text-xs font-normal text-white/60 ml-2">USD</span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Calculated strictly from verified Stripe payment fulfillments.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
          <ShieldCheck className="h-5 w-5 text-[#F4B740]" />
          <div className="text-xs">
            <div className="font-bold text-white">Stripe Webhook Verified</div>
            <div className="text-[10px] text-white/60">Zero unconfirmed entries</div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4 border-b border-[#DCE5DF] pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526564]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID, customer, technician, or service..."
            className="w-full rounded-xl border border-[#DCE5DF] bg-white pl-10 pr-4 py-2.5 text-xs text-[#152C2B] placeholder:text-[#526564]/60 focus:border-[#18756B] focus:outline-hidden"
          />
        </div>
        <div className="text-xs font-semibold text-[#526564]">
          {filteredPayments.length} Succeeded Payments
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <CreditCard className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No payment transactions recorded</h3>
          <p className="text-xs text-[#526564] mt-1">
            When customers complete payment on completed repair orders, transactions will log here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DCE5DF] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DCE5DF] bg-[#F6F5EF] text-[#526564] font-bold">
                  <th className="py-3 px-4">Transaction Reference</th>
                  <th className="py-3 px-4">Repair Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Settled Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5DF]">
                {filteredPayments.map((p) => {
                  const txId = p.id || p._id || p.stripeSessionId;

                  return (
                    <tr key={txId} className="hover:bg-[#F6F5EF]/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] font-bold text-[#152C2B] truncate max-w-[150px]">
                          {p.stripePaymentIntentId || p.stripeSessionId}
                        </div>
                        <div className="text-[10px] text-[#526564]">Booking: {p.bookingId}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#152C2B]">{p.serviceTitle}</td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="font-semibold text-[#152C2B] flex items-center gap-1">
                          <User className="h-3 w-3 text-[#18756B]" />
                          <span>{p.customerName || p.customerEmail}</span>
                        </div>
                        <div className="text-[11px]">{p.customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="font-semibold text-[#152C2B]">{p.technicianName || p.technicianEmail}</div>
                        <div className="text-[11px]">{p.technicianEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-black text-emerald-700 flex items-center">
                          <DollarSign className="h-3 w-3 text-emerald-600" />
                          <span>{p.amount.toFixed(2)}</span>
                          <span className="text-[10px] uppercase ml-1 text-[#526564]">{p.currency}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-[#526564]/60" />
                          <span>
                            {new Date(p.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>{p.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
