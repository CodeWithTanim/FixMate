import Link from "next/link";
import { ShieldCheck, Clock, CheckCircle2, ArrowRight, Laptop, Smartphone, Tv, Wind, Refrigerator, Zap, Sparkles } from "lucide-react";

export default function HomePage() {
  const categories = [
    { name: "Smartphone", icon: Smartphone, description: "Screens, batteries, water damage" },
    { name: "Laptop & PC", icon: Laptop, description: "Hardware upgrades, motherboard, OS" },
    { name: "AC", icon: Wind, description: "Servicing, gas refill, cooling repair" },
    { name: "Refrigerator", icon: Refrigerator, description: "Compressor, cooling issues, thermostat" },
    { name: "TV", icon: Tv, description: "Panel replacement, audio, power issues" },
    { name: "Washing Machine", icon: Sparkles, description: "Drum repair, motor, drainage faults" },
    { name: "Electrical", icon: Zap, description: "Wiring, switchboards, short circuits" },
  ];

  const steps = [
    {
      num: "01",
      title: "Choose Your Repair",
      desc: "Select your device or home appliance and describe the issue with clear details.",
    },
    {
      num: "02",
      title: "Select Certified Tech",
      desc: "Connect with verified local technicians offering transparent base rates.",
    },
    {
      num: "03",
      title: "Home Visit or Drop-off",
      desc: "Get your repair done at your doorstep or drop it off at the technician's repair shop.",
    },
    {
      num: "04",
      title: "Pay After Completion",
      desc: "Inspect the completed job and pay securely via Stripe only when satisfied.",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 to-white pt-12 pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              <ShieldCheck className="h-4 w-4" />
              Trusted On-Demand Device & Appliance Repairs
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Reliable Repairs, <br className="hidden sm:inline" />
              <span className="text-sky-600">Fixed Right at Your Doorstep</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Find certified technicians for smartphones, laptops, ACs, refrigerators, and home appliances. Pay safely after the work is completely done.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/services"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-700 transition"
              >
                <span>Browse Repair Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>How FixMate Works</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Popular Repair Categories
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Select a category to view available certified technicians in your area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-sky-500 hover:shadow-md transition"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-sky-600 transition">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{cat.description}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-sky-600">
                  <span>View Services</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works (4-Step Process) */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Simple & Transparent</span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              How FixMate Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Four straightforward steps from booking to hassle-free payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col"
              >
                <div className="text-2xl font-black text-sky-600/30 mb-2">{step.num}</div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Pay Upon Completion</h3>
              <p className="text-sm text-slate-300">
                You never pay upfront. Technicians only collect after you have inspected and verified the repair.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Flexible Service Modes</h3>
              <p className="text-sm text-slate-300">
                Choose convenient doorstep home visits or shop drop-offs based on your schedule and needs.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Transparent Base Rates</h3>
              <p className="text-sm text-slate-300">
                Clear estimated duration and transparent base prices with no hidden booking fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
