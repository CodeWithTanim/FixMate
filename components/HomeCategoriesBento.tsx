import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomeCategoriesBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Header matching screenshot */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#152C2B] tracking-tight">
          Repair Categories
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#526564]">
          Select an appliance or electronic device to connect with certified local technicians.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* 1. SMARTPHONE (Wide Banner Card - Left, matching SOFA card) */}
        <Link
          href={`/services?category=${encodeURIComponent("Smartphone")}`}
          className="lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#ECEBE4] p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left Content */}
            <div className="sm:col-span-6 space-y-3 z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#526564]">
                Mobile & Handheld
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#152C2B] uppercase">
                Smartphone
              </h3>
              <p className="text-xs text-[#526564] leading-relaxed line-clamp-2">
                OLED displays, battery swaps, charging flex cables, camera sensors, and water damage recovery.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#152C2B] px-4 py-2 text-xs font-bold text-white shadow-xs group-hover:bg-[#18756B] transition">
                  <span>BOOK REPAIR</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="sm:col-span-6 flex items-center justify-center py-4 relative">
              <div className="relative w-44 h-48 flex items-center justify-center">
                {/* 3D Smartphone Illustration */}
                <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <defs>
                    <linearGradient id="phone-body" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="phone-screen" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0B3638" />
                      <stop offset="60%" stopColor="#18756B" />
                      <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                    <linearGradient id="glass-glare" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                      <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Phone Chassis */}
                  <rect x="25" y="10" width="110" height="175" rx="22" fill="url(#phone-body)" stroke="#475569" strokeWidth="2" />
                  {/* Screen Bezel */}
                  <rect x="30" y="15" width="100" height="165" rx="18" fill="url(#phone-screen)" />
                  {/* Glass reflection */}
                  <path d="M 30 15 L 130 15 L 30 115 Z" fill="url(#glass-glare)" />
                  {/* Dynamic Notch / Camera */}
                  <rect x="62" y="20" width="36" height="8" rx="4" fill="#020617" />
                  <circle cx="88" cy="24" r="2.5" fill="#1E293B" />
                  {/* Home Indicator */}
                  <rect x="60" y="170" width="40" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" />
                </svg>
                {/* Contact Shadow */}
                <div className="absolute -bottom-2 w-32 h-4 rounded-full bg-black/15 blur-md" />
              </div>
            </div>
          </div>
        </Link>

        {/* 2. LAPTOP & PC (Square Card - Light Blue, matching SNEAKERS card) */}
        <Link
          href={`/services?category=${encodeURIComponent("Laptop & PC")}`}
          className="lg:col-span-5 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#DDF0FC] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">
              Computers & Mac
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#0C4A6E] uppercase">
              Laptop & PC
            </h3>
            <p className="mt-1 text-xs text-[#0369A1] leading-relaxed line-clamp-2">
              Motherboards, thermal overhaul, batteries, hinge mounts, and NVMe SSD upgrades.
            </p>
          </div>

          {/* 3D Laptop Graphic */}
          <div className="relative flex items-center justify-center pt-4 pb-1">
            <div className="relative w-48 h-32 flex items-center justify-center">
              <svg viewBox="0 0 180 120" className="w-full h-full drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="laptop-screen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="laptop-body" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                </defs>
                {/* Screen Housing */}
                <rect x="30" y="8" width="120" height="75" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                <rect x="35" y="13" width="110" height="65" rx="4" fill="url(#laptop-screen)" />
                {/* FixMate Logo on screen */}
                <circle cx="90" cy="45" r="10" fill="#38BDF8" fillOpacity="0.8" />
                {/* Base / Keyboard */}
                <polygon points="10,95 170,95 155,83 25,83" fill="url(#laptop-body)" />
                <rect x="70" y="87" width="40" height="5" rx="2" fill="#475569" />
              </svg>
              {/* Contact Shadow */}
              <div className="absolute bottom-0 w-36 h-3 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>
        </Link>

        {/* 3. AC (Square Card - Pastel Butter Yellow, matching TOY TRAIN card) */}
        <Link
          href={`/services?category=${encodeURIComponent("AC")}`}
          className="lg:col-span-4 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#FEF9C3] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A16207]">
              Cooling Systems
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#713F12] uppercase">
              AC Servicing
            </h3>
            <p className="mt-1 text-xs text-[#854D0E] leading-relaxed line-clamp-2">
              Deep chemical wash, R32/R410 gas top-ups, PCB repairs, and compressor start kits.
            </p>
          </div>

          {/* 3D AC Unit Graphic */}
          <div className="relative flex items-center justify-center pt-4 pb-1">
            <div className="relative w-44 h-28 flex items-center justify-center">
              <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="ac-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F1F5F9" />
                  </linearGradient>
                </defs>
                {/* AC Indoor Unit */}
                <rect x="15" y="25" width="130" height="48" rx="10" fill="url(#ac-body)" stroke="#CBD5E1" strokeWidth="2" />
                {/* Louver opening */}
                <rect x="25" y="55" width="110" height="12" rx="4" fill="#E2E8F0" />
                {/* Display light */}
                <circle cx="125" cy="38" r="3" fill="#10B981" />
                <text x="100" y="41" fill="#64748B" fontSize="9" fontWeight="bold">21°C</text>
                {/* Breeze Waves */}
                <path d="M 35 72 Q 45 82 55 75 Q 65 68 75 78" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M 85 75 Q 95 85 105 78 Q 115 70 125 80" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              {/* Contact Shadow */}
              <div className="absolute bottom-1 w-32 h-3 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>
        </Link>

        {/* 4. TV (Square Card - Pastel Lavender/Pink) */}
        <Link
          href={`/services?category=${encodeURIComponent("TV")}`}
          className="lg:col-span-4 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#F5ECF7] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9333EA]">
              Home Entertainment
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#581C87] uppercase">
              TV Display
            </h3>
            <p className="mt-1 text-xs text-[#7E22CE] leading-relaxed line-clamp-2">
              4K LED backlight repair, screen lines, power boards, and HDMI port replacements.
            </p>
          </div>

          {/* 3D Smart TV Graphic */}
          <div className="relative flex items-center justify-center pt-4 pb-1">
            <div className="relative w-44 h-28 flex items-center justify-center">
              <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="tv-screen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E1B4B" />
                    <stop offset="100%" stopColor="#7E22CE" />
                  </linearGradient>
                </defs>
                {/* TV Panel */}
                <rect x="20" y="15" width="120" height="68" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <rect x="23" y="18" width="114" height="62" rx="2" fill="url(#tv-screen)" />
                {/* Stand */}
                <polygon points="75,83 85,83 88,92 72,92" fill="#475569" />
                <rect x="62" y="92" width="36" height="3" rx="1.5" fill="#334155" />
              </svg>
              {/* Contact Shadow */}
              <div className="absolute bottom-1 w-28 h-2 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>
        </Link>

        {/* 5. WASHING MACHINE (Square Card - Pastel Mint, matching PARTY DECORS card) */}
        <Link
          href={`/services?category=${encodeURIComponent("Washing Machine")}`}
          className="lg:col-span-4 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#E2F7EB] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">
              Laundry Appliances
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#14532D] uppercase">
              Washing Machine
            </h3>
            <p className="mt-1 text-xs text-[#15803D] leading-relaxed line-clamp-2">
              Drum leveling, spin vibration, clogged drainage pumps, and motor clutch servicing.
            </p>
          </div>

          {/* 3D Washing Machine Graphic */}
          <div className="relative flex items-center justify-center pt-4 pb-1">
            <div className="relative w-40 h-28 flex items-center justify-center">
              <svg viewBox="0 0 140 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="washer-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </linearGradient>
                </defs>
                {/* Body */}
                <rect x="35" y="10" width="70" height="80" rx="8" fill="url(#washer-body)" stroke="#94A3B8" strokeWidth="2" />
                {/* Control Panel */}
                <rect x="42" y="16" width="30" height="6" rx="2" fill="#0F172A" />
                <circle cx="85" cy="19" r="4" fill="#38BDF8" />
                {/* Glass Door */}
                <circle cx="70" cy="55" r="22" fill="#0284C7" stroke="#64748B" strokeWidth="3" />
                <circle cx="70" cy="55" r="16" fill="#0369A1" />
                <circle cx="74" cy="51" r="5" fill="#38BDF8" fillOpacity="0.6" />
              </svg>
              {/* Contact Shadow */}
              <div className="absolute bottom-1 w-24 h-2.5 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>
        </Link>

        {/* 6. ELECTRICAL (Square Card - Pastel Peach/Warm Coral) */}
        <Link
          href={`/services?category=${encodeURIComponent("Electrical")}`}
          className="lg:col-span-5 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#FEEADB] p-6 sm:p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
              Power & Safety
            </span>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[#7C2D12] uppercase">
              Electrical
            </h3>
            <p className="mt-1 text-xs text-[#C2410C] leading-relaxed line-clamp-2">
              Main distribution boards, short circuits, safety breakers, and commercial rewiring.
            </p>
          </div>

          {/* 3D Electrical Breaker Graphic */}
          <div className="relative flex items-center justify-center pt-4 pb-1">
            <div className="relative w-40 h-28 flex items-center justify-center">
              <svg viewBox="0 0 140 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="panel-body" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>
                </defs>
                {/* Breaker Box */}
                <rect x="35" y="15" width="70" height="75" rx="6" fill="url(#panel-body)" stroke="#475569" strokeWidth="2" />
                {/* Switches */}
                <rect x="44" y="26" width="10" height="18" rx="2" fill="#F97316" />
                <rect x="58" y="26" width="10" height="18" rx="2" fill="#22C55E" />
                <rect x="72" y="26" width="10" height="18" rx="2" fill="#F97316" />
                <rect x="86" y="26" width="10" height="18" rx="2" fill="#22C55E" />
                {/* Indicator LEDs */}
                <circle cx="49" cy="54" r="2.5" fill="#EF4444" />
                <circle cx="63" cy="54" r="2.5" fill="#22C55E" />
                <circle cx="77" cy="54" r="2.5" fill="#EF4444" />
                <circle cx="91" cy="54" r="2.5" fill="#22C55E" />
              </svg>
              {/* Contact Shadow */}
              <div className="absolute bottom-1 w-24 h-2.5 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>
        </Link>

        {/* 7. REFRIGERATOR (Wide Banner Card - Right, matching DIAMOND RING card) */}
        <Link
          href={`/services?category=${encodeURIComponent("Refrigerator")}`}
          className="lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#FDE2DF] p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Left Content */}
            <div className="sm:col-span-6 space-y-3 z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E11D48]">
                Kitchen Preservation
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#881337] uppercase">
                Refrigerator
              </h3>
              <p className="text-xs text-[#9F1239] leading-relaxed line-clamp-2">
                Inverter compressors, defrost heaters, thermostat sensors, and door seal gasket replacements.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#881337] px-4 py-2 text-xs font-bold text-white shadow-xs group-hover:bg-[#18756B] transition">
                  <span>BOOK REPAIR</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="sm:col-span-6 flex items-center justify-center py-4 relative">
              <div className="relative w-44 h-48 flex items-center justify-center">
                {/* 3D Refrigerator Illustration */}
                <svg viewBox="0 0 160 200" className="w-full h-full drop-shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <defs>
                    <linearGradient id="fridge-metal" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#CBD5E1" />
                      <stop offset="50%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                    <linearGradient id="fridge-handle" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                  </defs>
                  {/* Outer Cabinet */}
                  <rect x="35" y="10" width="90" height="175" rx="12" fill="url(#fridge-metal)" stroke="#94A3B8" strokeWidth="2" />
                  {/* Upper Freezer Door */}
                  <rect x="38" y="13" width="84" height="60" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="45" y="45" width="4" height="22" rx="2" fill="url(#fridge-handle)" />
                  {/* Lower Fridge Door */}
                  <rect x="38" y="78" width="84" height="102" rx="6" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1" />
                  <rect x="45" y="85" width="4" height="35" rx="2" fill="url(#fridge-handle)" />
                  {/* Digital Water/Ice Dispenser */}
                  <rect x="75" y="95" width="32" height="42" rx="4" fill="#0F172A" />
                  <circle cx="91" cy="104" r="3" fill="#38BDF8" />
                  <rect x="85" y="125" width="12" height="4" rx="1" fill="#475569" />
                </svg>
                {/* Contact Shadow */}
                <div className="absolute -bottom-2 w-32 h-4 rounded-full bg-black/15 blur-md" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
