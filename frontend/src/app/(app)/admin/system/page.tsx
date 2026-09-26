"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Lock, Unlock, Server, Cpu, HardDrive, Eye, Fingerprint, Clock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SystemStatus {
  is_locked_down: boolean;
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
}

interface AuditLog {
  id: number;
  user_id: string | null;
  action: string;
  resource: string;
  metadata: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export default function SuperAdminPanel() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/system/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (err) {
        console.error("Failed to fetch system status", err);
      }
    };

    const fetchLogs = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch("http://localhost:8000/api/v1/audit/logs?limit=50", {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    // Initial fetch
    fetchStatus();
    fetchLogs();

    // Live polling every 2 seconds
    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 2000);

    return () => clearInterval(interval);
  }, [session?.access_token]);

  const toggleLockdown = async () => {
    if (!status || !session?.access_token) return;
    const newStatus = !status.is_locked_down;
    setStatus({ ...status, is_locked_down: newStatus });
    setLoading(true);

    try {
      await fetch("http://localhost:8000/api/v1/system/lockdown", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ locked: newStatus }),
      });
    } catch (err) {
      console.error(err);
      setStatus({ ...status, is_locked_down: !newStatus });
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (val: number) => {
    if (val < 50) return "text-green-400 bg-green-400/20";
    if (val < 80) return "text-yellow-400 bg-yellow-400/20";
    return "text-red-400 bg-red-400/20";
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-[#030303] min-h-screen text-white relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3">
          <Shield className="w-9 h-9 text-purple-500" />
          Command Center
        </h1>
        <p className="text-white/50 font-medium">
          Real-time observability, health metrics, and global controls.
        </p>
      </div>

      <div className="relative z-10 grid gap-6 lg:grid-cols-3">
        {/* Left Column: Health & Danger Zone */}
        <div className="space-y-6 lg:col-span-1">
          {/* System Health */}
          <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">System Health</h2>
            </div>
            
            <div className="space-y-5">
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 text-sm text-white/60 font-medium">
                    <Cpu className="w-4 h-4" /> CPU
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getMetricColor(status?.cpu_percent || 0)}`}>
                    {status?.cpu_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${status?.cpu_percent || 0}%` }}
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 text-sm text-white/60 font-medium">
                    <Server className="w-4 h-4" /> Memory
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getMetricColor(status?.memory_percent || 0)}`}>
                    {status?.memory_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${status?.memory_percent || 0}%` }}
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 text-sm text-white/60 font-medium">
                    <HardDrive className="w-4 h-4" /> Disk
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getMetricColor(status?.disk_percent || 0)}`}>
                    {status?.disk_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                    style={{ width: `${status?.disk_percent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 border border-red-500/20 bg-red-950/10 backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-red-400 tracking-tight">Danger Zone</h2>
            </div>
            <div className="relative">
              <h3 className="text-white font-bold mb-2 text-sm">Global Kill Switch</h3>
              <p className="text-xs text-red-200/60 leading-relaxed mb-6">
                Instantly lock down the platform. All user sessions are terminated. Only Super Admins can bypass this lock.
              </p>
              <button
                onClick={toggleLockdown}
                disabled={loading}
                className={`px-5 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 w-full uppercase tracking-wider text-xs
                  ${
                    status?.is_locked_down
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30 shadow-[0_0_20px_rgba(74,222,128,0.15)]"
                      : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                  }`}
              >
                {status?.is_locked_down ? (
                  <>
                    <Unlock className="w-4 h-4" /> Lift Lockdown
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Initiate Lockdown
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="lg:col-span-2 flex flex-col h-[600px]">
          <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping absolute" />
                  <Eye className="w-5 h-5 text-purple-400 relative z-10" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Live Activity Feed</h2>
                  <p className="text-xs text-white/40">Monitoring all incoming requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/30 text-sm">
                  Waiting for activity...
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex gap-4 animate-slide-in-right">
                    <div className="pt-1">
                      {log.user_id ? (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center border border-gray-500/30">
                          <Fingerprint className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm text-purple-300 truncate">
                          {log.resource}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40 uppercase font-bold tracking-wider">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at.replace(" ", "T") + "Z").toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {log.action}
                        </span>
                        <span className="text-xs text-white/30 truncate">
                          {log.ip_address}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
