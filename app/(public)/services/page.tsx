import Link from "next/link";
import { Wrench, MapPin, Clock, ArrowRight, Tag } from "lucide-react";
import { getPublicServices } from "@/lib/api/services";
import type { ServiceCategory, ServiceItem } from "@/types";

export const metadata = {
  title: "Browse Repair Services | FixMate",
  description: "Find certified local technicians for smartphone, PC, AC, and appliance repairs.",
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
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const activeCategory = searchParams?.category;

  const { data: services, total, error } = await getPublicServices({ limit: 50 });

  const filteredServices = activeCategory
    ? services.filter((s: ServiceItem) => s.category.toLowerCase() === activeCategory.toLowerCase())
    : services;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-600">
          <Wrench className="h-4 w-4" />
          Certified Local Technicians
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Browse Repair Services
        </h1>
        <p className="text-sm text-slate-600">
          Transparent base pricing and trusted service modes for home visits and shop drop-offs.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <Link
          href="/services"
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            !activeCategory
              ? "bg-sky-600 text-white"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Categories
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/services?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              activeCategory === cat
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Services Grid or Honest Empty State */}
      {error && filteredServices.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-sm font-semibold text-amber-800">
            FixMate API services are temporarily offline or initializing.
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Please make sure the backend server is running and try again shortly.
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Wrench className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">
            {activeCategory ? `No ${activeCategory} services found` : "No services listed yet"}
          </h3>
          <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
            {activeCategory
              ? `There are currently no approved services in the ${activeCategory} category. Try choosing another category.`
              : "Our technicians are currently preparing their certified listings. Please check back soon or join as a technician."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {activeCategory && (
              <Link
                href="/services"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Category Filter
              </Link>
            )}
            <Link
              href="/sign-up"
              className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
            >
              Become a Technician
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: ServiceItem) => (
            <div
              key={service.id || service._id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-sky-500 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 font-semibold text-sky-700">
                    <Tag className="h-3 w-3" />
                    {service.category}
                  </span>
                  <span className="font-semibold text-slate-500">{service.serviceMode}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{service.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{service.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{service.serviceArea}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Base Price</span>
                  <div className="text-lg font-extrabold text-slate-900">${service.basePrice}</div>
                </div>
                <Link
                  href={`/sign-in?callbackUrl=/services`}
                  className="flex items-center gap-1 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition"
                >
                  <span>Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total count footer */}
      <div className="text-right text-xs text-slate-400">
        Showing {filteredServices.length} of {total} verified repair services
      </div>
    </div>
  );
}
