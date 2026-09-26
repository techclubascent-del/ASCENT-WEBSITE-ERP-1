"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";

// The brand purple
const COLORS = ["#9b51e0", "#b77ced", "#d2a8f9", "#eed4ff"];

interface AppData {
  name: string;
  applications: number;
}

interface OppData {
  name: string;
  value: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOpportunities: 0,
    pendingApplications: 0,
    completedEvents: 0,
  });

  const [appsData, setAppsData] = useState<AppData[]>([]);
  const [oppsData, setOppsData] = useState<OppData[]>([]);

  useEffect(() => {
    // MOCK DATA for now to ensure beautiful rendering, 
    // ideally replaced by `fetch("/api/v1/applications/stats")` etc.
    setStats({
      totalUsers: 142,
      activeOpportunities: 24,
      pendingApplications: 89,
      completedEvents: 12,
    });

    setAppsData([
      { name: "Mon", applications: 12 },
      { name: "Tue", applications: 19 },
      { name: "Wed", applications: 15 },
      { name: "Thu", applications: 22 },
      { name: "Fri", applications: 30 },
      { name: "Sat", applications: 10 },
      { name: "Sun", applications: 8 },
    ]);

    setOppsData([
      { name: "Hackathons", value: 10 },
      { name: "Internships", value: 8 },
      { name: "Workshops", value: 6 },
    ]);
  }, []);

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-black min-h-screen text-white">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Admin Dashboard
        </h1>
        <p className="text-white/60">
          Platform analytics and opportunity insights.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-5 h-5 text-[#9b51e0]" />}
        />
        <KpiCard
          title="Active Opportunities"
          value={stats.activeOpportunities}
          icon={<Briefcase className="w-5 h-5 text-[#9b51e0]" />}
        />
        <KpiCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={<FileText className="w-5 h-5 text-[#9b51e0]" />}
        />
        <KpiCard
          title="Completed Events"
          value={stats.completedEvents}
          icon={<CheckCircle className="w-5 h-5 text-[#9b51e0]" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="p-6 border border-white/10 bg-[#0a0a0a] rounded-2xl lg:col-span-4 shadow-xl shadow-purple-900/5">
          <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Applications Over Time</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                <YAxis stroke="#666" axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#000", borderColor: "#333", color: "#fff", borderRadius: "8px" }}
                  itemStyle={{ color: "#9b51e0" }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#9b51e0"
                  strokeWidth={4}
                  dot={{ fill: "#000", stroke: "#9b51e0", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, fill: "#b77ced", stroke: "#000" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 border border-white/10 bg-[#0a0a0a] rounded-2xl lg:col-span-3 shadow-xl shadow-purple-900/5 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-white tracking-tight">Opportunities by Type</h2>
          <div className="h-[250px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oppsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {oppsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#000", borderColor: "#333", color: "#fff", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {oppsData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-sm px-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(155,81,224,0.6)]" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-white/70 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="p-6 border border-white/10 bg-[#0a0a0a] rounded-2xl flex items-center justify-between hover:border-[#9b51e0]/50 hover:bg-[#111] transition-all duration-300 cursor-default shadow-lg hover:shadow-[0_0_20px_rgba(155,81,224,0.15)] group">
      <div>
        <p className="text-sm font-semibold text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-extrabold mt-3 text-white tracking-tight">{value}</p>
      </div>
      <div className="p-4 bg-[#9b51e0]/10 rounded-2xl group-hover:scale-110 group-hover:bg-[#9b51e0]/20 transition-all duration-300">
        {icon}
      </div>
    </div>
  );
}

