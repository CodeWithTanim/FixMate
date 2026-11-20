import { Users, Shield, Clock } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "0", icon: Users, desc: "Registered customers & techs" },
    { label: "Total Technicians", value: "0", icon: Shield, desc: "Certified repair partners" },
    { label: "Pending Services", value: "0", icon: Clock, desc: "Awaiting approval" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
        <p className="text-sm text-slate-500">
          Moderate service listings, oversee user roles, and monitor system transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">{s.value}</div>
              <p className="mt-1 text-xs text-slate-400">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900">Pending Service Moderation</h2>
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">No service submissions waiting for review.</p>
          <p className="text-xs text-slate-400 mt-1">New technician services requiring approval will appear here.</p>
        </div>
      </div>
    </div>
  );
}
