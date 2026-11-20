"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Wrench, Plus, Eye, EyeOff, Trash2, Edit3, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import type { ServiceItem } from "@/types";

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editArea, setEditArea] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingService, setDeletingService] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      const res = await apiRequest<{ data: ServiceItem[] }>("/api/services-my");
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
  }, [refreshKey]);

  const handleToggleAvailability = async (id: string, current: boolean) => {
    const nextVal = !current;
    const toastId = toast.loading("Updating availability...");
    const res = await apiRequest(`/api/services/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ isAvailable: nextVal }),
    });

    if (res.error) {
      toast.error(res.error, { id: toastId });
      return;
    }

    toast.success(`Service is now ${nextVal ? "available" : "hidden"}`, { id: toastId });
    setServices((prev) =>
      prev.map((s) => (s.id === id || s._id === id ? { ...s, isAvailable: nextVal } : s))
    );
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingService) return;
    const { id } = deletingService;

    setDeleting(true);
    const toastId = toast.loading("Removing service...");
    const res = await apiRequest(`/api/services/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      return;
    }

    toast.success("Service deleted successfully", { id: toastId });
    setServices((prev) => prev.filter((s) => s.id !== id && s._id !== id));
    setDeletingService(null);
  };

  const handleStartEdit = (service: ServiceItem) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditPrice(service.basePrice.toString());
    setEditDuration(service.estimatedDuration);
    setEditArea(service.serviceArea);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const id = editingService.id || editingService._id;
    setSaving(true);
    const toastId = toast.loading("Saving changes & resubmitting for review...");

    const res = await apiRequest(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: editTitle.trim(),
        basePrice: parseFloat(editPrice),
        estimatedDuration: editDuration.trim(),
        serviceArea: editArea.trim(),
      }),
    });

    setSaving(false);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      return;
    }

    toast.success("Service updated! Reset to pending approval.", { id: toastId });
    setEditingService(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#152C2B]">My Service Offerings</h1>
          <p className="text-xs text-[#526564]">
            Manage your repair listings, availability, and review status.
          </p>
        </div>
        <Link
          href="/dashboard/technician/add-service"
          className="flex items-center gap-2 rounded-xl bg-[#18756B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#135d55] transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#18756B]" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center space-y-3">
          <Wrench className="h-8 w-8 text-[#526564] mx-auto" />
          <h3 className="text-sm font-bold text-[#152C2B]">No Services Listed Yet</h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto">
            Create your first repair offering to connect with customers in your area.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#18756B] px-4 py-2 text-xs font-bold text-white hover:bg-[#135d55]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Service Listing</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const id = (service.id || service._id || "") as string;
            const isApproved = service.approvalStatus === "approved";
            const isPending = service.approvalStatus === "pending";

            return (
              <div
                key={id}
                className="flex flex-col justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
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
                    <span className="text-[11px] font-semibold text-[#526564]">
                      {service.serviceMode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#152C2B] line-clamp-1">{service.title}</h3>
                  <p className="text-xs text-[#526564] line-clamp-2">{service.description}</p>

                  <div className="text-xs text-[#526564] space-y-1 pt-2 border-t border-[#DCE5DF]/60">
                    <div className="flex justify-between">
                      <span>Base Rate:</span>
                      <strong className="text-[#152C2B]">${service.basePrice}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Area:</span>
                      <span className="text-[#152C2B]">{service.serviceArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visibility:</span>
                      <span className={service.isAvailable ? "text-emerald-700 font-semibold" : "text-slate-400 font-semibold"}>
                        {service.isAvailable ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#DCE5DF]/60 gap-2">
                  <button
                    onClick={() => handleToggleAvailability(id, service.isAvailable)}
                    className="flex items-center gap-1 rounded-lg border border-[#DCE5DF] bg-[#F6F5EF] px-2.5 py-1.5 text-xs font-semibold text-[#152C2B] hover:bg-[#DCE5DF]"
                    title="Toggle public visibility"
                  >
                    {service.isAvailable ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{service.isAvailable ? "Hide" : "Show"}</span>
                  </button>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleStartEdit(service)}
                      className="rounded-lg border border-[#DCE5DF] p-1.5 text-[#526564] hover:bg-[#F6F5EF]"
                      title="Edit service details"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingService({ id, title: service.title })}
                      className="rounded-lg border border-rose-200 p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete service listing"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#152C2B] mb-1">Edit Service Listing</h2>
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-4">
              Note: Updating content will reset the service status to <strong>pending</strong> for admin moderation.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Base Price ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Duration</label>
                <input
                  type="text"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Coverage Area</label>
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 rounded-xl border border-[#DCE5DF] py-2 font-bold text-[#526564]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#18756B] py-2 font-bold text-white hover:bg-[#135d55]"
                >
                  {saving ? "Saving..." : "Save & Resubmit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#152C2B]">Delete Service Listing?</h3>
                <p className="text-xs text-[#526564]">This action permanently removes the listing.</p>
              </div>
            </div>

            <p className="text-xs text-[#526564] bg-[#F6F5EF] p-3 rounded-xl border border-[#DCE5DF]/60 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#152C2B]">&quot;{deletingService.title}&quot;</strong>? Active customer bookings will retain their snapshots.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                className="rounded-xl border border-[#DCE5DF] px-4 py-2 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
