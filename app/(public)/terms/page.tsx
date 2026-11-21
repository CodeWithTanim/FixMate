import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
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
              <Scale className="h-6 w-6 text-[#18756B]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#526564]">
                Legal & Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#152C2B] tracking-tight">
                Terms of Service
              </h1>
            </div>
          </div>

          <div className="prose text-xs text-[#526564] space-y-4 leading-relaxed">
            <p>
              Welcome to FixMate. By accessing our platform, booking repair services, or registering as an independent repair technician, you agree to comply with the following operational terms.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">1. The FixMate Service Marketplace</h3>
            <p>
              FixMate connects customers seeking on-demand electronic device and home appliance repair with vetted independent technicians. Service estimates listed on catalog pages represent baseline quotes. Final billing is determined upon diagnosis and customer approval.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">2. Pay-After-Completion Policy</h3>
            <p>
              Customers are not obligated to make upfront deposit payments. Payment is invoiced and settled only after the repair job has been marked completed by the servicing technician.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">3. Technician Responsibilities & Quality Standards</h3>
            <p>
              Technicians represent that they possess the skills and equipment necessary to perform scheduled repairs safely. Any service listing edits undergo mandatory administrative moderation to safeguard customer trust.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">4. Payment Processing</h3>
            <p>
              Transactions are securely processed through Stripe. In demonstration environments, payments operate in Stripe test mode and do not incur real monetary charges.
            </p>

            <h3 className="text-sm font-bold text-[#152C2B] pt-2">5. Cancellations</h3>
            <p>
              Customers may cancel a repair request at any time prior to technician acceptance without penalty.
            </p>
          </div>

          <div className="pt-6 border-t border-[#DCE5DF] flex items-center justify-between text-[11px] text-[#526564]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#18756B]" />
              <span>FixMate Governance Standards</span>
            </span>
            <span>Effective: November 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
