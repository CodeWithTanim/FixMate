"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Eye,
  CheckCircle2,
  XCircle,
  Play,
  Check,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";
import JobTimelineModal, { StatusHistoryItem } from "@/components/JobTimelineModal";

interface BookingRequest {
  id: string;
  _id?: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceImage: string;
  basePrice: number;
  finalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceAddress: string;
  preferredDate: string;
  problemDescription: string;
  status: "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  statusHistory?: StatusHistoryItem[];
  createdAt: string;
}

export default function TechnicianRequestsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Rejection modal state
  const [rejectingBooking, setRejectingBooking] = useState<BookingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Completion modal state
  const [completingBooking, setCompletingBooking] = useState<BookingRequest | null>(null);
  const [completionAmount, setCompletionAmount] = useState("");
  const [completionNote, setCompletionNote] = useState("");

  // Timeline modal state
  const [timelineBooking, setTimelineBooking] = useState<BookingRequest | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: BookingRequest[] }>("/api/bookings/technician");
      setRequests(res.data || []);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (
    bookingId: string,
    targetStatus: string,
    options?: { note?: string; finalAmount?: number }
  ) => {
    try {
      setSubmittingAction(true);
      await apiClient.patch(`/api/bookings/${bookingId}/status`, {
        status: targetStatus,
        note: options?.note,
        finalAmount: options?.finalAmount,
      });

      toast.success(`Job marked as ${targetStatus}`);
      setRejectingBooking(null);
      setRejectReason("");
      setCompletingBooking(null);
      setCompletionAmount("");
      setCompletionNote("");
      fetchRequests();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to update status");
    } finally {
      setSubmittingAction(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
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
        <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">
          Repair Service Queue
        </h1>
        <p className="text-xs text-[#526564] mt-0.5">
          Review customer repair requests, advance work through the service pipeline, and submit final invoices.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE5DF] pb-3">
        {[
          { label: "All Requests", value: "all" },
          { label: "Pending Review", value: "requested" },
          { label: "Accepted", value: "accepted" },
          { label: "In-Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
          { label: "Rejected / Cancelled", value: "rejected" },
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

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <Clock className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No repair requests in this view</h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto mt-1">
            New customer requests for your listings will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((r) => {
            const bookingId = r.id || r._id || "";
            const isRequested = r.status === "requested";
            const isAccepted = r.status === "accepted";
            const isInProgress = r.status === "in-progress";

            return (
              <div
                key={bookingId}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs gap-5"
              >
                {/* Customer & Issue Info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B] bg-[#18756B]/10 px-2 py-0.5 rounded-md">
                      {r.serviceCategory}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                        r.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {r.paymentStatus === "paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      <span>{r.paymentStatus === "paid" ? "Paid" : "Unpaid"}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#152C2B]">{r.serviceTitle}</h3>
                  <div className="p-3 bg-[#F6F5EF] rounded-xl border border-[#DCE5DF]/60 text-xs text-[#152C2B]">
                    <span className="font-bold text-[#526564] block mb-0.5">Problem Reported:</span>
                    <p className="leading-relaxed">&quot;{r.problemDescription}&quot;</p>
                  </div>

                  {/* Customer details */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#526564] pt-1">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#18756B]" />
                      <strong className="text-[#152C2B]">{r.customerName}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#18756B]" />
                      <a href={`tel:${r.customerPhone}`} className="hover:underline text-[#18756B] font-semibold">
                        {r.customerPhone}
                      </a>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#18756B]" />
                      <span>
                        Appt: {new Date(r.preferredDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#18756B]" />
                      <span className="truncate max-w-[220px]">{r.serviceAddress}</span>
                    </span>
                  </div>
                </div>

                {/* Pipeline Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#DCE5DF]">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] uppercase font-bold text-[#526564] tracking-wider">
                      {r.status === "completed" ? "Final Amount" : "Base Rate"}
                    </div>
                    <div className="text-xl font-black text-[#152C2B]">
                      ${r.finalAmount || r.basePrice}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Timeline Button */}
                    <button
                      onClick={() => setTimelineBooking(r)}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-3 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Audit</span>
                    </button>

                    {/* Stage 1: Requested -> Accept or Reject */}
                    {isRequested && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(bookingId, "accepted", { note: "Technician accepted request" })}
                          disabled={submittingAction}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => setRejectingBooking(r)}
                          disabled={submittingAction}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* Stage 2: Accepted -> Start Work */}
                    {isAccepted && (
                      <button
                        onClick={() => handleUpdateStatus(bookingId, "in-progress", { note: "Technician commenced repair work" })}
                        disabled={submittingAction}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 transition cursor-pointer disabled:opacity-50"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {/* Stage 3: In-Progress -> Complete Repair */}
                    {isInProgress && (
                      <button
                        onClick={() => {
                          setCompletingBooking(r);
                          setCompletionAmount(String(r.basePrice));
                        }}
                        disabled={submittingAction}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Complete Repair</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Request Dialog */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#152C2B]">Decline Booking Request?</h3>
                <p className="text-xs text-[#526564]">
                  Please specify why you cannot take this job.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#152C2B]">Decline Reason</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Parts currently unavailable / outside coverage zone..."
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs focus:border-[#18756B] focus:outline-hidden min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingBooking(null)}
                className="rounded-xl border border-[#DCE5DF] px-4 py-2 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF]"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(
                    rejectingBooking.id || rejectingBooking._id || "",
                    "rejected",
                    { note: rejectReason || "Declined by technician" }
                  )
                }
                disabled={submittingAction}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {submittingAction ? "Updating..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Repair Dialog (Captures positive finalAmount) */}
      {completingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="p-2.5 rounded-full bg-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#152C2B]">Complete Repair Service</h3>
                <p className="text-xs text-[#526564]">
                  Record final billable amount and completion notes for customer invoicing.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#152C2B] flex items-center gap-1 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-[#18756B]" />
                  <span>Final Billable Amount ($ USD) *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={completionAmount}
                  onChange={(e) => setCompletionAmount(e.target.value)}
                  placeholder="e.g. 85.00"
                  className="w-full rounded-xl border border-[#DCE5DF] p-3 text-sm font-bold text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                />
                <p className="text-[10px] text-[#526564] mt-1">
                  Base rate was ${completingBooking.basePrice}. Add any parts or extra labor if approved by customer.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#152C2B] block mb-1">
                  Completion Notes (Optional)
                </label>
                <textarea
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="e.g. Screen replaced with OEM panel, tested touch response and camera."
                  className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs focus:border-[#18756B] focus:outline-hidden min-h-[70px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCompletingBooking(null)}
                className="rounded-xl border border-[#DCE5DF] px-4 py-2 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF]"
              >
                Back
              </button>
              <button
                onClick={() => {
                  const num = parseFloat(completionAmount);
                  if (isNaN(num) || num <= 0) {
                    toast.error("Please enter a valid positive final amount");
                    return;
                  }
                  handleUpdateStatus(
                    completingBooking.id || completingBooking._id || "",
                    "completed",
                    { finalAmount: num, note: completionNote || "Repair successfully completed" }
                  );
                }}
                disabled={submittingAction}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submittingAction ? "Submitting..." : "Finalize & Bill"}
              </button>
            </div>
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
