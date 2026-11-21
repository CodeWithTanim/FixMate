"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  PlusCircle,
  Briefcase,
  ListOrdered,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface TechnicianStats {
  totalRequests: number;
  pendingRequests: number;
  inProgress: number;
  completed: number;
  totalServices: number;
  totalEarnings: number;
  recentRequests: Array<{
    id: string;
    serviceTitle: string;
    customerName: string;
    customerPhone: string;
    status: string;
    paymentStatus: string;
    finalAmount: number;
    createdAt: string;
  }>;
}

export default function TechnicianDashboard() {
  const [stats, setStats] = useState<TechnicianStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.get<{ stats: TechnicianStats }>("/api/stats/technician");
        setStats(res.stats);
      } catch (err) {
        console.error("Failed to load technician statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      label: "Service Requests",
      value: stats ? stats.totalRequests : 0,
      icon: Briefcase,
      desc: "Incoming customer repairs",
      color: "text-[#18756B] bg-[#18756B]/10",
    },
    {
      label: "In-Progress Jobs",
      value: stats ? stats.inProgress : 0,
      icon: Clock,
      desc: "Active repairs underway",
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Completed Repairs",
      value: stats ? stats.completed : 0,
      icon: CheckCircle,
      desc: "Successfully billed jobs",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Settled Revenue",
      value: `$${stats ? stats.totalEarnings.toFixed(2) : "0.00"}`,
      icon: DollarSign,
      desc: "Paid out via Stripe",
      color: "text-[#0B3638] bg-[#0B3638]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Technician Workbench</h1>
          <p className="text-xs text-[#526564] mt-0.5">
            Manage incoming repair requests, advance job milestones, and grow your service listings.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#18756B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Service</span>
          </Link>
          <Link
            href="/dashboard/technician/requests"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-white px-4 py-2.5 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF] transition shadow-2xs"
          >
            <Briefcase className="h-4 w-4" />
            <span>View Queue</span>
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

      {/* Visual Analytics Chart: Repair Pipeline & Status Distribution */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#DCE5DF] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#152C2B]">Repair Pipeline & Fulfillment Chart</h2>
            <p className="text-xs text-[#526564]">Proportional workflow distribution of assigned customer jobs</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[#526564]">Completed ({stats?.completed || 0})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block" />
              <span className="text-[#526564]">In Progress ({stats?.inProgress || 0})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="text-[#526564]">Pending ({stats?.pendingRequests || 0})</span>
            </span>
          </div>
        </div>

        {/* Proportional Distribution Bar */}
        <div className="space-y-2">
          {stats && stats.totalRequests > 0 ? (
            <>
              <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#F6F5EF] p-0.5 border border-[#DCE5DF]">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(((stats.completed || 0) / stats.totalRequests) * 100)
                    )}%`,
                  }}
                  title={`Completed: ${stats.completed}`}
                />
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500 ml-0.5"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(((stats.inProgress || 0) / stats.totalRequests) * 100)
                    )}%`,
                  }}
                  title={`In Progress: ${stats.inProgress}`}
                />
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500 ml-0.5"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(((stats.pendingRequests || 0) / stats.totalRequests) * 100)
                    )}%`,
                  }}
                  title={`Pending: ${stats.pendingRequests}`}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Fulfillment Rate</span>
                  <div className="text-lg font-black text-[#152C2B] mt-0.5">
                    {Math.round(((stats.completed || 0) / stats.totalRequests) * 100)}%
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Active Workload</span>
                  <div className="text-lg font-black text-indigo-700 mt-0.5">
                    {stats.inProgress} jobs
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Avg Revenue / Job</span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">
                    ${stats.completed > 0 ? (stats.totalEarnings / stats.completed).toFixed(2) : "0.00"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#F6F5EF]/60 border border-[#DCE5DF]/60">
                  <span className="text-[10px] text-[#526564] uppercase font-bold">Total Settled</span>
                  <div className="text-lg font-black text-[#0B3638] mt-0.5">
                    ${stats.totalEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-xs text-[#526564] italic">
              No customer requests received yet. Incoming bookings will populate real conversion bars.
            </div>
          )}
        </div>
      </div>

      {/* Queue & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#DCE5DF] pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#152C2B]">Recent Job Requests</h2>
              <p className="text-xs text-[#526564]">Customer repair jobs assigned to your profile</p>
            </div>
            <Link
              href="/dashboard/technician/requests"
              className="text-xs font-bold text-[#18756B] hover:underline flex items-center gap-1"
            >
              <span>Full Queue</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
              ))}
            </div>
          ) : !stats || stats.recentRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DCE5DF] p-8 text-center bg-[#F6F5EF]/50">
              <Wrench className="mx-auto h-8 w-8 text-[#526564]/40 mb-2" />
              <p className="text-xs font-bold text-[#152C2B]">No assigned repairs in queue</p>
              <p className="text-[11px] text-[#526564] mt-0.5">
                Ensure your listings are approved and available to receive new customer bookings.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#DCE5DF]/60 bg-[#F6F5EF]/30 hover:bg-[#F6F5EF] transition"
                >
                  <div className="min-w-0 pr-2">
                    <h3 className="text-xs font-bold text-[#152C2B] truncate">{r.serviceTitle}</h3>
                    <p className="text-[10px] text-[#526564] truncate">
                      Customer: {r.customerName} ({r.customerPhone}) • ${r.finalAmount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        r.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : r.status === "in-progress"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {r.status}
                    </span>
                    <Link
                      href="/dashboard/technician/requests"
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

        {/* Catalog Control Callout */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#DCE5DF] bg-[#0B3638] text-white p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-[#F4B740]">Technician Operations</h3>
            <p className="text-xs text-white/80 mt-2 leading-relaxed">
              Maintain professional service standards. Edit service rates or duration anytime; edits automatically resubmit for admin review to safeguard customer trust.
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span>Active Catalog Offerings:</span>
              <span className="font-bold text-white text-sm">{stats ? stats.totalServices : 0} services</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#526564]">Management Shortcuts</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/technician/my-services"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-[#18756B]" />
                  <span>My Active Service Listings</span>
                </span>
                <ArrowRight className="h-3 w-3 text-[#526564]" />
              </Link>
              <Link
                href="/dashboard/technician/add-service"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-[#18756B]" />
                  <span>Publish New Service Category</span>
                </span>
                <ArrowRight className="h-3 w-3 text-[#526564]" />
              </Link>
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] hover:bg-[#DCE5DF]/60 text-xs font-bold text-[#152C2B] transition"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#18756B]" />
                  <span>Update Technician Bio & Photo</span>
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
