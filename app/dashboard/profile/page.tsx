"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  Shield,
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  phone?: string | null;
  serviceArea?: string | null;
  bio?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await apiClient.get<{ user: UserProfile }>("/api/me");
        if (active) {
          const u = res.user;
          setProfile(u);
          setName(u.name || "");
          setPhone(u.phone || "");
          setServiceArea(u.serviceArea || "");
          setBio(u.bio || "");
          setImage(u.image || "");
        }
      } catch (err: unknown) {
        if (active) {
          const error = err as { message?: string };
          const msg = error.message || "Failed to load profile";
          toast.error(msg);
          setFetchError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image file size must be under 3MB (Vercel payload compatibility)");
      return;
    }

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await apiClient.post<{ url: string }>("/api/upload", { image: base64 });
          setImage(res.url);
          toast.success("Profile photo uploaded successfully");
        } catch {
          toast.error("Image upload failed");
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      toast.error("Profile is not loaded yet");
      return;
    }

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      const res = await apiClient.patch<{ user: UserProfile; message: string }>("/api/users/profile", {
        name: name.trim(),
        phone: phone.trim(),
        serviceArea: serviceArea.trim(),
        bio: bio.trim(),
        image: image.trim() || null,
      });

      setProfile(res.user);

      // Refresh shared Better Auth session user identity and server layout
      try {
        await authClient.updateUser({
          name: name.trim(),
          image: image.trim() || undefined,
        });
      } catch (err: unknown) {
        console.warn("Session user sync notice:", err);
      }

      // Dispatch custom window event so layout and navbar client components update immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("fixmate:profile-updated", { detail: res.user }));
      }

      router.refresh();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to save profile updates");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setPasswordError("New password must contain at least one uppercase letter (A-Z) and one lowercase letter (a-z).");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password cannot be the same as your current password.");
      return;
    }

    const toastId = toast.loading("Updating password...");
    setChangingPassword(true);

    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        const msg = res.error.message || "Failed to update password. Please check your current password.";
        setPasswordError(msg);
        toast.error(msg, { id: toastId });
        setChangingPassword(false);
        return;
      }

      toast.success("Password changed successfully! Other active sessions revoked.", { id: toastId });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (err: unknown) {
      const error = err as { message?: string };
      const msg = error.message || "An unexpected error occurred while changing password.";
      setPasswordError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-64 bg-white rounded-2xl border border-[#DCE5DF] animate-pulse" />
      </div>
    );
  }

  if (fetchError && !profile) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">Failed to Load Profile</h3>
            <p className="text-xs text-rose-800 dark:text-rose-300/80 mt-1">{fetchError}</p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-bold hover:bg-rose-700 transition cursor-pointer"
          >
            Retry Loading Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">Account Profile</h1>
        <p className="text-xs text-[#526564] mt-0.5">
          Manage your contact information, service area, and public profile photo.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Photo & Role Header Card */}
        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="h-24 w-24 rounded-full object-cover border-2 border-[#18756B]"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#18756B] text-white text-3xl font-black">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <label
              htmlFor="photo-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer text-[10px] font-bold"
            >
              {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-[#152C2B]">{profile?.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#18756B]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#18756B] uppercase tracking-wider border border-[#18756B]/20">
                <Shield className="h-3 w-3" />
                <span>{profile?.role} Account</span>
              </span>
            </div>
            <p className="text-xs text-[#526564]">{profile?.email}</p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] px-3 py-1.5 text-xs font-bold text-[#152C2B] hover:bg-[#DCE5DF] transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingImage ? "Uploading..." : "Upload New Photo"}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Profile Details Form Card */}
        <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#152C2B] border-b border-[#DCE5DF] pb-3">
            Contact & Service Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="profile-name" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <User className="h-3.5 w-3.5 text-[#18756B]" />
                <span>Full Name *</span>
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
              />
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label htmlFor="profile-email" className="text-xs font-bold text-[#526564] flex items-center gap-1.5 mb-1">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Email Address (Protected)</span>
              </label>
              <input
                id="profile-email"
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full rounded-xl border border-[#DCE5DF] bg-[#F6F5EF] p-3 text-xs text-[#526564] cursor-not-allowed opacity-80"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label htmlFor="profile-phone" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <Phone className="h-3.5 w-3.5 text-[#18756B]" />
                <span>Phone Number</span>
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678"
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
              />
            </div>

            {/* Service Area */}
            <div>
              <label htmlFor="profile-area" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <MapPin className="h-3.5 w-3.5 text-[#18756B]" />
                <span>City / Operating Area</span>
              </label>
              <input
                id="profile-area"
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="e.g. Downtown Metro & Greater Eastside"
                className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Bio / Description */}
          <div>
            <label htmlFor="profile-bio" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-[#18756B]" />
              <span>Bio / Experience Summary</span>
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your background, specializations, or repair philosophy..."
              className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden min-h-[90px]"
            />
          </div>

          {/* Photo URL fallback */}
          <div>
            <label htmlFor="profile-image-url" className="text-xs font-bold text-[#526564] block mb-1">
              Direct Photo URL (Optional)
            </label>
            <input
              id="profile-image-url"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-[#DCE5DF] p-3 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#18756B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile Updates"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Security & Password Change Card */}
      <div className="rounded-2xl border border-[#DCE5DF] bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#DCE5DF] pb-3">
          <div className="p-2 rounded-xl bg-[#18756B]/10 text-[#18756B]">
            <KeyRound className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#152C2B]">Account Security & Password</h3>
            <p className="text-[11px] text-[#526564]">
              Change your password to protect your account. All other active sessions will be revoked.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label htmlFor="current-password" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <Lock className="h-3.5 w-3.5 text-[#18756B]" />
                <span>Current Password *</span>
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#DCE5DF] p-3 pr-10 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <Lock className="h-3.5 w-3.5 text-[#18756B]" />
                <span>New Password *</span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 chars, A-Z and a-z"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#DCE5DF] p-3 pr-10 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirm-password" className="text-xs font-bold text-[#152C2B] flex items-center gap-1.5 mb-1">
                <Lock className="h-3.5 w-3.5 text-[#18756B]" />
                <span>Confirm New Password *</span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#DCE5DF] p-3 pr-10 text-xs text-[#152C2B] focus:border-[#18756B] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <p className="text-[11px] text-[#526564]">
              Password must be at least 6 characters with uppercase (A-Z) and lowercase (a-z) letters.
            </p>
            <button
              type="submit"
              disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3638] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#135d55] transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
