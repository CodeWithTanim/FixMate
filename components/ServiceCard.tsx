import Link from "next/link";
import { Wrench, MapPin, Clock, ArrowRight, Tag, UserCheck, Crown } from "lucide-react";
import type { ServiceItem } from "@/types";

export default function ServiceCard({ service }: { service: ServiceItem }) {
  const serviceId = service.id || service._id;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs hover:border-[#18756B] hover:shadow-md transition">
      <div className="space-y-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]/60">
          {service.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#18756B]/10 text-[#18756B]">
              <Wrench className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#18756B]/10 px-2.5 py-0.5 font-bold text-[#18756B]">
            <Tag className="h-3 w-3" />
            {service.category}
          </span>
          <span className="text-[11px] font-semibold text-[#526564]">{service.serviceMode}</span>
        </div>

        <h3 className="text-base font-bold text-[#152C2B] line-clamp-1">{service.title}</h3>

        <div className="flex items-center gap-1.5 text-xs text-[#526564]">
          <UserCheck className="h-3.5 w-3.5 text-[#18756B] shrink-0" />
          <span className="font-semibold text-[#152C2B] truncate">
            {service.technicianName || "Certified Technician"}
          </span>
          {service.isProTechnician && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-1.5 py-0.2 text-[8px] font-black text-white shadow-2xs">
              <Crown className="h-2 w-2 fill-white" />
              <span>PRO</span>
            </span>
          )}
        </div>

        <p className="text-xs text-[#526564] line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#526564] border-t border-[#DCE5DF]/60">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#526564]" />
            <span>{service.estimatedDuration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-[#526564]" />
            <span>{service.serviceArea}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#DCE5DF]/60">
        <div>
          <span className="text-[10px] text-[#526564] uppercase font-semibold">From</span>
          <div className="text-lg font-extrabold text-[#152C2B]">${service.basePrice}</div>
        </div>
        <Link
          href={`/services/${serviceId}`}
          className="flex items-center gap-1.5 rounded-xl bg-[#18756B] px-4 py-2 text-xs font-bold text-white hover:bg-[#135d55] transition"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
