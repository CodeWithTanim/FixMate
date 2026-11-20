import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceById } from "@/lib/api/services";
import { MapPin, Clock, ShieldCheck, Tag, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import BookingRequestModal from "@/components/BookingRequestModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { UserProfile } from "@/types";

export default async function ServiceDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { service, error } = await getServiceById(id);

  if (error || !service) {
    notFound();
  }

  // Check current user session for role-aware request flow
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  const currentUser = session?.user as unknown as UserProfile | undefined;
  const role = currentUser?.role;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18756B] hover:text-[#135d55]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#18756B]/10 px-3 py-1 text-xs font-bold text-[#18756B]">
                <Tag className="h-3.5 w-3.5" />
                {service.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-[#526564]">
                {service.serviceMode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#152C2B]">
              {service.title}
            </h1>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#152C2B] uppercase tracking-wider">Service Scope</h2>
              <p className="text-sm text-[#526564] leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DCE5DF]/60 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#18756B]" />
                <div>
                  <div className="font-bold text-[#152C2B]">{service.estimatedDuration}</div>
                  <div className="text-[10px] text-[#526564]">Estimated turnaround</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#18756B]" />
                <div>
                  <div className="font-bold text-[#152C2B]">{service.serviceArea}</div>
                  <div className="text-[10px] text-[#526564]">Service coverage area</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing transparency note */}
          <div className="rounded-2xl border border-[#18756B]/20 bg-[#18756B]/5 p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#18756B]">
              <ShieldCheck className="h-4 w-4" />
              <span>Transparent Base Pricing Policy</span>
            </div>
            <p className="text-xs text-[#526564] leading-relaxed">
              The base price of <strong>${service.basePrice}</strong> covers initial diagnostic inspection and standard labor. Any replacement parts required will be confirmed and agreed upon with you before completing work.
            </p>
          </div>
        </div>

        {/* Right Summary / Request Action Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#526564]">Inspection & Starting Rate</span>
              <div className="text-3xl font-black text-[#152C2B] mt-0.5">${service.basePrice}</div>
              <p className="text-[11px] text-[#526564] mt-1">
                Zero upfront payment. Pay via Stripe after repair completion.
              </p>
            </div>

            {/* Technician Profile Card */}
            <div className="rounded-2xl border border-[#DCE5DF] bg-[#F6F5EF] p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#18756B]">Assigned Technician</span>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3638] text-white font-bold text-sm">
                  {service.technicianName?.[0] || "T"}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#152C2B]">{service.technicianName}</div>
                  <div className="text-[10px] text-[#526564] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Certified FixMate Partner</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action based on session role */}
            <div className="pt-2">
              {!currentUser ? (
                <div className="space-y-3">
                  <Link
                    href={`/sign-in?callbackUrl=/services/${service.id || service._id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#18756B] py-3 text-sm font-bold text-white hover:bg-[#135d55] transition"
                  >
                    <span>Sign In to Request Repair</span>
                  </Link>
                  <p className="text-center text-[11px] text-[#526564]">
                    Requires a customer account to place repair bookings.
                  </p>
                </div>
              ) : role === "customer" ? (
                <BookingRequestModal service={service} currentUser={currentUser} />
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Customer Account Required</span>
                  </div>
                  <p className="text-[11px]">
                    You are signed in as a <strong>{role}</strong>. Repair requests can only be placed from a customer account.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
