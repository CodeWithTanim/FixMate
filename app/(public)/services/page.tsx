import Link from "next/link";
import { Wrench, Search, Filter } from "lucide-react";
import { getPublicServices } from "@/lib/api/services";
import ServiceCard from "@/components/ServiceCard";
import type { ServiceCategory, ServiceItem } from "@/types";

export const metadata = {
  title: "Browse Repair Services | FixMate",
  description: "Find certified local technicians for smartphone, PC, AC, and appliance repairs with transparent base rates.",
};

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default async function ServicesPage(props: {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const serviceMode = searchParams?.serviceMode || "";
  const sort = searchParams?.sort || "newest";
  const page = parseInt(searchParams?.page || "1", 10) || 1;

  const { data: services, total, totalPages, error } = await getPublicServices({
    search,
    category,
    serviceMode,
    sort,
    page,
    limit: 9,
  });

  // Helper to build URL with query params
  function buildQueryUrl(overrides: Record<string, string | number | undefined>) {
    const params = new URLSearchParams();
    const merged = { search, category, serviceMode, sort, page: 1, ...overrides };

    if (merged.search) params.set("search", String(merged.search));
    if (merged.category && merged.category !== "All") params.set("category", String(merged.category));
    if (merged.serviceMode && merged.serviceMode !== "All") params.set("serviceMode", String(merged.serviceMode));
    if (merged.sort && merged.sort !== "newest") params.set("sort", String(merged.sort));
    if (merged.page && Number(merged.page) > 1) params.set("page", String(merged.page));

    const qs = params.toString();
    return qs ? `/services?${qs}` : "/services";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18756B]">
          <Wrench className="h-4 w-4" />
          Verified Service Catalog
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#152C2B] sm:text-4xl">
          Browse Repair Services
        </h1>
        <p className="text-xs sm:text-sm text-[#526564]">
          Transparent upfront base prices. Select home visit or shop drop-off, pay securely after completion.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-4 shadow-2xs space-y-4">
        {/* Search Form */}
        <form method="GET" action="/services" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by service title, issue, or keyword..."
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#152C2B] placeholder:text-[#526564]/60 focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
          {category && <input type="hidden" name="category" value={category} />}
          {serviceMode && <input type="hidden" name="serviceMode" value={serviceMode} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <button
            type="submit"
            className="rounded-xl bg-[#18756B] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#135d55] transition cursor-pointer"
          >
            Search
          </button>
          {(search || category || serviceMode || sort !== "newest") && (
            <Link
              href="/services"
              className="flex items-center justify-center rounded-xl border border-[#DCE5DF] bg-slate-50 px-4 py-2.5 text-xs font-semibold text-[#526564] hover:bg-slate-100 transition"
            >
              Reset Filters
            </Link>
          )}
        </form>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DCE5DF]/60 text-xs">
          {/* Mode Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#152C2B] flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-[#18756B]" />
              Mode:
            </span>
            <div className="flex gap-1.5">
              {["All", "Home Visit", "Shop Drop-off"].map((m) => (
                <Link
                  key={m}
                  href={buildQueryUrl({ serviceMode: m === "All" ? undefined : m, page: 1 })}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    (m === "All" && !serviceMode) || serviceMode === m
                      ? "bg-[#0B3638] text-white"
                      : "bg-[#F6F5EF] text-[#526564] hover:bg-[#DCE5DF]"
                  }`}
                >
                  {m}
                </Link>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#152C2B]">Sort by:</span>
            <div className="flex gap-1.5">
              {[
                { label: "Newest", val: "newest" },
                { label: "Price: Low to High", val: "price_asc" },
                { label: "Price: High to Low", val: "price_desc" },
              ].map((s) => (
                <Link
                  key={s.val}
                  href={buildQueryUrl({ sort: s.val, page: 1 })}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    sort === s.val
                      ? "bg-[#18756B] text-white"
                      : "bg-[#F6F5EF] text-[#526564] hover:bg-[#DCE5DF]"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <Link
          href={buildQueryUrl({ category: undefined, page: 1 })}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            !category
              ? "bg-[#18756B] text-white shadow-xs"
              : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
          }`}
        >
          All Categories
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={buildQueryUrl({ category: cat, page: 1 })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              category.toLowerCase() === cat.toLowerCase()
                ? "bg-[#18756B] text-white shadow-xs"
                : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Services Grid or Honest Empty State */}
      {error && services.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center space-y-2">
          <p className="text-sm font-bold text-amber-900">
            FixMate services catalog is temporarily offline.
          </p>
          <p className="text-xs text-amber-700">
            Please check connection and try again shortly.
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F5EF] text-[#526564]">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-[#152C2B]">
            {search || category || serviceMode
              ? "No services matched your filters"
              : "No services currently approved"}
          </h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto">
            {search || category || serviceMode
              ? "Try broadening your search term or clearing one of the applied filters."
              : "Our certified technicians are preparing service listings. Check back soon or join as a technician."}
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="rounded-xl border border-[#DCE5DF] bg-white px-4 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#F6F5EF]"
            >
              Clear All Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: ServiceItem) => (
            <ServiceCard key={service.id || service._id} service={service} />
          ))}
        </div>
      )}

      {/* Pagination & Status Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#DCE5DF] text-xs text-[#526564]">
        <div>
          Showing {services.length} of {total} verified repair services
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Link
              href={buildQueryUrl({ page: Math.max(1, page - 1) })}
              className={`rounded-lg border border-[#DCE5DF] px-3 py-1.5 font-semibold ${
                page <= 1 ? "pointer-events-none opacity-40 bg-slate-100" : "bg-white hover:bg-[#F6F5EF]"
              }`}
            >
              Previous
            </Link>
            <span className="px-2 font-bold text-[#152C2B]">
              Page {page} of {totalPages}
            </span>
            <Link
              href={buildQueryUrl({ page: Math.min(totalPages, page + 1) })}
              className={`rounded-lg border border-[#DCE5DF] px-3 py-1.5 font-semibold ${
                page >= totalPages ? "pointer-events-none opacity-40 bg-slate-100" : "bg-white hover:bg-[#F6F5EF]"
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
