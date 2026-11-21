import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="FixMate Logo"
                width={38}
                height={38}
                className="rounded-xl shadow-xs object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Fix<span className="text-[#F4B740]">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-[#DCE5DF]/80 leading-relaxed">
              Transparent, reliable on-demand repair services. Connect with local technicians for smartphones, computers, and home appliances.
            </p>

            {/* Social Links with X icon */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="FixMate on X"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
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
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Repair Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">Repair Categories</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#DCE5DF]">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link href={`/services?category=${encodeURIComponent(cat)}`} className="hover:text-white transition">
                    {cat} Repair
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support Block */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4B740]">Contact & Support</h3>
            <ul className="mt-4 space-y-3 text-xs text-[#DCE5DF]">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#F4B740] shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:support@fixmate.dev" className="hover:text-white transition font-mono">
                    support@fixmate.dev
                  </a>
                  <p className="text-[10px] text-[#DCE5DF]/60">Customer Support Desk</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-[#F4B740] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono">+880 1700-000000</span>
                  <p className="text-[10px] text-[#DCE5DF]/60">Customer Helpline</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-[#F4B740] shrink-0 mt-0.5" />
                <div>
                  <span>9:00 AM – 8:00 PM</span>
                  <p className="text-[10px] text-[#DCE5DF]/60">Everyday (Asia/Dhaka)</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#F4B740] shrink-0 mt-0.5" />
                <div>
                  <span>Dhaka Metropolitan Area</span>
                  <p className="text-[10px] text-[#DCE5DF]/60">Bangladesh Service Hub</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#DCE5DF]/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#DCE5DF]/60">
          <p>&copy; {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
