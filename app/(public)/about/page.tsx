import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Cpu,
  Zap,
  Check,
  Star,
} from "lucide-react";

export const metadata = {
  title: "About Us | FixMate",
  description:
    "Learn about FixMate's mission to revolutionize device and home appliance repairs through verified technicians, upfront transparent pricing, and pay-after-satisfaction escrow protection.",
};

export default function AboutPage() {
  const stats = [
    { value: "15,000+", label: "Devices Revived", sub: "Laptops, phones & appliances" },
    { value: "99.4%", label: "First-Visit Resolution", sub: "Thorough multi-point testing" },
    { value: "450+", label: "Verified Technicians", sub: "Vetted background & bench audit" },
    { value: "$0", label: "Upfront Deposit", sub: "Pay only after device inspection" },
  ];

  const comparisons = [
    {
      old: "Hidden markups & unexpected final bills",
      fixmate: "Locked upfront quotes with zero surprise fees",
    },
    {
      old: "Pay in advance with zero guarantee of success",
      fixmate: "Escrow protection: pay only after inspecting your repair",
    },
    {
      old: "Unknown street mechanics with no background checks",
      fixmate: "Vetted master technicians with public ratings and badges",
    },
    {
      old: "Weeks of waiting without any status updates",
      fixmate: "Live dashboard tracking with real-time diagnostic milestones",
    },
  ];

  const pillars = [
    {
      number: "01",
      title: "Zero Upfront Risk",
      description:
        "We fundamentally flipped the repair industry model. No deposits, no hostage devices. You release payment via Stripe only when your device is back in your hands and fully tested.",
      tag: "Escrow Protection",
      sphereColor: "bg-[#18756B]",
      cardBg: "bg-white",
    },
    {
      number: "02",
      title: "Vetted Master Craftsmen",
      description:
        "Only certified specialists with proven hardware experience join FixMate. Every technician undergoes identity verification, criminal background vetting, and workbench skill assessment.",
      tag: "Verified Expertise",
      sphereColor: "bg-[#FF7F3E]",
      cardBg: "bg-white",
    },
    {
      number: "03",
      title: "Radical Transparency",
      description:
        "From multimeter readings to final thermal scans, every diagnostic milestone is logged on your order timeline. You always know what was replaced, why, and how much it costs.",
      tag: "Live Milestone Feed",
      sphereColor: "bg-[#2563EB]",
      cardBg: "bg-white",
    },
    {
      number: "04",
      title: "Right to Repair & Planet",
      description:
        "Every repaired appliance or smartphone prevents toxic e-waste from entering landfills. We believe in prolonging hardware life cycles with OEM-grade components and precision repairs.",
      tag: "Sustainable Hardware",
      sphereColor: "bg-[#10B981]",
      cardBg: "bg-white",
    },
  ];

  const diagnosticSteps = [
    {
      step: "Phase 1",
      title: "Micro-Inspection & Fault Isolation",
      desc: "Deep circuit-level testing, voltage rail verification, and thermal sensor calibration to pinpoint root cause.",
      icon: Cpu,
    },
    {
      step: "Phase 2",
      title: "OEM-Grade Component Replacement",
      desc: "Precision soldering, genuine part installation, and factory-standard torque specifications.",
      icon: Wrench,
    },
    {
      step: "Phase 3",
      title: "Stress & Thermal Validation",
      desc: "Extended benchmark load testing to verify stability under heavy real-world operating conditions.",
      icon: Zap,
    },
    {
      step: "Phase 4",
      title: "Customer Acceptance & Payment",
      desc: "Comprehensive client inspection at doorstep or counter. Payment settles securely upon your sign-off.",
      icon: ShieldCheck,
    },
  ];

  const craftsmen = [
    {
      name: "Tariqul Islam",
      role: "Lead Micro-Soldering Specialist",
      specialty: "Logic Board Diagnostics & Apple Silicon",
      experience: "12+ Years Experience",
      repairs: "3,200+ Repairs",
      rating: "4.99",
      initials: "TI",
      gradient: "from-[#18756B] to-[#0D443E]",
    },
    {
      name: "Farhan Ahmed",
      role: "HVAC & Thermal Systems Engineer",
      specialty: "Inverter AC & Compressor Overhauls",
      experience: "15+ Years Experience",
      repairs: "4,100+ Repairs",
      rating: "4.98",
      initials: "FA",
      gradient: "from-[#FF7F3E] to-[#C8561B]",
    },
    {
      name: "Nusrat Jahan",
      role: "Appliance & Motor Systems Lead",
      specialty: "Smart Refrigerators & Washer Logic",
      experience: "9+ Years Experience",
      repairs: "2,450+ Repairs",
      rating: "5.00",
      initials: "NJ",
      gradient: "from-[#2563EB] to-[#1D4ED8]",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION: Bold Editorial Title + Floating Ambient Layers */}
      <section className="relative overflow-hidden bg-[#F6F5EF] pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-[#DCE5DF]">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-96 w-[700px] rounded-full bg-[#18756B]/10 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-10 -z-10 h-72 w-72 rounded-full bg-[#FF7F3E]/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#18756B]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#18756B] shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Building Trust in the Repair Industry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#152C2B] leading-[1.08]">
              Fixing what’s broken. <br />
              <span className="text-[#18756B]">Restoring what matters.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#526564] leading-relaxed max-w-2xl mx-auto">
              FixMate was founded to eradicate the uncertainty, hidden costs, and stress of hardware breakdowns. We connect everyday device owners with verified master technicians under a strict pay-after-satisfaction escrow model.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#135d55] transition transform hover:-translate-y-0.5"
              >
                <span>Browse Repair Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5DF] bg-white px-6 py-3.5 text-sm font-bold text-[#152C2B] hover:bg-slate-50 transition shadow-xs"
              >
                <span>Join as a Technician</span>
              </Link>
            </div>
          </div>

          {/* Interactive Stat Cards Grid */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#18756B]/40 hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#152C2B] tracking-tight group-hover:text-[#18756B] transition-colors">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-bold text-[#152C2B]">{stat.label}</div>
                <div className="mt-0.5 text-xs text-[#526564]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE FIXMATE REVOLUTION: The Old Way vs The FixMate Way */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#152C2B]">
            Why Traditional Repairs Were Broken
          </h2>
          <p className="text-sm text-[#526564]">
            For decades, getting your phone, laptop, or refrigerator repaired felt like a gamble. We changed the rules of the game.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Old Way Card */}
          <div className="rounded-3xl border border-rose-200/80 bg-rose-50/40 p-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                ✕
              </div>
              <h3 className="text-lg font-bold text-rose-950">The Old Repair Experience</h3>
            </div>

            <div className="space-y-4">
              {comparisons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-rose-900/80">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item.old}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FixMate Way Card */}
          <div className="rounded-3xl border-2 border-[#18756B]/30 bg-white p-8 space-y-6 shadow-lg shadow-[#18756B]/5 relative">
            <div className="absolute top-4 right-4">
              <span className="inline-block rounded-full bg-[#18756B] px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                FixMate Standard
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[#18756B]/10 flex items-center justify-center text-[#18756B] font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-[#152C2B]">The FixMate Standard</h3>
            </div>

            <div className="space-y-4">
              {comparisons.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#152C2B] font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B] shrink-0 mt-0.5" />
                  <span>{item.fixmate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS: Bento Grid with Floating Modern Spheres */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#152C2B]">
            Our Foundational Pillars
          </h2>
          <p className="text-sm text-[#526564]">
            Every line of code and every technician onboarding check is built around four non-negotiable principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="group relative rounded-3xl border border-[#DCE5DF] bg-white p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#18756B]/50 hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Row: Number + Floating 3D-styled Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#152C2B]/20 group-hover:text-[#18756B]/40 transition-colors">
                  {pillar.number}
                </span>

                <div className="flex items-center gap-2 bg-[#F6F5EF] border border-[#DCE5DF] rounded-full px-3.5 py-1 text-xs font-bold text-[#152C2B]">
                  <span className={`h-2.5 w-2.5 rounded-full ${pillar.sphereColor} animate-pulse`} />
                  <span>{pillar.tag}</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#152C2B] group-hover:text-[#18756B] transition-colors">
                {pillar.title}
              </h3>

              <p className="mt-3 text-sm text-[#526564] leading-relaxed">
                {pillar.description}
              </p>

              {/* Bottom decorative bar */}
              <div className="mt-6 pt-4 border-t border-[#DCE5DF]/60 flex items-center justify-between text-xs font-semibold text-[#18756B]">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>FixMate Verified Guarantee</span>
                </div>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE DIAGNOSTIC BENCHMARK: 4-Phase Quality Lifecycle */}
      <section className="bg-[#152C2B] text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 -z-0 h-96 w-96 rounded-full bg-[#18756B]/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 -z-0 h-80 w-80 rounded-full bg-[#FF7F3E]/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-white/10 uppercase tracking-widest">
              Standard Operating Procedure
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              The 4-Phase Quality Lifecycle
            </h2>
            <p className="text-sm text-slate-300">
              No guesswork. Every repair job conforms to certified engineering diagnostics before final sign-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diagnosticSteps.map((diag, index) => {
              const IconComponent = diag.icon;
              return (
                <div
                  key={diag.step}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col justify-between hover:bg-white/10 transition duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                        {diag.step}
                      </span>
                      <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[#18756B] transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {diag.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {diag.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Inspection Milestone #{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MEET OUR MASTER CRAFTSMEN: Real People, Real Engineering */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#152C2B]">
            Meet the Craftsmen
          </h2>
          <p className="text-sm text-[#526564]">
            FixMate is powered by passionate master technicians who treat every device repair with surgical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {craftsmen.map((pro) => (
            <div
              key={pro.name}
              className="rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#18756B]/50"
            >
              <div>
                {/* Avatar with Initials & Gradient */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${pro.gradient} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                    {pro.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#152C2B] group-hover:text-[#18756B] transition-colors">
                      {pro.name}
                    </h3>
                    <p className="text-xs text-[#526564] font-medium">{pro.role}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#526564] pt-2 border-t border-[#DCE5DF]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[#152C2B] font-semibold">Specialty:</span>
                    <span className="text-right text-[#18756B] font-medium">{pro.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#152C2B] font-semibold">Experience:</span>
                    <span>{pro.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#152C2B] font-semibold">Track Record:</span>
                    <span>{pro.repairs}</span>
                  </div>
                </div>
              </div>

              {/* Rating Card Footer */}
              <div className="mt-6 pt-4 border-t border-[#DCE5DF] flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-[#152C2B]">{pro.rating}</span>
                  <span className="text-[10px] text-[#526564]">(Verified Reviews)</span>
                </div>
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                  Top Rated Pro
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HIGH-IMPACT FINAL CTA: Ready to Experience Modern Repairs */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#0B3638] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 -z-0 h-80 w-80 rounded-full bg-[#18756B]/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-0 h-64 w-64 rounded-full bg-[#FF7F3E]/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-white/15">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Zero Upfront Risk. Pay Only After Testing.</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to give your device a second life?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of customers who rely on FixMate for fast, transparent, and certified doorstep and workshop repairs.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0B3638] px-6 py-3.5 text-sm font-bold shadow-md hover:bg-slate-100 transition transform hover:-translate-y-0.5"
              >
                <span>Find Your Repair Service</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 text-white px-6 py-3.5 text-sm font-bold hover:bg-white/20 transition backdrop-blur-xs"
              >
                <span>Join as a Technician</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
