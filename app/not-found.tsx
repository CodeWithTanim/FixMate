import Link from "next/link";
import { Wrench, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F6F5EF] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#DCE5DF] bg-white p-8 sm:p-10 shadow-lg text-center space-y-6">
        {/* Themed repair illustration */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0B3638] shadow-md">
          <Wrench className="h-12 w-12 text-[#F4B740] rotate-45 transform" />
          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#18756B] text-[11px] font-black text-white shadow-xs">
            404
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#18756B] bg-[#18756B]/10 px-2.5 py-0.5 rounded-full">
            Under Maintenance / Page Missing
          </span>
          <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">
            This Component Needs a Fix
          </h1>
          <p className="text-xs text-[#526564] leading-relaxed">
            The service listing, technician workspace, or page you were looking for doesn&apos;t seem to exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3638] px-4 py-3 text-xs font-bold text-white hover:bg-[#152C2B] transition shadow-xs"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/services"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-4 py-3 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition"
          >
            <Search className="h-4 w-4 text-[#18756B]" />
            <span>Browse Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
