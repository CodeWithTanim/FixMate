"use client";

import { useEffect } from "react";
import { X, CheckCircle, Clock, AlertCircle, Play, DollarSign, XCircle } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export interface StatusHistoryItem {
  status: string;
  timestamp: string | Date;
  changedBy?: string;
  role?: string;
  note?: string;
}

interface JobTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
  bookingId: string;
  statusHistory?: StatusHistoryItem[];
}

export default function JobTimelineModal({
  isOpen,
  onClose,
  serviceTitle,
  bookingId,
  statusHistory = [],
}: JobTimelineModalProps) {
  const containerRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requested":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "in-progress":
        return <Play className="h-4 w-4 text-sky-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-emerald-700" />;
      case "paid":
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-rose-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />;
    }
  };

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
      case "paid":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold";
      case "rejected":
      case "cancelled":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="relative w-full max-w-lg rounded-2xl border border-[#DCE5DF] bg-white dark:bg-[#0E2020] p-6 shadow-2xl focus:outline-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#DCE5DF] dark:border-[#1A3937] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B]">
              Job Lifecycle Audit
            </span>
            <h3 id="timeline-dialog-title" className="text-lg font-bold text-[#152C2B] dark:text-[#EEF8F6] line-clamp-1">
              {serviceTitle}
            </h3>
            <p className="text-xs text-[#526564] dark:text-[#8EA8A5]">Reference ID: {bookingId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close timeline dialog"
            className="rounded-lg p-1.5 text-[#526564] dark:text-[#8EA8A5] hover:bg-[#F6F5EF] dark:hover:bg-[#152C2B] hover:text-[#152C2B] dark:hover:text-[#EEF8F6] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="py-6 max-h-[60vh] overflow-y-auto pr-1">
          {statusHistory.length === 0 ? (
            <p className="text-center text-xs text-[#526564] dark:text-[#8EA8A5] py-8">
              No detailed timeline recorded for this booking.
            </p>
          ) : (
            <div className="relative border-l-2 border-[#DCE5DF] dark:border-[#1A3937] ml-4 space-y-6">
              {statusHistory.map((step, idx) => {
                const date = new Date(step.timestamp);
                const formattedDate = isNaN(date.getTime())
                  ? "Recorded"
                  : date.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                return (
                  <div key={idx} className="relative pl-6">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-[#0E2020] bg-white dark:bg-[#142E28] shadow-xs">
                      {getStatusIcon(step.status)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            step.status
                          )}`}
                        >
                          {step.status}
                        </span>
                        <span className="text-[11px] text-[#526564] dark:text-[#8EA8A5]">{formattedDate}</span>
                      </div>

                      {step.changedBy && (
                        <p className="text-xs text-[#152C2B] dark:text-[#EEF8F6] font-medium">
                          Updated by: <span className="font-semibold">{step.changedBy}</span>{" "}
                          {step.role && <span className="text-[10px] text-[#526564] dark:text-[#8EA8A5]">({step.role})</span>}
                        </p>
                      )}

                      {step.note && (
                        <p className="text-xs text-[#526564] dark:text-[#8EA8A5] italic bg-[#F6F5EF] dark:bg-[#142E28] p-2 rounded-lg border border-[#DCE5DF] dark:border-[#1A3937]">
                          &ldquo;{step.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#DCE5DF] dark:border-[#1A3937] pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DCE5DF] dark:border-[#1A3937] bg-[#F6F5EF] dark:bg-[#152C2B] px-4 py-2 text-xs font-bold text-[#152C2B] dark:text-[#EEF8F6] hover:bg-[#DCE5DF] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
