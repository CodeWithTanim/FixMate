"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag } from "lucide-react";

export default function HomeSearchCTA() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (category) params.set("category", category);
    router.push(`/services?${params.toString()}`);
  };

  const popularSearches = [
    { label: "iPhone Display", category: "Smartphone", q: "display" },
    { label: "AC Gas Refill", category: "AC", q: "gas" },
    { label: "MacBook Motherboard", category: "Laptop & PC", q: "motherboard" },
    { label: "Refrigerator Compressor", category: "Refrigerator", q: "compressor" },
    { label: "Washing Motor", category: "Washing Machine", q: "motor" },
    { label: "TV Panel", category: "TV", q: "panel" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
      <div className="rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl mb-5">
          <span className="inline-flex items-center rounded-full bg-[#18756B]/10 px-3 py-1 text-xs font-bold text-[#18756B] mb-2">
            Quick Service Search
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#152C2B]">
            Find Vetted Repair Technicians Near You
          </h2>
          <p className="text-xs sm:text-sm text-[#526564] mt-1">
            Search transparent base rates for device inspections, component replacements, and home visits.
          </p>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#526564]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="What device or issue needs fixing? (e.g., iPhone screen, AC gas leak)"
              className="w-full rounded-2xl border border-[#DCE5DF] py-3 pl-10 pr-4 text-xs sm:text-sm text-[#152C2B] placeholder:text-[#526564]/60 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-[#DCE5DF] py-3 px-3.5 text-xs sm:text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B] bg-white cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop & PC">Laptop & PC</option>
              <option value="AC">AC</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="TV">TV</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#18756B] py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#135d55] transition cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Popular Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-[#DCE5DF]/60 text-xs">
          <span className="text-[#526564] font-semibold flex items-center gap-1 text-[11px]">
            <Tag className="h-3 w-3" /> Popular Searches:
          </span>
          {popularSearches.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => router.push(`/services?category=${encodeURIComponent(tag.category)}&q=${encodeURIComponent(tag.q)}`)}
              className="rounded-lg bg-[#F6F5EF] px-2.5 py-1 text-[11px] font-semibold text-[#152C2B] hover:bg-[#18756B]/10 hover:text-[#18756B] transition border border-[#DCE5DF]/70 cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
