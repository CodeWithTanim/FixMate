import Link from "next/link";
import {
  ArrowRight,
  Wrench,
} from "lucide-react";
import { getPublicServices } from "@/lib/api/services";
import ServiceCard from "@/components/ServiceCard";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import HomeSearchCTA from "@/components/HomeSearchCTA";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import HomeCategoriesBento from "@/components/HomeCategoriesBento";
import HomeWhyChooseUs from "@/components/HomeWhyChooseUs";
import HomeTestimonialsMarquee from "@/components/HomeTestimonialsMarquee";
import type { ServiceItem } from "@/types";

export default async function HomePage() {
  // Fetch 6 newest approved services from database
  const { data: featuredServices, error: fetchError } = await getPublicServices({ limit: 6, sort: "newest" });

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section (Full Viewport Auto-Sliding Showcase) */}
      <HomeHeroSlider />

      {/* 2. Search Service CTA */}
      <HomeSearchCTA />

      {/* 3. Featured Service */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#152C2B] sm:text-3xl">
              Latest Featured Services
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#526564]">
              Real approved repair offerings from local certified technicians.
            </p>
          </div>
          <Link
            href="/services"
            className="flex items-center gap-1 text-xs font-bold text-[#18756B] hover:text-[#135d55] group"
          >
            <span>View All Services</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {fetchError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center space-y-2">
            <h3 className="text-sm font-bold text-rose-800">Catalog Service Unavailable</h3>
            <p className="text-xs text-rose-600 max-w-sm mx-auto">
              {fetchError}. Please refresh the page or check back shortly.
            </p>
          </div>
        ) : featuredServices && featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service: ServiceItem) => (
              <ServiceCard key={service.id || service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-10 text-center space-y-3">
            <Wrench className="h-8 w-8 text-[#526564] mx-auto" />
            <h3 className="text-sm font-bold text-[#152C2B]">No Approved Services Listed Yet</h3>
            <p className="text-xs text-[#526564] max-w-sm mx-auto">
              Our technicians are currently submitting their service offerings for review. Browse all categories or join as a technician.
            </p>
          </div>
        )}
      </section>

      {/* 4. How FixMate Works (Curved Arc Split Layout) */}
      <HomeHowItWorks />

      {/* 5. Popular Categories (Bento Grid with 3D Illustrations) */}
      <HomeCategoriesBento />

      {/* 6. Why Choose Us (Floating Tilted Cards with 3D Spheres & Zigzag Path) */}
      <HomeWhyChooseUs />

      {/* 7. Testimonials (3 Sliding Rows with Marquee) */}
      <HomeTestimonialsMarquee />
    </div>
  );
}
