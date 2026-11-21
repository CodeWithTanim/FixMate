"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { RefreshCw, Home, ChevronDown, ChevronUp, Terminal } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("Application error caught by FixMate boundary:", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2F6]">
      {/* Retained Navigation Bar */}
      <Navbar />

      {/* Main Content: Card UI Matching Modern Editorial 404 Style */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-12 lg:p-16 overflow-hidden">
          
          {/* Subtle top-left menu motif */}
          <div className="absolute top-8 left-8 sm:top-10 sm:left-10 flex flex-col gap-1.5 opacity-70" aria-hidden="true">
            <span className="block h-0.5 w-6 bg-[#18756B] rounded-full" />
            <span className="block h-0.5 w-6 bg-[#18756B] rounded-full" />
            <span className="block h-0.5 w-6 bg-[#18756B] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Diagnostic Oscilloscope / Bench Glitch Vector Illustration */}
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
                <svg
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Soft Background Circular Aura */}
                  <circle cx="200" cy="200" r="115" fill="#F1F3F8" />

                  {/* Oscilloscope Chassis */}
                  <rect
                    x="90"
                    y="110"
                    width="220"
                    height="170"
                    rx="20"
                    fill="#152C2B"
                    stroke="#0B3638"
                    strokeWidth="4"
                  />

                  {/* Oscilloscope Screen Bezel */}
                  <rect
                    x="110"
                    y="130"
                    width="145"
                    height="110"
                    rx="10"
                    fill="#081A1A"
                    stroke="#18756B"
                    strokeWidth="2"
                  />

                  {/* Screen Grid Lines */}
                  <g opacity="0.2" stroke="#18756B" strokeWidth="1">
                    <line x1="110" y1="155" x2="255" y2="155" strokeDasharray="3 3" />
                    <line x1="110" y1="185" x2="255" y2="185" />
                    <line x1="110" y1="215" x2="255" y2="215" strokeDasharray="3 3" />
                    <line x1="145" y1="130" x2="145" y2="240" strokeDasharray="3 3" />
                    <line x1="182" y1="130" x2="182" y2="240" />
                    <line x1="220" y1="130" x2="220" y2="240" strokeDasharray="3 3" />
                  </g>

                  {/* Diagnostic Signal Wave with Interruption / Glitch Spike */}
                  <path
                    d="M 112 185 L 140 185 L 150 165 L 160 205 L 170 185 L 180 185 L 188 140 L 196 230 L 204 165 L 212 195 L 220 185 L 253 185"
                    stroke="#FF7F3E"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Glitch Sparkle Disconnect Indicator on Screen */}
                  <circle cx="196" cy="142" r="4" fill="#E11D48" />
                  <line x1="196" y1="132" x2="196" y2="126" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
                  <line x1="204" y1="138" x2="210" y2="134" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />

                  {/* Control Panel (Knobs & Status LED on the right) */}
                  <g>
                    {/* Status LED */}
                    <circle cx="282" cy="140" r="5" fill="#E11D48" />
                    <circle cx="282" cy="140" r="8" stroke="#E11D48" strokeWidth="1.5" opacity="0.4" />

                    {/* Rotary Control Dial 1 */}
                    <circle cx="282" cy="170" r="12" fill="#18756B" stroke="#0B3638" strokeWidth="2" />
                    <line x1="282" y1="170" x2="288" y2="164" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

                    {/* Rotary Control Dial 2 */}
                    <circle cx="282" cy="205" r="10" fill="#243B6B" stroke="#0B3638" strokeWidth="2" />
                    <line x1="282" y1="205" x2="276" y2="201" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

                    {/* Jack sockets */}
                    <circle cx="272" cy="230" r="4" fill="#000000" stroke="#526564" strokeWidth="1.5" />
                    <circle cx="292" cy="230" r="4" fill="#000000" stroke="#526564" strokeWidth="1.5" />
                  </g>

                  {/* Test Probes and Wire Cables curving out */}
                  {/* Red / Orange Probe */}
                  <path
                    d="M 272 234 C 272 280, 240 310, 190 320"
                    stroke="#FF7F3E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect x="155" y="316" width="35" height="8" rx="3" fill="#FF7F3E" transform="rotate(-10 155 316)" />
                  <line x1="155" y1="316" x2="140" y2="313" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                  {/* Teal Probe */}
                  <path
                    d="M 292 234 C 292 290, 260 330, 220 330"
                    stroke="#18756B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect x="185" y="326" width="35" height="8" rx="3" fill="#18756B" transform="rotate(5 185 326)" />
                  <line x1="185" y1="326" x2="170" y2="328" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                  {/* Oscilloscope Feet */}
                  <rect x="110" y="280" width="24" height="6" rx="2" fill="#0B3638" />
                  <rect x="266" y="280" width="24" height="6" rx="2" fill="#0B3638" />
                </svg>
              </div>
            </div>

            {/* Right Column: Error Content & Action Buttons */}
            <div className="md:col-span-6 text-center md:text-left flex flex-col items-center md:items-start space-y-4">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200/80 px-3.5 py-1 text-xs font-bold text-rose-700">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span>Diagnostic Monitor Alert</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#152C2B] leading-tight">
                Unexpected Service Glitch
              </h1>

              <p className="text-xs sm:text-sm text-[#526564] max-w-sm leading-relaxed">
                Our automated monitor caught an unexpected hiccup while processing this view. Your account, bookings, and repair data remain safe.
              </p>

              {/* Action Buttons: Pure native browser compatible links for zero-fail clicks */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <a
                  href="javascript:location.reload()"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#18756B] hover:bg-[#135d55] text-white px-7 py-3 text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </a>

                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B3638] hover:bg-[#152C2B] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <span>Go to Dashboard</span>
                </a>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DCE5DF] bg-white hover:bg-[#F6F5EF] text-[#152C2B] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <Home className="h-4 w-4 text-[#18756B]" />
                  <span>Return Home</span>
                </Link>
              </div>

              {/* Technical Details: Native HTML details/summary ensures toggling works even if React hydration fails */}
              <details className="pt-2 w-full max-w-sm group">
                <summary className="flex items-center gap-1.5 text-[11px] font-semibold text-[#526564] hover:text-[#152C2B] transition cursor-pointer select-none list-none">
                  <Terminal className="h-3.5 w-3.5 text-[#18756B]" />
                  <span>View Error Diagnostics</span>
                  <ChevronDown className="h-3.5 w-3.5 group-open:rotate-180 transition-transform" />
                </summary>

                <div className="mt-2 p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed break-all border border-slate-800 shadow-inner">
                  <div className="text-rose-400 font-bold mb-1">Diagnostic Detail:</div>
                  <div>{error?.message || "Diagnostic signal interrupted."}</div>
                  {error?.digest && (
                    <div className="mt-2 text-slate-400 text-[10px]">
                      Digest Code: <span className="text-emerald-400">{error.digest}</span>
                    </div>
                  )}
                </div>
              </details>

            </div>

          </div>
        </div>
      </main>

      {/* Retained Footer */}
      <Footer />
    </div>
  );
}
