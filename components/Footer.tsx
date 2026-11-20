import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  const categories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
  ];

  return (
    <footer className="border-t border-[#0B3638] bg-[#0B3638] text-[#F6F5EF]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand & mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4B740] text-[#152C2B] font-bold">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fix<span className="text-[#F4B740]">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-[#DCE5DF]/80 leading-relaxed">
              Transparent, reliable on-demand repair services. Connect with local certified technicians for smartphones, computers, and home appliances.
            </p>
            <div className="text-[11px] text-[#F4B740] font-semibold">
              Payment only upon verified job completion.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">Navigation</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#DCE5DF]">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">Browse Services</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-white transition">Join as Technician</Link>
              </li>
            </ul>
          </div>

          {/* Repair Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">Repair Categories</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#DCE5DF]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <Link href={`/services?category=${encodeURIComponent(cat)}`} className="hover:text-white transition">
                    {cat} Repair
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust and safety */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">Guaranteed Workflows</h3>
            <p className="mt-4 text-xs text-[#DCE5DF]/80 leading-relaxed">
              Every job begins with clear base rates and agreed diagnostic scopes. Safe payments processed via Stripe test mode.
            </p>
            <div className="mt-4 text-[11px] text-[#DCE5DF]/60">
              Demo platform for certified device & appliance repairs.
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#DCE5DF]/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#DCE5DF]/60">
          <p>&copy; {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/about" className="hover:text-white transition">Terms & Protection</Link>
            <Link href="/about" className="hover:text-white transition">Privacy Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
