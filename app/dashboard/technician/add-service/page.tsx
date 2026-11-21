"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Wrench, Tag, DollarSign, Clock, MapPin, FileText, Loader2, ArrowLeft, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { apiRequest, apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import type { ServiceCategory, ServiceMode, UserProfile } from "@/types";

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

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user as unknown as UserProfile | undefined;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Smartphone");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("Home Visit");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("1 - 2 hours");
  const [serviceArea, setServiceArea] = useState(user?.area || "Central District");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file size must be under 3MB (Vercel payload compatibility)");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadNotice(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await apiClient.post<{ url: string }>("/api/upload", { image: base64 });
          setImage(res.url);
          toast.success("Service image uploaded successfully!");
        } catch (err: unknown) {
          const error = err as { message?: string };
          const msg = error.message || "Image upload failed";
          setUploadNotice(msg);
          toast.error(msg);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const price = parseFloat(basePrice);
    if (isNaN(price) || price <= 0) {
      setErrorMsg("Please enter a valid positive base price.");
      return;
    }

    if (!title.trim() || !description.trim() || !serviceArea.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!image) {
      setErrorMsg("Please upload a genuine photo for this service listing from your device.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting new service listing...");

    const res = await apiRequest("/api/services", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        category,
        serviceMode,
        basePrice: price,
        estimatedDuration: estimatedDuration.trim(),
        serviceArea: serviceArea.trim(),
        description: description.trim(),
        image: image.trim(),
      }),
    });

    setLoading(false);

    if (res.error) {
      toast.error(res.error, { id: toastId });
      setErrorMsg(res.error);
      return;
    }

    toast.success("Service submitted for admin review!", { id: toastId });
    router.push("/dashboard/technician/my-services");
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/technician/my-services"
          className="rounded-xl border border-[#DCE5DF] bg-white p-2 text-[#526564] hover:bg-[#F6F5EF]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#152C2B]">Add New Repair Service</h1>
          <p className="text-xs text-[#526564]">
            Your listing will default to pending status until approved by an administrator.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-[#DCE5DF] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="title">
            Service Title
          </label>
          <div className="relative">
            <Wrench className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. iPhone Screen & Battery Replacement"
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        {/* Category & Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="category">
              Repair Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] bg-white focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="mode">
              Service Delivery Mode
            </label>
            <select
              id="mode"
              value={serviceMode}
              onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 px-3 text-sm text-[#152C2B] bg-white focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="price">
              Base Inspection Rate ($ USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
              <input
                id="price"
                type="number"
                step="0.01"
                min="1"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="45.00"
                className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="duration">
              Estimated Duration
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
              <input
                id="duration"
                type="text"
                required
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g. 1 - 2 hours"
                className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
              />
            </div>
          </div>
        </div>

        {/* Service Area */}
        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="area">
            Service Coverage Area
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
            <input
              id="area"
              type="text"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Downtown, Uptown, South Bay"
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        {/* Image File Upload & Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#152C2B]" htmlFor="image-file">
            Service Listing Photo
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <label
                htmlFor="image-file"
                className="flex items-center justify-center gap-2 w-full cursor-pointer rounded-xl border border-dashed border-[#18756B]/40 bg-[#18756B]/5 px-4 py-3 text-xs font-semibold text-[#18756B] hover:bg-[#18756B]/10 transition"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#18756B]" />
                    <span>Uploading image to ImgBB...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Choose photo from device (JPEG, PNG, WebP up to 3MB)</span>
                  </>
                )}
              </label>
              <input
                id="image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingImage}
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>

            {image && (
              <div className="flex items-center gap-2">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-[#DCE5DF] bg-[#F6F5EF] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Service preview" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Photo Ready</span>
                </div>
              </div>
            )}
          </div>

          {uploadNotice && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>{uploadNotice}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-[#152C2B] mb-1.5" htmlFor="description">
            Detailed Service Description & Scope
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-[#526564]" />
            <textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what is checked, diagnostic procedures, parts policies, and warranty scopes..."
              className="w-full rounded-xl border border-[#DCE5DF] py-2.5 pl-10 pr-3 text-sm text-[#152C2B] focus:border-[#18756B] focus:outline-none focus:ring-1 focus:ring-[#18756B]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            href="/dashboard/technician/my-services"
            className="rounded-xl border border-[#DCE5DF] px-5 py-2.5 text-xs font-bold text-[#526564] hover:bg-[#F6F5EF]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-[#18756B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit for Moderation</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
