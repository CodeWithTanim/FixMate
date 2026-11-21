"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";
import JobTimelineModal, { StatusHistoryItem } from "@/components/JobTimelineModal";

interface Booking {
  id: string;
  _id?: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceImage: string;
  basePrice: number;
  finalAmount: number;
  technicianName: string;
  technicianEmail: string;
  customerPhone: string;
  serviceAddress: string;
  preferredDate: string;
  problemDescription: string;
  status: "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  statusHistory?: StatusHistoryItem[];
  createdAt: string;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Cancellation modal state
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Timeline modal state
  const [timelineBooking, setTimelineBooking] = useState<Booking | null>(null);

  // Payment loading state per booking ID
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get<{ data: Booking[] }>("/api/bookings/my");
        if (active) {
          setBookings(res.data || []);
        }
      } catch (err: unknown) {
        if (active) {
          const error = err as { message?: string };
          toast.error(error.message || "Failed to load bookings");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBookings();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;
    const bookingId = cancellingBooking.id || cancellingBooking._id;

    try {
      setCancelling(true);
      await apiClient.patch(`/api/bookings/${bookingId}/cancel`, {
        reason: cancelReason || "Customer cancelled request",
      });
      toast.success("Booking request cancelled successfully");
      setCancellingBooking(null);
      setCancelReason("");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async (booking: Booking) => {
    const bookingId = (booking.id || booking._id || "") as string;
    if (!bookingId) return;
    try {
      setPayingBookingId(bookingId);
      const res = await apiClient.post<{ url: string; sessionId: string }>(
        "/api/payments/create-checkout-session",
        { bookingId }
      );

      if (res.url) {
        window.location.assign(res.url);
      } else {
        toast.error("Unable to initialize checkout session");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Payment initiation failed");
      setPayingBookingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return ["requested", "accepted", "in-progress"].includes(b.status);
    return b.status === statusFilter;
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
      {/* Page Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">My Repair Bookings</h1>
          <p className="text-xs text-[#526564] mt-0.5">
            Monitor real-time repair progress, audit timestamps, and settle invoices upon completion.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs self-start sm:self-auto"
        >
          <span>Book Another Service</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE5DF] pb-3">
        {[
          { label: "All Bookings", value: "all" },
          { label: "Active Jobs", value: "active" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled / Rejected", value: "cancelled" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              statusFilter === tab.value
                ? "bg-[#0B3638] text-white shadow-xs"
                : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No repair bookings found</h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto mt-1 mb-5">
            You don&apos;t have any repair bookings in this view. Browse trusted technicians to schedule service.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const bookingId = b.id || b._id || "";
            const isCompleted = b.status === "completed";
            const isUnpaid = b.paymentStatus === "unpaid";
            const canCancel = b.status === "requested";

            return (
              <div
                key={bookingId}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs gap-5 transition hover:shadow-sm"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 max-w-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.serviceImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60"}
                    alt={b.serviceTitle}
                    className="h-20 w-20 rounded-xl object-cover shrink-0 border border-[#DCE5DF]"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B] bg-[#18756B]/10 px-2 py-0.5 rounded-md">
                        {b.serviceCategory}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                      {b.paymentStatus === "paid" ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid</span>
                        </span>
                      ) : b.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Payment Due</span>
                        </span>
                      ) : b.status === "cancelled" || b.status === "rejected" ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-200">
                          <span>N/A</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-200">
                          <span>Unpaid</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#152C2B]">{b.serviceTitle}</h3>
                    <p className="text-xs text-[#526564] line-clamp-1 italic">
                      &quot;{b.problemDescription}&quot;
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#526564] pt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-[#18756B]" />
                        <span>Technician: {b.technicianName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#18756B]" />
                        <span>
                          {new Date(b.preferredDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#18756B]" />
                        <span className="truncate max-w-[200px]">{b.serviceAddress}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DCE5DF]">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] uppercase font-bold text-[#526564] tracking-wider">
                      {isCompleted ? "Final Invoice" : "Base Estimate"}
                    </div>
                    <div className="text-xl font-black text-[#152C2B]">
                      ${b.finalAmount || b.basePrice}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Timeline Button */}
                    <button
                      onClick={() => setTimelineBooking(b)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-3 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition cursor-pointer"
                      title="Inspect repair status audit trail"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Timeline</span>
                    </button>

                    {/* Pay Now Button (if completed & unpaid) */}
                    {isCompleted && isUnpaid && (
                      <button
                        onClick={() => handlePayNow(b)}
                        disabled={payingBookingId === bookingId}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{payingBookingId === bookingId ? "Opening Checkout..." : `Pay $${b.finalAmount}`}</span>
                      </button>
                    )}

                    {/* Cancel Request Button */}
                    {canCancel && (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                        title="Cancel this pending request"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#152C2B]">Cancel Booking Request?</h3>
                <p className="text-xs text-[#526564]">
                  This will cancel your pending repair appointment.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#152C2B]">
                Cancellation Reason (Optional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let the technician know why you are cancelling..."
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs focus:border-[#18756B] focus:outline-hidden min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingBooking(null)}
                className="rounded-xl border border-[#DCE5DF] px-4 py-2 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF]"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Timeline Modal */}
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
