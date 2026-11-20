import Link from "next/link";
import { ShieldCheck, Clock, CheckCircle2, ArrowRight, Laptop, Smartphone, Tv, Wind, Refrigerator, Zap, Sparkles, MapPin, Tag, Wrench } from "lucide-react";
import { getPublicServices } from "@/lib/api/services";
import type { ServiceItem } from "@/types";

export default async function HomePage() {
  const categories = [
    { name: "Smartphone", icon: Smartphone, description: "Display, battery, charging ports, water damage" },
    { name: "Laptop & PC", icon: Laptop, description: "OS recovery, motherboard, battery, SSD upgrades" },
    { name: "AC", icon: Wind, description: "Deep cleaning, gas recharge, cooling issues, PCB" },
    { name: "Refrigerator", icon: Refrigerator, description: "Thermostat, compressor, cooling coils, frost" },
    { name: "TV", icon: Tv, description: "LED panel, backlight, power boards, audio faults" },
    { name: "Washing Machine", icon: Sparkles, description: "Motor, drum alignment, drain pump, spin errors" },
    { name: "Electrical", icon: Zap, description: "Wiring, short circuits, breakers, switchboards" },
  ];

  const steps = [
    {
      num: "01",
      title: "Select Service & Issue",
      desc: "Choose your appliance or gadget category and describe the specific symptoms.",
    },
    {
      num: "02",
      title: "Local Certified Tech",
      desc: "Connect with vetted local technicians offering upfront base inspection rates.",
    },
    {
      num: "03",
      title: "Doorstep or Shop Drop-off",
      desc: "Flexible service modes to suit your schedule. Diagnostic updates in real time.",
    },
    {
      num: "04",
      title: "Pay Upon Completion",
      desc: "Inspect your repaired device first. Pay seamlessly via Stripe only after it's fixed.",
    },
  ];

  // Fetch 6 newest approved services from database
  const { data: featuredServices } = await getPublicServices({ limit: 6, sort: "newest" });

  return (
    <div className="space-y-16 pb-16">
      {/* Split Editorial Hero */}
      <section className="relative overflow-hidden bg-[#F6F5EF] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#DCE5DF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#18756B]/30 bg-[#18756B]/10 px-3.5 py-1 text-xs font-bold text-[#18756B]">
                <ShieldCheck className="h-4 w-4" />
                Pay Only When Your Repair Is Completely Done
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-[#152C2B] sm:text-5xl lg:text-6xl leading-[1.15]">
                A broken device <br />
                <span className="text-[#18756B]">shouldn’t break your day.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#526564] max-w-xl leading-relaxed">
                Connect with certified local technicians for smartphone, PC, AC, and home appliance repairs. Honest base pricing, doorstep convenience, and zero upfront risk.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/services"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#18756B] px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-[#135d55] transition"
                >
                  <span>Browse Repair Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-white px-6 py-3.5 text-sm font-bold text-[#152C2B] hover:bg-slate-50 transition"
                >
                  <span>How Payment Protection Works</span>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="pt-4 border-t border-[#DCE5DF]/60 flex flex-wrap gap-6 text-xs text-[#526564]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B]" />
                  <span>Verified Technician Identity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B]" />
                  <span>Transparent Base Prices</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#18756B]" />
                  <span>Stripe Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Column: Original Repair Workbench Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-[#0B3638]/20 bg-[#0B3638] p-6 text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#18756B]/30 rounded-full blur-2xl" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4B740] text-[#152C2B]">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">FixMate Diagnostic Station</div>
                        <div className="text-[10px] text-slate-300">Active Job Inspection</div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                      Live Flow
                    </span>
                  </div>

                  {/* Visual card */}
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Device Type</span>
                      <span className="font-semibold text-white">Laptop & PC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Service Mode</span>
                      <span className="font-semibold text-[#F4B740]">Home Visit</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Base Price</span>
                      <span className="font-bold text-white">$45.00</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <span className="text-slate-300">Payment Status</span>
                      <span className="font-semibold text-emerald-400">Pay Upon Repair</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Technicians inspect your device, confirm required parts, and agree on the final amount before completing the repair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#18756B]">Categories</span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#152C2B] sm:text-3xl">
            Choose Your Repair Category
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#526564]">
            Select an appliance or device to view verified technicians and transparent rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs hover:border-[#18756B] hover:shadow-md transition"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18756B]/10 text-[#18756B] group-hover:bg-[#18756B] group-hover:text-white transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-[#152C2B] group-hover:text-[#18756B] transition">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#526564] line-clamp-2">{cat.description}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-bold text-[#18756B]">
                  <span>View Services</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dynamic 6 Newest Featured Services */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#18756B]">Verified Listings</span>
            <h2 className="text-2xl font-bold tracking-tight text-[#152C2B] sm:text-3xl">
              Latest Featured Services
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#526564]">
              Real approved offerings from local repair specialists.
            </p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1 text-xs font-bold text-[#18756B] hover:text-[#135d55]"
          >
            <span>View All Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featuredServices && featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service: ServiceItem) => (
              <div
                key={service.id || service._id}
                className="flex flex-col justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs hover:border-[#18756B] hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#18756B]/10 px-2.5 py-0.5 font-bold text-[#18756B]">
                      <Tag className="h-3 w-3" />
                      {service.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#526564]">{service.serviceMode}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#152C2B] line-clamp-1">{service.title}</h3>
                  <p className="text-xs text-[#526564] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#526564] border-t border-[#DCE5DF]/60">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#526564]" />
                      <span>{service.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#526564]" />
                      <span>{service.serviceArea}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#DCE5DF]/60">
                  <div>
                    <span className="text-[10px] text-[#526564] uppercase font-semibold">From</span>
                    <div className="text-lg font-extrabold text-[#152C2B]">${service.basePrice}</div>
                  </div>
                  <Link
                    href={`/services/${service.id || service._id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-[#18756B] px-4 py-2 text-xs font-bold text-white hover:bg-[#135d55] transition"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-10 text-center space-y-3">
            <Wrench className="h-8 w-8 text-[#526564] mx-auto" />
            <h3 className="text-sm font-bold text-[#152C2B]">No Approved Services Listed Yet</h3>
            <p className="text-xs text-[#526564] max-w-sm mx-auto">
              Our technicians are currently submitting their service offerings for review. Browse all categories or join as a technician.
            </p>
          </div>
        )}
      </section>

      {/* 4-Step Process */}
      <section className="bg-white py-16 border-y border-[#DCE5DF]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#18756B]">Simple Workflow</span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#152C2B] sm:text-3xl">
              How Repair Requests Work
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#526564]">
              Clear steps from booking diagnosis to secure post-completion payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-[#DCE5DF] bg-[#F6F5EF] p-6 flex flex-col"
              >
                <div className="text-3xl font-black text-[#18756B]/30 mb-2">{step.num}</div>
                <h3 className="text-sm font-bold text-[#152C2B]">{step.title}</h3>
                <p className="mt-2 text-xs text-[#526564] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0B3638] p-8 sm:p-12 text-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4B740] text-[#152C2B] font-bold mx-auto md:mx-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4B740]">Payment Protection</h3>
              <p className="text-xs text-[#DCE5DF]/80 leading-relaxed">
                You never pay in advance. Payment is only initiated after the technician finishes the job and you inspect the device.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4B740] text-[#152C2B] font-bold mx-auto md:mx-0">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4B740]">Estimated Durations</h3>
              <p className="text-xs text-[#DCE5DF]/80 leading-relaxed">
                Clear estimated turnaround times for both doorstep visits and workshop drop-offs so you can plan your day.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4B740] text-[#152C2B] font-bold mx-auto md:mx-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[#F4B740]">Moderated Quality</h3>
              <p className="text-xs text-[#DCE5DF]/80 leading-relaxed">
                All technician services are reviewed and approved before becoming publicly visible on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
