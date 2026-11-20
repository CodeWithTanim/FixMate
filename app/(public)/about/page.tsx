import Link from "next/link";
import { CheckCircle, DollarSign, Users, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">About FixMate</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          On-Demand Device & Appliance Repairs You Can Rely On
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          FixMate connects home owners and device users with skilled local technicians across 7 critical repair categories.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Zero Upfront Risk</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Payment is only triggered once the technician marks the repair completed and you inspect the device. Payments are securely processed through Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Direct Technician Access</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every service listing clearly displays the technician name, service area, base price, and mode (Home Visit or Shop Drop-off).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Moderated Quality</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every service listing must be reviewed and approved by administrators before appearing publicly to protect repair quality.
          </p>
        </div>
      </div>

      {/* How Workflow Works */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">The Repair Lifecycle</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">1. Customer Requests Repair:</strong> Customer selects an approved service, provides device problem details, preferred date, and contact phone.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">2. Technician Accepts:</strong> The assigned technician reviews the request and moves it to accepted or in-progress.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">3. Job Completion:</strong> The technician inspects the device, fixes the issue, and marks it completed with the agreed final repair amount.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-slate-900">4. Seamless Stripe Payment:</strong> The customer pays safely online and receives an immediate transaction record.
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <Link
            href="/services"
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition"
          >
            Explore Services
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Join as a Technician
          </Link>
        </div>
      </div>
    </div>
  );
}
