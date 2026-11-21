"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Calendar, MapPin, Phone, FileText, Loader2, Wrench } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { ServiceItem, UserProfile } from "@/types";

export default function BookingRequestModal({
  service,
  currentUser,
}: {
  service: ServiceItem;
  currentUser: UserProfile;
}) {
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("request") === "true" || params.get("book") === "true";
    }
    return false;
  });
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [address, setAddress] = useState(currentUser.area || "");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const containerRef = useFocusTrap(open);

  // Today in YYYY-MM-DD in explicit Asia/Dhaka service timezone
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone.trim()) {
      setErrorMsg("Please enter your contact phone number.");
      return;
    }

    if (!address.trim()) {
      setErrorMsg("Please enter your service address or drop-off location.");
      return;
    }

    if (!preferredDate) {
      setErrorMsg("Please select your preferred repair date.");
      return;
    }

    if (problemDescription.trim().length < 20) {
      setErrorMsg("Please provide at least 20 characters describing the problem symptoms.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting repair request...");

    const res = await apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        serviceId: service.id || service._id,
        customerPhone: phone.trim(),
        serviceAddress: address.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
      }),
    });

    setLoading(false);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      setErrorMsg(res.error);
      return;
    }

    toast.success("Repair request submitted successfully!", { id: toastId });
    setOpen(false);
    router.push("/dashboard/customer/bookings");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#18756B] py-3.5 text-sm font-bold text-white shadow-xs hover:bg-[#135d55] transition cursor-pointer"
      >
        <Wrench className="h-4 w-4" />
        <span>Request This Repair</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setOpen(false);
            }
          }}
        >
          <div
            ref={containerRef}
            tabIndex={-1}
            className="relative w-full max-w-lg rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-2xl my-8 focus:outline-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 rounded-lg p-1.5 text-[#526564] hover:bg-[#F6F5EF] cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 mb-5">
              <span className="text-[10px] uppercase font-bold text-[#18756B] tracking-wider">
                Repair Booking Request
              </span>
              <h2 id="booking-modal-title" className="text-xl font-bold text-[#152C2B]">{service.title}</h2>
              <p className="text-xs text-[#526564]">
                Base Price: <strong className="text-[#152C2B]">${service.basePrice.toFixed(2)}</strong> • {service.serviceMode}
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer read-only identity */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#526564] mb-1">Your Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full rounded-lg border border-[#DCE5DF] bg-slate-50 px-3 py-2 text-[#152C2B] font-semibold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#526564] mb-1">Your Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full rounded-lg border border-[#DCE5DF] bg-slate-50 px-3 py-2 text-[#152C2B] font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="phone">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full rounded-xl border border-[#DCE5DF] py-2 pl-9 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="address">
                  Service Address / Area
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
                  <input
                    id="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Repair Street, Apt 4B"
                    className="w-full rounded-xl border border-[#DCE5DF] py-2 pl-9 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-bold text-[#152C2B] mb-1" htmlFor="date">
                  Preferred Repair Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
                  <input
                    id="date"
                    type="date"
                    min={today}
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DF] py-2 pl-9 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
                  />
                </div>
              </div>

              {/* Problem description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#152C2B]" htmlFor="desc">
                    Problem Symptoms & Details
                  </label>
                  <span
                    className={`text-[10px] font-semibold ${
                      problemDescription.trim().length >= 20 ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {problemDescription.trim().length >= 20
                      ? `✓ ${problemDescription.length} chars (ready)`
                      : `${problemDescription.length}/20 min chars required`}
                  </span>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-4 w-4 text-[#526564]" />
                  <textarea
                    id="desc"
                    required
                    rows={3}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe what is failing, any error messages, or specific parts affected..."
                    className="w-full rounded-xl border border-[#DCE5DF] py-2 pl-9 pr-3 text-xs sm:text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-[#DCE5DF] py-2.5 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 flex items-center justify-center gap-2 rounded-xl bg-[#18756B] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#135d55] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Repair Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
