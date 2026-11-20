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
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fix<span className="text-sky-400">Mate</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transparent, reliable on-demand repair services. Connect with local certified technicians for smartphones, computers, and home appliances.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm">
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
                <Link href="/sign-up" className="hover:text-white transition">Become a Technician</Link>
              </li>
            </ul>
          </div>

          {/* Repair Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Service Categories</h3>
            <ul className="mt-4 space-y-2 text-sm">
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Payment & Safety</h3>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Pay only after your device or appliance has been inspected and repaired. Protected by secure Stripe payments and verified local technicians.
            </p>
            <div className="mt-4 text-xs text-slate-500">
              Customer support available 7 days a week.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
