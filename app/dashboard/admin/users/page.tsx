"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShieldAlert,
  Wrench,
  User,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import toast from "react-hot-toast";

interface PlatformUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  image?: string | null;
  phone?: string | null;
  serviceArea?: string | null;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, meRes] = await Promise.all([
        apiClient.get<{ data: PlatformUser[] }>("/api/admin/users"),
        apiClient.get<{ user: { email: string } }>("/api/me"),
      ]);
      setUsers(usersRes.data || []);
      setCurrentUserEmail(meRes.user.email);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to load platform users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      await apiClient.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role successfully updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => ((u.id || u._id) === userId ? { ...u, role: newRole as PlatformUser["role"] } : u))
      );
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.serviceArea && u.serviceArea.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />;
      case "technician":
        return <Wrench className="h-3.5 w-3.5 text-[#18756B]" />;
      default:
        return <User className="h-3.5 w-3.5 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-[#152C2B] tracking-tight">User Management</h1>
        <p className="text-xs text-[#526564] mt-0.5">
          View all registered platform accounts and manage role assignments with self-demotion guards.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#DCE5DF] pb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#526564]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or area..."
            className="w-full rounded-xl border border-[#DCE5DF] bg-white pl-10 pr-4 py-2.5 text-xs text-[#152C2B] placeholder:text-[#526564]/60 focus:border-[#18756B] focus:outline-hidden"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "All Users", value: "all" },
            { label: "Customers", value: "customer" },
            { label: "Technicians", value: "technician" },
            { label: "Admins", value: "admin" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                roleFilter === tab.value
                  ? "bg-[#0B3638] text-white shadow-xs"
                  : "bg-white text-[#526564] border border-[#DCE5DF] hover:bg-[#F6F5EF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white border border-[#DCE5DF] animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE5DF] bg-white p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-[#526564]/40 mb-3" />
          <h3 className="text-base font-bold text-[#152C2B]">No users found</h3>
          <p className="text-xs text-[#526564] mt-1">Try refining your search or filter selection.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DCE5DF] bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DCE5DF] bg-[#F6F5EF] text-[#526564] font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact & Area</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4 text-right">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5DF]">
                {filteredUsers.map((u) => {
                  const userId = u.id || u._id || "";
                  const isSelf = u.email === currentUserEmail;

                  return (
                    <tr key={userId} className="hover:bg-[#F6F5EF]/40 transition">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.image}
                              alt={u.name}
                              className="h-8 w-8 rounded-full object-cover border border-[#DCE5DF]"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18756B] text-white font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[#152C2B] flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[#526564] text-[11px]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="space-y-0.5">
                          {u.phone ? (
                            <div className="flex items-center gap-1 text-[11px]">
                              <Phone className="h-3 w-3 text-[#18756B]" />
                              <span>{u.phone}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No phone</span>
                          )}
                          {u.serviceArea && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <MapPin className="h-3 w-3 text-[#18756B]" />
                              <span>{u.serviceArea}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-[#526564]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3 text-[#526564]/60" />
                          <span>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Active"}
                          </span>
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                            u.role === "admin"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : u.role === "technician"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-sky-50 text-sky-700 border-sky-200"
                          }`}
                        >
                          {getRoleIcon(u.role)}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3.5 px-4 text-right">
                        {isSelf ? (
                          <span
                            className="text-[11px] text-[#526564] italic"
                            title="Admins cannot modify their own role"
                          >
                            Protected
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={updatingId === userId}
                            onChange={(e) => handleRoleChange(userId, e.target.value)}
                            className="rounded-lg border border-[#DCE5DF] bg-white px-2.5 py-1 text-xs font-semibold text-[#152C2B] focus:border-[#18756B] focus:outline-hidden cursor-pointer disabled:opacity-50"
                          >
                            <option value="customer">Customer</option>
                            <option value="technician">Technician</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
