import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EEF2F6]">
      {/* Retained Navigation Bar */}
      <Navbar />

      {/* Main Content: Card UI Matching Reference */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-12 lg:p-16 overflow-hidden">
          
          {/* Subtle top-left menu icon from reference graphic */}
          <div className="absolute top-8 left-8 sm:top-10 sm:left-10 flex flex-col gap-1.5 opacity-80" aria-hidden="true">
            <span className="block h-0.5 w-6 bg-[#2D3E74] rounded-full" />
            <span className="block h-0.5 w-6 bg-[#2D3E74] rounded-full" />
            <span className="block h-0.5 w-6 bg-[#2D3E74] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Disconnected Power Plug & Cord Illustration */}
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
                <svg
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Soft Background Circular Aura */}
                  <circle cx="200" cy="200" r="110" fill="#F1F3F8" />

                  {/* Top Cord: Horizontal from right, bends down */}
                  <path
                    d="M 330 80 L 215 80 Q 200 80 200 95 L 200 135"
                    stroke="#2D3E74"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Top Female Plug / Socket */}
                  <g>
                    {/* Cable strain-relief collar */}
                    <rect x="192" y="130" width="16" height="8" rx="2" fill="#2D3E74" />
                    {/* Socket main body */}
                    <path
                      d="M 182 138 L 218 138 L 222 168 Q 222 172 218 172 L 182 172 Q 178 172 178 168 Z"
                      fill="#3B4D87"
                      stroke="#2D3E74"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Grip ribs */}
                    <line x1="192" y1="144" x2="192" y2="166" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    <line x1="200" y1="144" x2="200" y2="166" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    <line x1="208" y1="144" x2="208" y2="166" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    {/* Socket connector rim */}
                    <rect x="176" y="171" width="48" height="7" rx="3.5" fill="#2D3E74" />
                  </g>

                  {/* Disconnection Spark Lines */}
                  {/* Left sparks */}
                  <line x1="166" y1="184" x2="158" y2="178" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="162" y1="195" x2="152" y2="195" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="166" y1="206" x2="158" y2="212" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Right sparks */}
                  <line x1="234" y1="184" x2="242" y2="178" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="238" y1="195" x2="248" y2="195" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="234" y1="206" x2="242" y2="212" stroke="#2D3E74" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Bottom Male Plug */}
                  <g>
                    {/* Male prongs pointing upward */}
                    <rect x="189" y="211" width="5" height="17" rx="1.5" fill="#2D3E74" />
                    <rect x="206" y="211" width="5" height="17" rx="1.5" fill="#2D3E74" />
                    <circle cx="191.5" cy="216" r="1" fill="#F1F3F8" />
                    <circle cx="208.5" cy="216" r="1" fill="#F1F3F8" />

                    {/* Plug collar rim */}
                    <rect x="176" y="226" width="48" height="6" rx="3" fill="#2D3E74" />

                    {/* Plug main body */}
                    <path
                      d="M 178 232 Q 178 228 182 228 L 218 228 Q 222 228 222 232 L 218 262 L 182 262 Z"
                      fill="#3B4D87"
                      stroke="#2D3E74"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Grip ribs */}
                    <line x1="192" y1="234" x2="192" y2="256" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    <line x1="200" y1="234" x2="200" y2="256" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    <line x1="208" y1="234" x2="208" y2="256" stroke="#2D3E74" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
                    {/* Cable strain-relief collar */}
                    <rect x="192" y="262" width="16" height="8" rx="2" fill="#2D3E74" />
                  </g>

                  {/* Bottom Cord: Horizontal from left, bends up */}
                  <path
                    d="M 70 340 L 70 315 Q 70 300 85 300 L 185 300 Q 200 300 200 285 L 200 268"
                    stroke="#2D3E74"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Column: 404 Typography & Action */}
            <div className="md:col-span-6 text-center md:text-left flex flex-col items-center md:items-start space-y-4">
              <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight text-[#2D3E74] leading-none">
                404
              </h1>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
                Page Not Found
              </h2>

              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-sm leading-relaxed">
                We&apos;re sorry, the page you requested could not be found.<br className="hidden sm:inline" />
                Please go back to the homepage.
              </p>

              <div className="pt-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#2D3E74] hover:bg-[#1E2B52] text-white px-9 py-3 text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  GO HOME
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Retained Footer */}
      <Footer />
    </div>
  );
}
