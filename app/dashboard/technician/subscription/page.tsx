"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Crown,
  Zap,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

interface SubscriptionInfo {
  isPro: boolean;
  proTier: string;
  proSubscribedAt: string | null;
  perks: string[];
}

interface CheckoutResponse {
  url?: string;
  sessionId?: string;
  alreadyPaid?: boolean;
  isPro?: boolean;
  message?: string;
}

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const paymentStatus = searchParams.get("status");

  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [verifyingPayment, setVerifyingPayment] = useState(Boolean(sessionId && paymentStatus === "success"));
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Handle Stripe return redirect (success or cancelled)
  useEffect(() => {
    if (paymentStatus === "cancelled") {
      toast("Stripe checkout was cancelled or interrupted. You can resume upgrade at any time.", {
        icon: "ℹ️",
        duration: 5000,
      });
      router.replace("/dashboard/technician/subscription");
      return;
    }

    if (sessionId && paymentStatus === "success") {
      let active = true;
      let toastId: string | null = null;
      const verifySession = async () => {
        try {
          setVerifyingPayment(true);
          setVerifyError(null);
          toastId = toast.loading("Verifying your $29/mo Pro subscription with Stripe...");
          const res = await apiClient.get<{ message: string; isPro: boolean }>(
            `/api/technician/subscription/verify?session_id=${encodeURIComponent(sessionId)}`
          );
          if (active) {
            toast.success(res.message || "Welcome to FixMate Pro! Payment verified.", {
              id: toastId,
              duration: 6000,
            });
            setRefreshKey((k) => k + 1);
            router.replace("/dashboard/technician/subscription");
          }
        } catch (err: unknown) {
          if (active) {
            const error = err as { message?: string };
            const msg = error.message || "Failed to verify Stripe payment session";
            if (toastId) toast.error(msg, { id: toastId });
            else toast.error(msg);
            setVerifyError(msg);
          }
        } finally {
          if (active) {
            setVerifyingPayment(false);
          }
        }
      };

      verifySession();
      return () => {
        active = false;
        if (toastId) toast.dismiss(toastId);
      };
    }
  }, [sessionId, paymentStatus, router]);

  // Fetch current subscription status
  useEffect(() => {
    let active = true;
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await apiClient.get<SubscriptionInfo>("/api/technician/subscription");
        if (active) {
          setSub(res);
        }
      } catch (err: unknown) {
        if (active) {
          const error = err as { message?: string };
          setFetchError(error.message || "Failed to load subscription information");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSubscription();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Initiate Stripe Checkout session
  const handleUpgrade = async () => {
    let toastId: string | null = null;
    try {
      setProcessing(true);
      toastId = toast.loading("Opening Stripe secure checkout ($29/mo)...");
      const res = await apiClient.post<CheckoutResponse>(
        "/api/technician/subscription/checkout"
      );

      // Handle already-paid authoritative response
      if (res?.alreadyPaid) {
        if (toastId) toast.success(res.message || "Your FixMate Pro membership is already active!", { id: toastId });
        setRefreshKey((k) => k + 1);
        return;
      }

      if (res?.url) {
        if (toastId) toast.dismiss(toastId);
        window.location.href = res.url;
      } else {
        if (toastId) toast.error("Could not obtain Stripe checkout URL. Please retry.", { id: toastId });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (toastId) {
        toast.error(error.message || "Failed to initiate Stripe checkout", { id: toastId });
      } else {
        toast.error(error.message || "Failed to initiate Stripe checkout");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to downgrade from Pro to Standard tier?")) return;

    let toastId: string | null = null;
    try {
      setProcessing(true);
      toastId = toast.loading("Downgrading subscription...");
      const res = await apiClient.post<{ message: string; isPro: boolean }>(
        "/api/technician/subscription/cancel"
      );
      if (toastId) toast.success(res.message || "Subscription downgraded", { id: toastId });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (toastId) toast.error(error.message || "Failed to cancel subscription", { id: toastId });
      else toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || verifyingPayment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#18756B]" />
        <p className="text-xs font-semibold text-[#526564] dark:text-[#8EA8A5]">
          {verifyingPayment
            ? "Verifying Stripe Pro subscription payment..."
            : "Loading subscription status..."}
        </p>
      </div>
    );
  }

  // Diagnostic error state - never paint standard tier when status is unknown
  if (fetchError || !sub) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-950 dark:text-rose-200">
              Subscription Status Unavailable
            </h3>
            <p className="text-xs text-rose-800 dark:text-rose-300/80 mt-1 max-w-md mx-auto">
              {fetchError || "Could not retrieve your technician subscription details from the server."}
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry Loading Status</span>
          </button>
        </div>
      </div>
    );
  }

  // Failed Stripe payment verification alert
  if (verifyError && sessionId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-4">
        <div className="rounded-3xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
              Payment Verification Pending
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-1 max-w-md mx-auto">
              {verifyError}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setVerifyError(null);
                setVerifyingPayment(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry Verification</span>
            </button>
            <button
              onClick={() => router.replace("/dashboard/technician/subscription")}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300 dark:border-amber-600 bg-white dark:bg-transparent px-4 py-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/50 transition cursor-pointer"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPro = Boolean(sub?.isPro);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#152C2B] dark:text-[#EEF8F6] tracking-tight">
              Technician Pro Membership
            </h1>
            {isPro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                <Crown className="h-3 w-3 fill-white" />
                <span>Active Pro</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#526564] dark:text-[#8EA8A5] mt-0.5">
            Boost customer trust with golden badges, prioritize catalog placement, and eliminate platform fees.
          </p>
        </div>
      </div>

      {/* Current Status Hero Card */}
      {isPro ? (
        <div className="rounded-3xl border border-amber-300 dark:border-amber-400/40 bg-gradient-to-br from-[#072527] via-[#0B3638] to-[#135d55] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
            <Crown className="h-64 w-64 text-amber-300" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-[#F4B740] border border-amber-400/30">
                <Crown className="h-3.5 w-3.5 fill-[#F4B740]" />
                <span>FixMate Pro Technician Status</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">You are a Verified Pro Partner</h2>
              <p className="text-xs text-white/80 max-w-lg leading-relaxed">
                Your listings feature the golden crown badge across search results and receive 0% commission fees on all settled repair jobs.
              </p>
              {sub?.proSubscribedAt && (
                <div className="text-[11px] text-white/60">
                  Member since: {new Date(sub.proSubscribedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCancel}
                disabled={processing}
                className="rounded-xl border border-white/20 bg-white/10 hover:bg-rose-500/20 px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                Downgrade to Standard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#072527] via-[#0B3638] to-[#135d55] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
            <Crown className="h-64 w-64 text-amber-300" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-[#F4B740] border border-amber-400/30">
                <Zap className="h-3.5 w-3.5 fill-[#F4B740] text-[#F4B740]" />
                <span>Accelerate Your Repair Business</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Upgrade to FixMate Pro</h2>
              <p className="text-xs text-white/80 max-w-md leading-relaxed">
                Get more jobs, keep 100% of your customer earnings, and stand out as a premier certified repair technician.
              </p>
            </div>

            <div className="relative z-10 text-left md:text-right space-y-2">
              <div className="text-3xl font-black text-white">
                $29<span className="text-sm font-normal text-white/70"> / month</span>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-3 text-xs font-black text-white transition shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting Stripe...</span>
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 fill-white" />
                    <span>Upgrade to Pro Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Comparison Table */}
      <div className="rounded-3xl border border-[#DCE5DF] dark:border-[#1A3937] bg-white dark:bg-[#0E2020] p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#152C2B] dark:text-[#EEF8F6] border-b border-[#DCE5DF] dark:border-[#1A3937] pb-4">
          Tier Feature Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DCE5DF] dark:border-[#1A3937] text-[#526564] dark:text-[#8EA8A5] font-bold">
                <th className="py-3 px-4">Benefit</th>
                <th className="py-3 px-4 text-center">Standard Technician</th>
                <th className="py-3 px-4 text-center text-amber-900 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-400/10 rounded-t-xl font-black">
                  FixMate Pro Partner
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5DF] dark:divide-[#1A3937]">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#152C2B] dark:text-[#EEF8F6]">Platform Transaction Fee</td>
                <td className="py-3.5 px-4 text-center text-[#526564] dark:text-[#8EA8A5]">10% per completed repair</td>
                <td className="py-3.5 px-4 text-center font-black text-emerald-700 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-400/5">
                  0% (Keep 100% of payout)
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#152C2B] dark:text-[#EEF8F6]">Verified Profile Badge</td>
                <td className="py-3.5 px-4 text-center text-[#526564] dark:text-[#8EA8A5]">Standard checkmark</td>
                <td className="py-3.5 px-4 text-center bg-amber-50/30 dark:bg-amber-400/5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-400/15 text-amber-900 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold border border-amber-300 dark:border-amber-400/30">
                    <Crown className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>PRO TECHNICIAN</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#152C2B] dark:text-[#EEF8F6]">Catalog Placement</td>
                <td className="py-3.5 px-4 text-center text-[#526564] dark:text-[#8EA8A5]">Standard chronological</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#18756B] dark:text-teal-400 bg-amber-50/30 dark:bg-amber-400/5">
                  Top Priority Algorithm
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#152C2B] dark:text-[#EEF8F6]">Customer Review Spotlight</td>
                <td className="py-3.5 px-4 text-center text-[#526564] dark:text-[#8EA8A5]">Normal</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#152C2B] dark:text-[#EEF8F6] bg-amber-50/30 dark:bg-amber-400/5">
                  Featured on Homepage
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#152C2B] dark:text-[#EEF8F6]">Listing Creation Limit</td>
                <td className="py-3.5 px-4 text-center text-[#526564] dark:text-[#8EA8A5]">Up to 5 services</td>
                <td className="py-3.5 px-4 text-center font-bold text-emerald-700 dark:text-emerald-400 bg-amber-50/30 dark:bg-amber-400/5">
                  Unlimited Repair Services
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {!isPro && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleUpgrade}
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] hover:bg-[#135d55] px-5 py-2.5 text-xs font-bold text-white transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Crown className="h-4 w-4 fill-white" />
              <span>Upgrade to Pro ($29/mo)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TechnicianSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#18756B]" />
        </div>
      }
    >
      <SubscriptionContent />
    </Suspense>
  );
}
