import {
  ShieldCheck,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  Shield,
} from "lucide-react";

export default function HomeWhyChooseUs() {
  const cards = [
    {
      title: "Zero Upfront Risk",
      desc: "You never pay a single cent in advance. Invoices are paid only after the technician finishes the repair and you verify the fix.",
      icon: ShieldCheck,
      sphere: {
        light: "#FDE047",
        dark: "#EAB308",
        deep: "#A16207",
      },
      iconBg: "bg-amber-500/10 text-amber-600",
      tintBg: "bg-amber-50/50 border-amber-100/60",
      rotation: "sm:-rotate-2 hover:rotate-0",
      offset: "sm:translate-y-0",
    },
    {
      title: "Vetted Technicians",
      desc: "Every technician identity, trade background, and service listing is administratively reviewed before taking customer requests.",
      icon: Award,
      sphere: {
        light: "#C084FC",
        dark: "#8B5CF6",
        deep: "#6D28D9",
      },
      iconBg: "bg-purple-500/10 text-purple-600",
      tintBg: "bg-purple-50/50 border-purple-100/60",
      rotation: "sm:rotate-3 hover:rotate-0",
      offset: "sm:translate-y-12",
    },
    {
      title: "Transparent Base Pricing",
      desc: "Upfront base diagnostic rates. Technicians confirm required parts and agree on the final billable amount before proceeding.",
      icon: Layers,
      sphere: {
        light: "#F472B6",
        dark: "#EC4899",
        deep: "#BE185D",
      },
      iconBg: "bg-pink-500/10 text-pink-600",
      tintBg: "bg-pink-50/50 border-pink-100/60",
      rotation: "sm:rotate-2 hover:rotate-0",
      offset: "sm:translate-y-0",
    },
    {
      title: "Doorstep Convenience",
      desc: "Flexible service modes to suit your schedule. Choose doorstep home visits for appliances or workshop drop-off for micro-soldering.",
      icon: Clock,
      sphere: {
        light: "#60A5FA",
        dark: "#3B82F6",
        deep: "#1D4ED8",
      },
      iconBg: "bg-blue-500/10 text-blue-600",
      tintBg: "bg-blue-50/50 border-blue-100/60",
      rotation: "sm:-rotate-2 hover:rotate-0",
      offset: "sm:translate-y-12",
    },
    {
      title: "Milestone Audit Trail",
      desc: "Real-time timestamped status history logs every single step from requested to accepted, in-progress, and completed.",
      icon: CheckCircle2,
      sphere: {
        light: "#4ADE80",
        dark: "#22C55E",
        deep: "#15803D",
      },
      iconBg: "bg-emerald-500/10 text-emerald-600",
      tintBg: "bg-emerald-50/50 border-emerald-100/60",
      rotation: "sm:-rotate-3 hover:rotate-0",
      offset: "sm:translate-y-0",
    },
    {
      title: "Guaranteed Quality",
      desc: "High-grade authentic replacement parts with post-repair testing and authoritative Stripe card payment receipts.",
      icon: Shield,
      sphere: {
        light: "#FB923C",
        dark: "#F97316",
        deep: "#C2410C",
      },
      iconBg: "bg-orange-500/10 text-orange-600",
      tintBg: "bg-orange-50/50 border-orange-100/60",
      rotation: "sm:rotate-2 hover:rotate-0",
      offset: "sm:translate-y-12",
    },
  ];

  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden">
      {/* Section Header with Serif/Italic accent */}
      <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#152C2B]">
          Why <span className="font-serif italic text-[#18756B] font-medium">Choose</span> FixMate?
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#526564]">
          Here&apos;s why device and appliance owners choose us to handle their repair needs:
        </p>
      </div>

      {/* Background Zigzag Connecting Dashed Path (Visible on md+ screens) */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
        <svg
          className="w-full h-full opacity-35"
          viewBox="0 0 1000 1100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 330 220 C 500 240, 500 280, 670 300 C 500 440, 500 500, 330 560 C 500 620, 500 660, 670 700 C 500 840, 500 880, 330 940 C 500 980, 500 1020, 670 1060"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* Staggered 2-Column Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-x-12 sm:gap-y-16">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`transition-all duration-300 transform ${card.rotation} ${card.offset}`}
            >
              {/* Outer Card with High Elevation & 3D Top Sphere */}
              <div className="relative rounded-3xl bg-white border border-[#DCE5DF]/70 p-6 sm:p-7 shadow-[0_20px_50px_rgba(11,54,56,0.08)] hover:shadow-[0_30px_70px_rgba(11,54,56,0.16)] hover:scale-[1.02] transition-all duration-300">
                {/* 3D Realistic Sphere Pin */}
                <div className="absolute -top-4 right-8 sm:right-10 flex items-center justify-center">
                  <svg className="w-9 h-9 drop-shadow-md" viewBox="0 0 36 36">
                    <defs>
                      <radialGradient
                        id={`sphere-grad-${idx}`}
                        cx="35%"
                        cy="30%"
                        r="65%"
                      >
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                        <stop offset="30%" stopColor={card.sphere.light} />
                        <stop offset="75%" stopColor={card.sphere.dark} />
                        <stop offset="100%" stopColor={card.sphere.deep} />
                      </radialGradient>
                    </defs>
                    <circle cx="18" cy="18" r="16" fill={`url(#sphere-grad-${idx})`} />
                  </svg>
                </div>

                {/* Inner Content Block */}
                <div className={`rounded-2xl border p-5 ${card.tintBg} space-y-3`}>
                  {/* Icon */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#152C2B] tracking-tight">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#526564] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
