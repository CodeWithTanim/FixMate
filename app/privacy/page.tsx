import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F6F5EF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18756B] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-3xl border border-[#DCE5DF] bg-white p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-[#18756B]">
            <div className="p-3 rounded-2xl bg-[#18756B]/10">
              <Lock className="h-6 w-6 text-[#18756B]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#526564]">
                Data & Protection
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#152C2B] tracking-tight">
                Privacy Policy
              </h1>
            </div>
          </div>

          <div className="prose text-xs text-[#526564] space-y-4 leading-relaxed">
            <p>
              FixMate is committed to maintaining the confidentiality, security, and integrity of your personal contact data and service requests.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">1. Information We Collect</h3>
            <p>
              When requesting repairs, we collect your name, contact phone number, service address, and problem description so that assigned technicians can coordinate diagnostics and arrival.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">2. How Information Is Shared</h3>
            <p>
              Your contact details are shared strictly with the certified technician assigned to fulfill your specific repair booking. We do not sell or rent customer contact information to third-party advertisers.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">3. Payment Information Security</h3>
            <p>
              Payment data is encrypted and transferred directly to Stripe. FixMate does not store credit card numbers on its servers.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">4. User Account Control</h3>
            <p>
              You may update your profile name, contact phone, and operating area at any time through your Account Profile dashboard.
            </p>
          </div>

          <div className="pt-6 border-t border-[#DCE5DF] flex items-center justify-between text-[11px] text-[#526564]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#18756B]" />
              <span>FixMate Security & Privacy</span>
            </span>
            <span>Effective: November 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
