"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  DollarSign,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface AdminStats {
  totalUsers: number;
  customersCount: number;
  techniciansCount: number;
  totalServices: number;
  pendingServicesCount: number;
  approvedServicesCount: number;
  totalBookings: number;
  activeBookingsCount: number;
  completedBookingsCount: number;
  totalRevenue: number;
  recentBookings: Array<{
    id: string;
    serviceTitle: string;
    customerEmail: string;
    technicianEmail: string;
    status: string;
    finalAmount: number;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.get<{ stats: AdminStats }>("/api/stats/admin");
        setStats(res.stats);
      } catch (err) {
        console.error("Failed to load admin statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Platform Users",
      value: stats ? stats.totalUsers : 0,
      icon: Users,
      desc: `${stats ? stats.techniciansCount : 0} Technicians, ${stats ? stats.customersCount : 0} Customers`,
      color: "text-[#18756B] bg-[#18756B]/10",
    },
    {
      label: "Pending Services",
      value: stats ? stats.pendingServicesCount : 0,
      icon: Clock,
      desc: "Services awaiting admin moderation",
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Active Bookings",
      value: stats ? stats.activeBookingsCount : 0,
      icon: Briefcase,
      desc: "Repairs requested or underway",
      color: "text-sky-700 bg-sky-50",
    },
    {
      label: "Total Succeeded Revenue",
      value: `$${stats ? stats.totalRevenue.toFixed(2) : "0.00"}`,
      icon: DollarSign,
      desc: "Settled payments verified via Stripe",
      color: "text-[#0B3638] bg-[#0B3638]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Admin Oversight Center</h1>
          <p className="text-xs text-[#526564] mt-0.5">
            Platform governance, service review workflow, user role delegation, and live financial metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/admin/services"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#18756B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Review Listings ({stats ? stats.pendingServicesCount : 0})</span>
          </Link>
        </div>
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

      {/* Visual Analytics Chart: Platform Booking Distribution & Revenue Overview */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#DCE5DF] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#152C2B]">Platform Workflow & Lifecycle Distribution</h2>
            <p className="text-xs text-[#526564]">System-wide proportions across all repair bookings</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[#526564]">Completed ({stats?.completedBookingsCount || 0})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-[#526564]">Active ({stats?.activeBookingsCount || 0})</span>
            </span>
          </div>
        </div>

        {/* Visual Proportional Bar */}
        <div className="space-y-2">
          {stats && stats.totalBookings > 0 ? (
            <>
              <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#F6F5EF] p-0.5 border border-[#DCE5DF]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${(stats.completedBookingsCount || 0) > 0 ? Math.max(5, Math.round(((stats.completedBookingsCount || 0) / stats.totalBookings) * 100)) : 0}%`,
                  }}
                  title={`Completed: ${stats.completedBookingsCount}`}
                />
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500 ml-0.5"
                  style={{
                    width: `${(stats.activeBookingsCount || 0) > 0 ? Math.max(5, Math.round(((stats.activeBookingsCount || 0) / stats.totalBookings) * 100)) : 0}%`,
                  }}
                  title={`Active: ${stats.activeBookingsCount}`}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Platform Resolution</span>
                  <div className="text-lg font-black text-[#152C2B] mt-0.5">
                    {Math.round(((stats.completedBookingsCount || 0) / stats.totalBookings) * 100)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Total Platform Users</span>
                  <div className="text-lg font-black text-[#18756B] mt-0.5">
                    {stats.totalUsers} registered
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Active Listings</span>
                  <div className="text-lg font-black text-[#152C2B] mt-0.5">
                    {stats.totalServices} catalog items
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Total Processed</span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">
                    ${stats.totalRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#526564] italic">
              No platform bookings recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Platform Bookings & Admin Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Platform Bookings */}
        <div className="lg:col-span-2 rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCE5DF] pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#152C2B]">Recent Platform Jobs</h2>
              <p className="text-xs text-[#526564]">Real-time audit of repair bookings between customers and technicians</p>
            </div>
            <Link
              href="/dashboard/admin/bookings"
              className="text-xs font-bold text-[#18756B] hover:underline flex items-center gap-1"
            >
              <span>All Bookings</span>
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
              <CheckCircle className="mx-auto h-8 w-8 text-[#526564]/40 mb-2" />
              <p className="text-xs font-bold text-[#152C2B]">No repair bookings in system yet</p>
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
                      Customer: {b.customerEmail} • Tech: {b.technicianEmail} • ${b.finalAmount}
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
                      href="/dashboard/admin/bookings"
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

        {/* Administration Controls */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#DCE5DF] bg-[#0B3638] text-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-[#F4B740]">System Governance</h3>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              Verify technician credentials before approving service listings. User role promotions take effect on the next session token refresh.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Engine Status:</span>
              <span className="font-medium text-emerald-300">Core Engine Active • Integrations Standby</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#526564]">Management Modules</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/admin/services"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#18756B]" />
                  <span>Service Moderation Queue</span>
                </span>
                <ArrowRight className="h-3 w-3 text-[#526564]" />
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#18756B]" />
                  <span>User Role Management</span>
                </span>
                <ArrowRight className="h-3 w-3 text-[#526564]" />
              </Link>
              <Link
                href="/dashboard/admin/transactions"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#18756B]" />
                  <span>Stripe Financial Ledger</span>
                </span>
                <ArrowRight className="h-3 w-3 text-[#526564]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
