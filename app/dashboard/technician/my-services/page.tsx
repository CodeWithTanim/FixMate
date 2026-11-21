"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Wrench,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Loader2,
  Upload,
  Tag,
  AlertCircle,
  MapPin,
  Clock,
  Clock3,
  DollarSign,
  CheckCircle2,
  XCircle,
  Crown,
} from "lucide-react";
import { apiRequest, apiClient } from "@/lib/api/client";
import type { ServiceItem, ServiceCategory, ServiceMode } from "@/types";

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  // Edit modal state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<ServiceCategory>("Smartphone");
  const [editMode, setEditMode] = useState<ServiceMode>("Home Visit");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete modal state
  const [deletingService, setDeletingService] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      setLoading(true);
      setErrorMsg(null);
      const res = await apiRequest<{ data: ServiceItem[] }>("/api/services-my");
      if (active) {
        setLoading(false);
        if (res.error) {
          setErrorMsg(res.error);
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
    setEditCategory((service.category as ServiceCategory) || "Smartphone");
    setEditMode((service.serviceMode as ServiceMode) || "Home Visit");
    setEditPrice(service.basePrice.toString());
    setEditDuration(service.estimatedDuration);
    setEditArea(service.serviceArea);
    setEditDescription(service.description);
    setEditImage(service.image || "");
    setFormError("");
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file size must be under 3MB.");
      return;
    }

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await apiClient.post<{ url: string }>("/api/upload", { image: base64 });
          setEditImage(res.url);
          toast.success("Replacement image uploaded successfully!");
        } catch (err: unknown) {
          const error = err as { message?: string };
          toast.error(error.message || "Image upload failed");
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
      toast.error("Failed to read image file");
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setFormError("");

    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0.5) {
      setFormError("Base price must be a valid amount of at least $0.50 USD.");
      return;
    }

    if (editTitle.trim().length < 5 || editTitle.trim().length > 120) {
      setFormError("Title must be between 5 and 120 characters.");
      return;
    }

    if (editDescription.trim().length < 20 || editDescription.trim().length > 2000) {
      setFormError("Description must be between 20 and 2000 characters.");
      return;
    }

    if (!editArea.trim() || !editDuration.trim()) {
      setFormError("Please fill in duration and coverage area.");
      return;
    }

    const id = (editingService.id || editingService._id) as string;
    setSaving(true);
    const toastId = toast.loading("Saving changes & resubmitting for review...");

    const res = await apiRequest(`/api/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: editTitle.trim(),
        category: editCategory,
        serviceMode: editMode,
        basePrice: price,
        estimatedDuration: editDuration.trim(),
        serviceArea: editArea.trim(),
        description: editDescription.trim(),
        image: editImage || editingService.image,
      }),
    });

    setSaving(false);

    if (res.error) {
      setFormError(res.error);
      toast.error(res.error, { id: toastId });
      return;
    }

    toast.success("Service updated! Reset to pending approval.", { id: toastId });
    setEditingService(null);
    setRefreshKey((k) => k + 1);
  };

  const totalCount = services.length;
  const approvedCount = services.filter((s) => s.approvalStatus === "approved").length;
  const pendingCount = services.filter((s) => s.approvalStatus === "pending").length;
  const rejectedCount = services.filter(
    (s) => s.approvalStatus === "rejected" || (s.approvalStatus as string) === "cancelled"
  ).length;

  const filteredServices = services.filter((s) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "approved") return s.approvalStatus === "approved";
    if (statusFilter === "pending") return s.approvalStatus === "pending";
    if (statusFilter === "rejected") {
      return s.approvalStatus === "rejected" || (s.approvalStatus as string) === "cancelled";
    }
    return true;
  });

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

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-left rounded-2xl p-4 border transition cursor-pointer ${
            statusFilter === "all"
              ? "bg-[#0B3638] text-white border-[#0B3638] shadow-xs"
              : "bg-white text-[#152C2B] border-[#DCE5DF] hover:border-[#18756B]/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${statusFilter === "all" ? "text-emerald-200" : "text-[#526564]"}`}>
              All Services
            </span>
            <Wrench className={`h-4 w-4 ${statusFilter === "all" ? "text-emerald-300" : "text-[#526564]"}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{totalCount}</div>
          <p className={`text-[11px] mt-0.5 ${statusFilter === "all" ? "text-white/70" : "text-[#526564]"}`}>
            Total listings created
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("approved")}
          className={`text-left rounded-2xl p-4 border transition cursor-pointer ${
            statusFilter === "approved"
              ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
              : "bg-white text-[#152C2B] border-[#DCE5DF] hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${statusFilter === "approved" ? "text-emerald-200" : "text-[#526564]"}`}>
              Approved & Live
            </span>
            <CheckCircle2 className={`h-4 w-4 ${statusFilter === "approved" ? "text-emerald-300" : "text-emerald-600"}`} />
          </div>
          <div className={`mt-2 text-2xl font-black ${statusFilter === "approved" ? "text-white" : "text-emerald-700"}`}>
            {approvedCount}
          </div>
          <p className={`text-[11px] mt-0.5 ${statusFilter === "approved" ? "text-white/70" : "text-[#526564]"}`}>
            Published on catalog
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("pending")}
          className={`text-left rounded-2xl p-4 border transition cursor-pointer ${
            statusFilter === "pending"
              ? "bg-amber-700 text-white border-amber-700 shadow-xs"
              : "bg-white text-[#152C2B] border-[#DCE5DF] hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${statusFilter === "pending" ? "text-amber-200" : "text-[#526564]"}`}>
              Pending Review
            </span>
            <Clock3 className={`h-4 w-4 ${statusFilter === "pending" ? "text-amber-300" : "text-amber-600"}`} />
          </div>
          <div className={`mt-2 text-2xl font-black ${statusFilter === "pending" ? "text-white" : "text-amber-700"}`}>
            {pendingCount}
          </div>
          <p className={`text-[11px] mt-0.5 ${statusFilter === "pending" ? "text-white/70" : "text-[#526564]"}`}>
            Under admin verification
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("rejected")}
          className={`text-left rounded-2xl p-4 border transition cursor-pointer ${
            statusFilter === "rejected"
              ? "bg-rose-800 text-white border-rose-800 shadow-xs"
              : "bg-white text-[#152C2B] border-[#DCE5DF] hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${statusFilter === "rejected" ? "text-rose-200" : "text-[#526564]"}`}>
              Cancelled / Rejected
            </span>
            <XCircle className={`h-4 w-4 ${statusFilter === "rejected" ? "text-rose-300" : "text-rose-600"}`} />
          </div>
          <div className={`mt-2 text-2xl font-black ${statusFilter === "rejected" ? "text-white" : "text-rose-700"}`}>
            {rejectedCount}
          </div>
          <p className={`text-[11px] mt-0.5 ${statusFilter === "rejected" ? "text-white/70" : "text-[#526564]"}`}>
            Needs update or re-listed
          </p>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#DCE5DF] pb-3">
        {[
          { label: "All Services", value: "all" as const, count: totalCount },
          { label: "Approved & Live", value: "approved" as const, count: approvedCount, badgeColor: "bg-emerald-100 text-emerald-800" },
          { label: "Pending Review", value: "pending" as const, count: pendingCount, badgeColor: "bg-amber-100 text-amber-800" },
          { label: "Cancelled / Rejected", value: "rejected" as const, count: rejectedCount, badgeColor: "bg-rose-100 text-rose-800" },
        ].map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-[#0B3638] text-white shadow-xs"
                  : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isActive ? "bg-white/20 text-white" : tab.badgeColor || "bg-[#F6F5EF] text-[#526564]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#18756B]" />
        </div>
      ) : errorMsg ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-600 mx-auto" />
          <h3 className="text-sm font-bold text-rose-900">Failed to load service offerings</h3>
          <p className="text-xs text-rose-700 max-w-sm mx-auto">{errorMsg}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition"
          >
            Retry
          </button>
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
      ) : filteredServices.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center space-y-3">
          <Wrench className="h-8 w-8 text-[#526564] mx-auto" />
          <h3 className="text-sm font-bold text-[#152C2B]">
            {statusFilter === "approved"
              ? "No Approved Services Found"
              : statusFilter === "pending"
              ? "No Pending Services"
              : "No Cancelled or Rejected Services"}
          </h3>
          <p className="text-xs text-[#526564] max-w-sm mx-auto">
            {statusFilter === "approved"
              ? "You do not have any live approved services in this tab right now."
              : statusFilter === "pending"
              ? "All your listings have been reviewed by our admin team!"
              : "None of your service listings have been rejected or cancelled."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setStatusFilter("all")}
              className="rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-4 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] cursor-pointer"
            >
              View All Services
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const id = (service.id || service._id || "") as string;
            const isApproved = service.approvalStatus === "approved";
            const isPending = service.approvalStatus === "pending";

            return (
              <div
                key={id}
                className="flex flex-col justify-between rounded-2xl border border-[#DCE5DF] bg-white p-5 shadow-2xs space-y-4"
              >
                <div className="space-y-3">
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#F6F5EF] border border-[#DCE5DF]">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#526564]">
                        <Wrench className="h-8 w-8 text-[#526564]/40" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isPending
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : isPending ? (
                          <Clock3 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>
                          {isApproved
                            ? "Approved & Live"
                            : isPending
                            ? "Pending Review"
                            : "Cancelled / Rejected"}
                        </span>
                      </span>

                      {service.isProTechnician && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-2xs">
                          <Crown className="h-2.5 w-2.5 fill-white" />
                          <span>PRO</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-[#526564]">
                      {service.serviceMode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#152C2B] line-clamp-1">{service.title}</h3>
                  <p className="text-xs text-[#526564] line-clamp-2">{service.description}</p>

                  <div className="text-xs text-[#526564] space-y-1.5 pt-2 border-t border-[#DCE5DF]/60">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Category:</span>
                      <strong className="text-[#152C2B]">{service.category}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Base Rate:</span>
                      <strong className="text-[#18756B]">${service.basePrice.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Duration:</span>
                      <span className="text-[#152C2B]">{service.estimatedDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Area:</span>
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
                    className="flex items-center gap-1 rounded-lg border border-[#DCE5DF] bg-[#F6F5EF] px-2.5 py-1.5 text-xs font-semibold text-[#152C2B] hover:bg-[#DCE5DF] cursor-pointer"
                    title="Toggle public visibility"
                  >
                    {service.isAvailable ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{service.isAvailable ? "Hide" : "Show"}</span>
                  </button>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleStartEdit(service)}
                      className="rounded-lg border border-[#DCE5DF] p-1.5 text-[#526564] hover:bg-[#F6F5EF] cursor-pointer"
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

      {/* Edit Modal - Full CRUD Form */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#DCE5DF] bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#152C2B] mb-1">Edit Service Listing</h2>
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-4">
              Note: Updating content will reset the service status to <strong>pending</strong> for admin moderation.
            </p>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                  placeholder="e.g. Master iPhone Display & Battery Replacement"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#152C2B] mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ServiceCategory)}
                    className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] bg-white focus:border-[#18756B] focus:outline-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#152C2B] mb-1">Service Mode</label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value as ServiceMode)}
                    className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] bg-white focus:border-[#18756B] focus:outline-hidden"
                  >
                    {MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#152C2B] mb-1">Base Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.50"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#152C2B] mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                    placeholder="e.g. 1 - 2 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Coverage Area</label>
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                  placeholder="e.g. Dhanmondi, Dhaka"
                />
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#DCE5DF] p-2.5 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                  placeholder="Detailed breakdown of diagnostics, equipment used, and service terms (at least 20 characters)..."
                />
              </div>

              <div>
                <label className="block font-bold text-[#152C2B] mb-1">Service Image</label>
                <div className="flex items-center gap-3">
                  {editImage ? (
                    <img
                      src={editImage}
                      alt="Service preview"
                      className="h-14 w-20 rounded-xl object-cover border border-[#DCE5DF]"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-xl bg-[#F6F5EF] border border-[#DCE5DF] flex items-center justify-center text-[#526564]">
                      <Wrench className="h-5 w-5 text-[#526564]/40" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-3 py-2 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Replace Photo"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 rounded-xl border border-[#DCE5DF] py-2.5 font-bold text-[#526564] hover:bg-[#F6F5EF] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex-1 rounded-xl bg-[#18756B] py-2.5 font-bold text-white hover:bg-[#135d55] disabled:opacity-50 transition shadow-xs cursor-pointer"
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
