import Link from "next/link";
import { CheckCircle, DollarSign, Users, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#18756B] bg-[#18756B]/10 px-3 py-1 rounded-full border border-[#18756B]/20">
          About FixMate
        </span>
        <h1 className="text-3xl font-black tracking-tight text-[#152C2B] sm:text-4xl">
          On-Demand Device & Appliance Repairs You Can Rely On
        </h1>
        <p className="text-sm text-[#526564] leading-relaxed">
          FixMate connects home owners and device users with skilled local technicians across 7 critical repair categories with upfront visibility and zero deposit.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18756B]/10 text-[#18756B]">
            <DollarSign className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-[#152C2B]">Pay-After-Completion</h2>
          <p className="text-xs text-[#526564] leading-relaxed">
            Payment is only triggered once the technician marks the repair completed and you inspect the device. Payments are securely processed through Stripe test mode.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18756B]/10 text-[#18756B]">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-[#152C2B]">Direct Technician Access</h2>
          <p className="text-xs text-[#526564] leading-relaxed">
            Every service listing clearly displays the technician name, service area, base price, and mode (Home Visit or Shop Drop-off) with direct contact details.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18756B]/10 text-[#18756B]">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-[#152C2B]">Moderated Catalog</h2>
          <p className="text-xs text-[#526564] leading-relaxed">
            Every service listing and subsequent price update undergoes administrative review before public exposure to protect quality and safety.
          </p>
        </div>
      </div>

      {/* How Workflow Works */}
      <div className="rounded-3xl border border-[#DCE5DF] bg-white p-8 sm:p-10 shadow-xs space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B]">
            Transparent Process
          </span>
          <h2 className="text-2xl font-black text-[#152C2B] tracking-tight mt-1">
            The 4-Step Repair Lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#526564]">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]/60">
            <CheckCircle className="h-5 w-5 text-[#18756B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#152C2B] block text-sm mb-1">1. Customer Requests Repair</strong>
              Select an approved catalog service, describe the malfunction, specify your preferred appointment date, and provide contact details.
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]/60">
            <CheckCircle className="h-5 w-5 text-[#18756B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#152C2B] block text-sm mb-1">2. Technician Accepts</strong>
              The assigned repair technician reviews the job request details and accepts the appointment, transitioning the job to active progress.
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]/60">
            <CheckCircle className="h-5 w-5 text-[#18756B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#152C2B] block text-sm mb-1">3. Diagnosis & Completion</strong>
              The technician conducts repairs on-site or in-shop. Once tested, the technician finalizes the job with the billable repair amount.
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]/60">
            <CheckCircle className="h-5 w-5 text-[#18756B] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-[#152C2B] block text-sm mb-1">4. Stripe Settlement</strong>
              The customer receives the completion notice and settles the invoice directly via Stripe card checkout, receiving an instant receipt.
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-4 border-t border-[#DCE5DF]">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-5 py-3 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs"
          >
            <span>Explore Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-5 py-3 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition"
          >
            <span>Join as a Technician</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
