"use client";

import { useState } from "react";
import { Star, X, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useFocusTrap } from "@/lib/useFocusTrap";
import toast from "react-hot-toast";

interface LeaveReviewModalProps {
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Exceptional!"];

export default function LeaveReviewModal({
  bookingId,
  serviceTitle,
  technicianName,
  isOpen,
  onClose,
  onSuccess,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useFocusTrap(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Please select a star rating from 1 to 5");
      return;
    }

    if (comment.trim().length < 5) {
      toast.error("Please write at least 5 characters in your review");
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post("/api/reviews", {
        bookingId,
        rating,
        comment: comment.trim(),
      });

      setSubmitted(true);
      toast.success("Thank you for your rating & review!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-dialog-title"
      onKeyDown={(e) => {
        if (e.key === "Escape" && !submitting) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-2xl space-y-5 focus:outline-hidden"
      >
        <div className="flex items-start justify-between border-b border-[#DCE5DF] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B]">
              Verified Feedback
            </span>
            <h3 id="review-dialog-title" className="text-lg font-black text-[#152C2B]">Rate Your Repair</h3>
            <p className="text-xs text-[#526564] truncate max-w-[280px]">
              {serviceTitle} ({technicianName})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review dialog"
            className="p-1 rounded-lg text-[#526564] hover:bg-[#F6F5EF] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-[#152C2B]">Review Published!</h4>
            <p className="text-xs text-[#526564]">
              Thank you for helping others find quality repair specialists.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Star Picker */}
            <div className="text-center space-y-2 py-2 bg-[#F6F5EF]/60 rounded-2xl border border-[#DCE5DF]/60">
              <div className="text-xs font-bold text-[#152C2B]">Overall Rating</div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          active
                            ? "fill-[#F4B740] text-[#F4B740]"
                            : "text-[#DCE5DF] fill-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-extrabold text-[#18756B]">
                {RATING_LABELS[hoverRating || rating]}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-bold text-[#152C2B] mb-1">
                Your Review & Technician Experience *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={3}
                placeholder="How was the diagnostics, repair speed, parts quality, and technician communication?..."
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden min-h-[90px]"
              />
              <span className="text-[10px] text-[#526564] block mt-1">
                Minimum 5 characters. Verified badge will appear with your review.
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-4 py-2.5 text-xs font-bold text-[#526564] hover:bg-[#DCE5DF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#18756B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 fill-white" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
