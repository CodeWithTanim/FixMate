"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  User,
  DollarSign,
  Calendar,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";
import JobTimelineModal, { StatusHistoryItem } from "@/components/JobTimelineModal";

interface AdminBooking {
  id: string;
  _id?: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  basePrice: number;
  finalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  technicianName: string;
  technicianEmail: string;
  preferredDate: string;
  status: "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  statusHistory?: StatusHistoryItem[];
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timelineBooking, setTimelineBooking] = useState<AdminBooking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: AdminBooking[] }>("/api/admin/bookings");
      setBookings(res.data || []);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to load platform bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesSearch =
      b.serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.technicianEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "accepted":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "in-progress":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "completed":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "cancelled":
      case "rejected":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Platform Bookings Monitor</h1>
        <p className="text-xs text-[#526564] mt-0.5">
          Read-only surveillance of repair lifecycle events, technician assignments, and payment statuses across all users.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#DCE5DF] pb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526564]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service, customer, or tech..."
            className="w-full rounded-xl border border-[#DCE5DF] bg-white pl-10 pr-4 py-2.5 text-xs text-[#152C2B] placeholder:text-[#526564]/60 focus:border-[#18756B] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Bookings", value: "all" },
            { label: "Requested", value: "requested" },
            { label: "In-Progress", value: "in-progress" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled / Rejected", value: "cancelled" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-[#0B3638] text-white shadow-xs"
                  : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No platform bookings found</h3>
          <p className="text-xs text-[#526564] mt-1">Bookings submitted by customers will be tracked here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DCE5DF] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DCE5DF] bg-[#F6F5EF] text-[#526564] font-bold">
                  <th className="py-3 px-4">Service & Category</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Appt Date</th>
                  <th className="py-3 px-4">Invoice Amount</th>
                  <th className="py-3 px-4">Job Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5DF]">
                {filteredBookings.map((b) => {
                  const bookingId = b.id || b._id || "";

                  return (
                    <tr key={bookingId} className="hover:bg-[#F6F5EF]/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#152C2B] line-clamp-1">{b.serviceTitle}</div>
                        <span className="text-[10px] text-[#18756B] bg-[#18756B]/10 px-1.5 py-0.2 rounded font-semibold">
                          {b.serviceCategory}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="font-semibold text-[#152C2B] flex items-center gap-1">
                          <User className="h-3 w-3 text-[#18756B]" />
                          <span>{b.customerName}</span>
                        </div>
                        <div className="text-[11px]">{b.customerEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="font-semibold text-[#152C2B]">{b.technicianName}</div>
                        <div className="text-[11px]">{b.technicianEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-[#526564]/60" />
                          <span>
                            {new Date(b.preferredDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-black text-[#152C2B] flex items-center">
                          <DollarSign className="h-3 w-3 text-[#18756B]" />
                          <span>{b.finalAmount || b.basePrice}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                            b.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {b.paymentStatus === "paid" ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                          <span>{b.paymentStatus === "paid" ? "Paid" : "Unpaid"}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setTimelineBooking(b)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#DCE5DF] bg-[#F6F5EF] p-1.5 text-[#152C2B] hover:bg-[#DCE5DF] transition cursor-pointer"
                          title="View job audit trail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {timelineBooking && (
        <JobTimelineModal
          isOpen={Boolean(timelineBooking)}
          onClose={() => setTimelineBooking(null)}
          serviceTitle={timelineBooking.serviceTitle}
          bookingId={timelineBooking.id || timelineBooking._id || ""}
          statusHistory={timelineBooking.statusHistory}
        />
      )}
    </div>
  );
}
