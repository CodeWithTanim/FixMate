"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Clock, Loader2, ShieldCheck, Tag } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import type { ServiceItem } from "@/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      setLoading(true);
      const query = filter !== "all" ? `?status=${filter}` : "";
      const res = await apiRequest<{ data: ServiceItem[] }>(`/api/admin/services${query}`);
      if (active) {
        setLoading(false);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        setServices(res.data?.data || []);
      }
    };

    loadServices();
    return () => {
      active = false;
    };
  }, [filter]);

  const handleUpdateApproval = async (id: string, status: "approved" | "rejected") => {
    if (updatingId) return;
    setUpdatingId(id);
    const toastId = toast.loading(`Updating service to ${status}...`);
    const res = await apiRequest(`/api/admin/services/${id}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ approvalStatus: status }),
    });
    setUpdatingId(null);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      return;
    }

    toast.success(`Service marked as ${status}`, { id: toastId });
    if (filter !== "all") {
      setServices((prev) => prev.filter((s) => s.id !== id && s._id !== id));
    } else {
      setServices((prev) =>
        prev.map((s) => (s.id === id || s._id === id ? { ...s, approvalStatus: status } : s))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#18756B]">
            <ShieldCheck className="h-4 w-4" />
            Moderation Workspace
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#152C2B]">Service Moderation Queue</h1>
          <p className="text-xs text-[#526564]">
            Approve or reject repair listings submitted by technicians before they appear publicly.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 rounded-xl border border-[#DCE5DF] bg-white p-1 text-xs font-semibold">
          {(["pending", "all", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 capitalize transition cursor-pointer ${
                filter === tab ? "bg-[#0B3638] text-white" : "text-[#526564] hover:bg-[#F6F5EF]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#18756B]" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center space-y-2">
          <Clock className="h-8 w-8 text-[#526564] mx-auto" />
          <h3 className="text-sm font-bold text-[#152C2B]">No {filter} services found</h3>
          <p className="text-xs text-[#526564]">
            {filter === "pending"
              ? "All submitted services have been reviewed! New submissions will appear here."
              : "Try switching to another filter status tab above."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => {
            const id = (service.id || service._id || "") as string;
            const isApproved = service.approvalStatus === "approved";
            const isPending = service.approvalStatus === "pending";

            return (
              <div
                key={id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#18756B]/10 px-2.5 py-0.5 font-bold text-[#18756B]">
                      <Tag className="h-3 w-3" />
                      {service.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isPending
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {service.approvalStatus}
                    </span>
                    <span className="text-[11px] text-[#526564]">Mode: {service.serviceMode}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#152C2B]">{service.title}</h3>
                  <p className="text-xs text-[#526564] line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-[#526564] pt-1">
                    <span>
                      Technician: <strong className="text-[#152C2B]">{service.technicianName}</strong> ({service.technicianEmail})
                    </span>
                    <span>
                      Base Price: <strong className="text-[#152C2B]">${service.basePrice}</strong>
                    </span>
                    <span>Area: {service.serviceArea}</span>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => handleUpdateApproval(id, "approved")}
                    disabled={isApproved || updatingId === id}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{updatingId === id ? "Updating..." : "Approve"}</span>
                  </button>
                  <button
                    onClick={() => handleUpdateApproval(id, "rejected")}
                    disabled={service.approvalStatus === "rejected" || updatingId === id}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-40 transition cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>{updatingId === id ? "Updating..." : "Reject"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
