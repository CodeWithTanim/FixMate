"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  CalendarCheck,
  Search,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface CustomerStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalSpent: number;
  recentBookings: Array<{
    id: string;
    serviceTitle: string;
    technicianName: string;
    status: string;
    paymentStatus: string;
    finalAmount: number;
    createdAt: string;
  }>;
}

export default function CustomerDashboard() {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.get<{ stats: CustomerStats }>("/api/stats/customer");
        setStats(res.stats);
      } catch (err) {
        console.error("Failed to load customer statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats ? stats.totalBookings : 0,
      icon: FileText,
      desc: "All lifetime repairs requested",
      color: "text-[#18756B] bg-[#18756B]/10",
    },
    {
      label: "Active Repairs",
      value: stats ? stats.activeBookings : 0,
      icon: Clock,
      desc: "Jobs currently being processed",
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Completed",
      value: stats ? stats.completedBookings : 0,
      icon: CheckCircle,
      desc: "Successfully resolved repairs",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Total Spent",
      value: `$${stats ? stats.totalSpent.toFixed(2) : "0.00"}`,
      icon: DollarSign,
      desc: "Completed & settled repair bills",
      color: "text-[#0B3638] bg-[#0B3638]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Customer Portal</h1>
          <p className="text-xs text-[#526564] mt-0.5">
            Overview of your active device repair requests, quotes, and payment history.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs self-start sm:self-auto"
        >
          <Search className="h-4 w-4" />
          <span>Find a Technician</span>
        </Link>
      </div>

      {/* Real Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#526564]">{s.label}</span>
                <div className={`rounded-xl p-2.5 ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-black text-[#152C2B]">
                {loading ? <span className="text-slate-300">...</span> : s.value}
              </div>
              <p className="mt-1 text-[11px] text-[#526564]">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Chart: Repair Status Distribution & Expenditure */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#DCE5DF] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#152C2B]">Repair Activity & Resolution Breakdown</h2>
            <p className="text-xs text-[#526564]">Proportional lifecycle metrics across all your service requests</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[#526564]">Completed ({stats?.completedBookings || 0})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="text-[#526564]">Active ({stats?.activeBookings || 0})</span>
            </span>
          </div>
        </div>

        {/* Visual Progress Bar Chart */}
        <div className="space-y-2">
          {stats && stats.totalBookings > 0 ? (
            <>
              <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#F6F5EF] p-0.5 border border-[#DCE5DF]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(((stats.completedBookings || 0) / stats.totalBookings) * 100)
                    )}%`,
                  }}
                  title={`Completed: ${stats.completedBookings}`}
                />
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500 ml-0.5"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(((stats.activeBookings || 0) / stats.totalBookings) * 100)
                    )}%`,
                  }}
                  title={`Active: ${stats.activeBookings}`}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Resolution Rate</span>
                  <div className="text-lg font-black text-[#152C2B] mt-0.5">
                    {Math.round(((stats.completedBookings || 0) / stats.totalBookings) * 100)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Avg Cost Per Repair</span>
                  <div className="text-lg font-black text-[#152C2B] mt-0.5">
                    ${stats.completedBookings > 0 ? (stats.totalSpent / stats.completedBookings).toFixed(2) : "0.00"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Settled Bills</span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">
                    ${stats.totalSpent.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Pipeline Stage</span>
                  <div className="text-lg font-black text-[#18756B] mt-0.5">
                    {stats.activeBookings > 0 ? "Underway" : "Ready"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#526564] italic">
              No service requests recorded yet. Bookings will generate real distribution charts here.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Recent Bookings */}
        <div className="lg:col-span-2 rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCE5DF] pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#152C2B]">Recent Repair Requests</h2>
              <p className="text-xs text-[#526564]">Latest updates on your pending and active jobs</p>
            </div>
            <Link
              href="/dashboard/customer/bookings"
              className="text-xs font-bold text-[#18756B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
              ))}
            </div>
          ) : !stats || stats.recentBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DCE5DF] p-8 text-center bg-[#F6F5EF]/50">
              <CalendarCheck className="mx-auto h-8 w-8 text-[#526564]/40 mb-2" />
              <p className="text-xs font-bold text-[#152C2B]">No active bookings yet</p>
              <p className="text-[11px] text-[#526564] mt-0.5">
                Ready for a fix? Browse vetted local technicians to schedule your repair.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#DCE5DF]/60 bg-[#F6F5EF]/30 hover:bg-[#F6F5EF] transition"
                >
                  <div className="min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-[#152C2B] truncate">{b.serviceTitle}</h3>
                    <p className="text-[10px] text-[#526564] truncate">
                      Tech: {b.technicianName} • ${b.finalAmount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        b.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : b.status === "in-progress"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {b.status}
                    </span>
                    <Link
                      href="/dashboard/customer/bookings"
                      className="p-1.5 rounded-lg border border-[#DCE5DF] bg-white text-[#526564] hover:text-[#152C2B]"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right col: Safe Payment & Policy Callout */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#DCE5DF] bg-[#0B3638] text-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-[#F4B740]">Pay-After-Completion Guarantee</h3>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              You never pay upfront. Technicians only submit invoices after the repair is completed to your satisfaction. All payments are securely processed with Stripe test-mode encryption.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Card / Online Checkout</span>
              <span className="font-bold text-white">Zero Deposit</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#526564]">Customer Actions</h3>
            <div className="space-y-2">
              <Link
                href="/services"
                className="block p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                Browse All 7 Service Categories
              </Link>
              <Link
                href="/dashboard/customer/payments"
                className="block p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                View Succeeded Payment Receipts
              </Link>
              <Link
                href="/dashboard/profile"
                className="block p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                Update Service Address & Phone
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
