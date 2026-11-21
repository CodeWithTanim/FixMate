"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface HeroSlide {
  image: string;
  category: string;
  tagline: string;
}

const slides: HeroSlide[] = [
  {
    image: "/hero/hero-1.jpg",
    category: "Precision Electronics Lab",
    tagline: "Micro-soldering, circuit restoration & board-level repairs",
  },
  {
    image: "/hero/hero-2.jpg",
    category: "Laptop & PC Diagnostics",
    tagline: "Thermal management, GPU chipsets & logic board overhauls",
  },
  {
    image: "/hero/hero-3.jpg",
    category: "Smartphone & Tablet Care",
    tagline: "OEM screen replacements, battery calibration & port repairs",
  },
  {
    image: "/hero/hero-4.jpg",
    category: "Home Appliances & HVAC",
    tagline: "Certified inverter AC servicing, compressors & washer mechanics",
  },
];

export default function HomeHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // 5-second automatic sliding with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center justify-center border-b border-[#DCE5DF]"
      aria-label="Hero Service Showcase"
    >
      {/* Background Slides with Smooth Cross-Fade & Scale Transition */}
      <div className="absolute inset-0 -z-20">
        {slides.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            } transform transition-transform duration-[7000ms]`}
          >
            <Image
              src={slide.image}
              alt={slide.category}
              fill
              priority={idx === 0}
              sizes="100vw"
              quality={85}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Cinematic Ambient Dark Vignette & Gradient Overlays */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#091817] via-[#091817]/70 to-[#091817]/75"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-radial from-transparent via-black/40 to-black/85"
        aria-hidden="true"
      />

      {/* Main Centered Content Area */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full py-20 sm:py-24 text-center z-10 space-y-8">
        
        {/* Dynamic Category Pill Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-md">
          <span className="h-2 w-2 rounded-full bg-[#3DDAB4] animate-pulse" />
          <span className="font-bold text-white tracking-wide">{slides[current].category}</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline font-normal">{slides[current].tagline}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] drop-shadow-md max-w-4xl mx-auto">
          A broken device <br />
          <span className="text-[#3DDAB4]">shouldn’t break your day.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal">
          Connect with certified local technicians for smartphone, PC, AC, and home appliance repairs. Honest base pricing, doorstep convenience, and zero upfront risk.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#18756B]/30 hover:bg-[#135d55] transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Browse Repair Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-md px-7 py-4 text-sm font-bold text-white transition shadow-sm"
          >
            <span>How FixMate Works</span>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3DDAB4]" />
            <span>0% Upfront Deposit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3DDAB4]" />
            <span>Vetted Local Technicians</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3DDAB4]" />
            <span>Live Milestone Updates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#3DDAB4]" />
            <span>Pay After Inspection</span>
          </div>
        </div>

      </div>

      {/* Manual Sliding Controls: Chevrons & Pills in Floating Bottom Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-lg">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Pill Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === current ? "w-7 bg-[#3DDAB4]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <span className="text-[11px] font-mono font-medium text-slate-300 pl-1 border-l border-white/20">
          0{current + 1} / 0{slides.length}
        </span>
      </div>
    </section>
  );
}
