"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomeHowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect & Describe Issue",
      desc: "Tell FixMate your device model, symptoms, and service preference. Pick a doorstep appointment or drop-off time in seconds.",
      badge: "Instant Estimate",
      desktopOffsetClass: "lg:pl-2",
    },
    {
      num: "02",
      title: "Match with Verified Pro",
      desc: "A vetted, certified technician in your area reviews your request, accepts the job, and locks in transparent upfront pricing.",
      badge: "Vetted Specialists",
      desktopOffsetClass: "lg:pl-14",
    },
    {
      num: "03",
      title: "Real-Time Diagnostic Updates",
      desc: "Track every step of the repair process live. Receive milestone notifications and component tests directly on your dashboard.",
      badge: "Live Milestones",
      desktopOffsetClass: "lg:pl-12",
    },
    {
      num: "04",
      title: "Inspect & Settle Upon Completion",
      desc: "Test and verify your repaired device first. Release payment securely via Stripe card only when you are 100% satisfied.",
      badge: "Zero Upfront Risk",
      desktopOffsetClass: "lg:pl-1",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] py-20 lg:py-28 border-y border-[#DCE5DF]">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-[#18756B]/5 blur-3xl" />
      <div className="absolute bottom-0 left-10 -z-10 h-80 w-80 rounded-full bg-[#FF7F3E]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Title + Retro Line-Art Diagnostic Illustration */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:pr-6">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#152C2B] leading-[1.08]">
                How FixMate <br />
                <span className="text-[#18756B]">Works.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#526564] leading-relaxed max-w-md">
                A modern, escrow-protected repair workflow. Track your hardware diagnosis in real time and pay only after complete satisfaction.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#152C2B]">
                <div className="flex items-center gap-1.5 bg-white border border-[#DCE5DF] px-3 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B]" />
                  <span>No upfront fees</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-[#DCE5DF] px-3 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B]" />
                  <span>Verified technicians</span>
                </div>
              </div>
            </div>

            {/* Custom Editorial Line-Art Illustration: Technician at diagnostic desk */}
            <div className="relative pt-4 max-w-md mx-auto lg:mx-0 w-full">
              <div className="relative rounded-3xl bg-[#F4F4EE] border border-[#E3E8E3] p-6 shadow-sm overflow-hidden">
                <svg
                  viewBox="0 0 420 310"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  {/* Subtle Grid / Circuit backdrop */}
                  <g opacity="0.12" stroke="#152C2B" strokeWidth="1">
                    <line x1="20" y1="40" x2="400" y2="40" strokeDasharray="3 3" />
                    <line x1="20" y1="120" x2="400" y2="120" strokeDasharray="3 3" />
                    <line x1="20" y1="200" x2="400" y2="200" strokeDasharray="3 3" />
                    <line x1="100" y1="20" x2="100" y2="280" strokeDasharray="3 3" />
                    <line x1="280" y1="20" x2="280" y2="280" strokeDasharray="3 3" />
                  </g>

                  {/* Desk Surface */}
                  <line x1="30" y1="250" x2="390" y2="250" stroke="#152C2B" strokeWidth="3" strokeLinecap="round" />
                  <line x1="50" y1="250" x2="50" y2="295" stroke="#152C2B" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="370" y1="250" x2="370" y2="295" stroke="#152C2B" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Diagnostic Monitor / Laptop */}
                  <g>
                    {/* Base */}
                    <rect x="70" y="244" width="75" height="6" rx="2" fill="#152C2B" />
                    {/* Screen open */}
                    <path
                      d="M 60 170 L 105 170 L 115 244 L 70 244 Z"
                      fill="#FFFFFF"
                      stroke="#152C2B"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Screen diagnostic wave */}
                    <path
                      d="M 68 200 L 78 200 L 83 185 L 88 220 L 93 195 L 98 205 L 107 205"
                      stroke="#18756B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Workstation Tools (Screwdriver & Pliers) */}
                  <g>
                    {/* Precision screwdriver */}
                    <rect x="135" y="242" width="28" height="4" rx="2" fill="#FF7F3E" stroke="#152C2B" strokeWidth="1.5" />
                    <line x1="163" y1="244" x2="178" y2="244" stroke="#526564" strokeWidth="2" strokeLinecap="round" />
                    {/* Hardware chip */}
                    <rect x="190" y="238" width="18" height="10" rx="1.5" fill="#E2E8F0" stroke="#152C2B" strokeWidth="1.5" />
                    <circle cx="199" cy="243" r="2" fill="#18756B" />
                  </g>

                  {/* Ergonomic Office Chair */}
                  <path
                    d="M 330 190 Q 345 220 335 270"
                    stroke="#152C2B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect x="295" y="248" width="50" height="8" rx="4" fill="#152C2B" />

                  {/* Technician Character */}
                  {/* Body & Torso */}
                  <path
                    d="M 230 248 C 230 185 275 180 295 248 Z"
                    fill="#152C2B"
                  />
                  {/* Collar / Shirt accent */}
                  <path d="M 252 186 L 257 202 L 264 186 Z" fill="#F4F4EE" />

                  {/* Left Arm typing on laptop */}
                  <path
                    d="M 242 195 C 220 205 175 220 120 236"
                    stroke="#152C2B"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Sleeve cuff */}
                  <circle cx="125" cy="235" r="4.5" fill="#18756B" />
                  {/* Hand */}
                  <path d="M 120 236 C 112 238 108 242 110 244" stroke="#152C2B" strokeWidth="3" strokeLinecap="round" />

                  {/* Head & Neck */}
                  <rect x="253" y="172" width="10" height="15" rx="3" fill="#D6CDC4" stroke="#152C2B" strokeWidth="2" />
                  {/* Face */}
                  <circle cx="258" cy="150" r="26" fill="#F4F4EE" stroke="#152C2B" strokeWidth="2.5" />
                  {/* Hair */}
                  <path
                    d="M 236 148 C 235 125 275 120 282 144 C 275 136 260 135 242 142 Z"
                    fill="#152C2B"
                  />
                  {/* Eye & calm friendly expression */}
                  <circle cx="248" cy="150" r="2" fill="#152C2B" />
                  <path d="M 243 158 Q 248 163 255 160" stroke="#152C2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Technician Headset / Comm gear */}
                  <path
                    d="M 245 130 Q 262 120 274 135"
                    stroke="#18756B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="274" cy="148" r="6" fill="#18756B" stroke="#152C2B" strokeWidth="2" />
                  {/* Microphone arm reaching toward mouth */}
                  <path
                    d="M 272 153 Q 260 166 242 165"
                    stroke="#18756B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="241" cy="165" r="2.5" fill="#FF7F3E" />

                  {/* Floating Repair Badges / Holographic Diagnostics */}
                  <g>
                    <rect x="290" y="80" width="85" height="28" rx="14" fill="#FFFFFF" stroke="#18756B" strokeWidth="1.5" />
                    <circle cx="304" cy="94" r="4" fill="#18756B" />
                    <text x="314" y="98" fill="#152C2B" fontSize="10" fontWeight="700" fontFamily="sans-serif">99.8% OK</text>
                  </g>
                  <g>
                    <rect x="80" y="65" width="95" height="28" rx="14" fill="#FFFFFF" stroke="#DCE5DF" strokeWidth="1.5" />
                    <circle cx="94" cy="79" r="4" fill="#FF7F3E" />
                    <text x="104" y="83" fill="#152C2B" fontSize="10" fontWeight="700" fontFamily="sans-serif">LIVE STATUS</text>
                  </g>
                </svg>

                <div className="mt-3 flex items-center justify-between text-xs text-[#526564] pt-3 border-t border-[#DCE5DF]">
                  <span className="font-medium text-[#152C2B]">FixMate Pro Diagnostic Bench</span>
                  <span className="font-semibold text-[#18756B]">Active Session</span>
                </div>
              </div>

              <div className="mt-4 text-center lg:text-left">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#18756B] hover:text-[#152C2B] transition"
                >
                  <span>Explore all repair services</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Sweeping Curved Arc Timeline with Numbered Step Badges */}
          <div className="lg:col-span-7 relative">
            
            {/* Desktop SVG Gentle Curved Arc Divider */}
            <div className="absolute top-0 bottom-0 left-0 w-36 pointer-events-none hidden lg:block overflow-visible -z-0">
              <svg
                viewBox="0 0 140 600"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* Subtle curved background track */}
                <path
                  d="M 28 30 C 105 130, 95 440, 26 570"
                  stroke="#E2E8E4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Secondary accent dashed arc */}
                <path
                  d="M 28 30 C 105 130, 95 440, 26 570"
                  stroke="#18756B"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Mobile Vertical Timeline Line */}
            <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-[#DCE5DF] lg:hidden -z-0" />

            {/* Steps Container */}
            <div className="space-y-8 sm:space-y-10 relative z-10">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className={`group relative flex items-start gap-5 sm:gap-6 transition-all duration-300 ${step.desktopOffsetClass}`}
                >
                  {/* Circular Numbered Node (01, 02, etc.) */}
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white border-2 border-[#152C2B]/25 flex items-center justify-center font-bold text-base sm:text-lg text-[#152C2B] shadow-sm transition-all duration-300 group-hover:border-[#18756B] group-hover:bg-[#18756B] group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                      {step.num}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1 sm:pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg sm:text-xl font-bold text-[#152C2B] group-hover:text-[#18756B] transition-colors duration-200">
                        {step.title}
                      </h3>
                      <span className="inline-block rounded-full bg-[#18756B]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#18756B]">
                        {step.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-[#526564] leading-relaxed max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
