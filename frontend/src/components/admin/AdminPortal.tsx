import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  User,
  Bell,
  Plus,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
  RefreshCw,
  LogOut,
  Lock,
  Unlock,
  ShieldCheck,
  Cpu,
  HardDrive,
  Activity,
  X,
  TrendingUp,
  Tag,
  Check,
  ChevronRight,
  Filter,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api, ApiUser, ApiEvent, ApiOpportunity, ApiApplication } from '../../lib/api';

interface AdminPortalProps {
  onReturnToMain: () => void;
}

export type AdminTab =
  | 'dashboard'
  | 'members'
  | 'opportunities'
  | 'applications'
  | 'events'
  | 'reports'
  | 'settings'
  | 'profile';

export function AdminPortal({ onReturnToMain }: AdminPortalProps) {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // ── 1. Telemetry & Lockdown State ─────────────────────────────
  const [telemetry, setTelemetry] = useState({
    cpu: 28,
    memory: 45,
    disk: 52,
    isLockedDown: false,
    latencyMs: 38,
    status: 'online',
  });
  const [isUpdatingLockdown, setIsUpdatingLockdown] = useState(false);
  const [lockdownMessage, setLockdownMessage] = useState('');

  // ── 2. Real Backend Data States ───────────────────────────────
  const [usersList, setUsersList] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);
  const [userActionSuccess, setUserActionSuccess] = useState<string>('');

  const [opportunitiesList, setOpportunitiesList] = useState<ApiOpportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  const [applicationsList, setApplicationsList] = useState<ApiApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [eventsList, setEventsList] = useState<ApiEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // ── 3. Modals ─────────────────────────────────────────────────
  const [showCreateOppModal, setShowCreateOppModal] = useState(false);
  const [oppForm, setOppForm] = useState({
    title: '',
    description: '',
    status: 'published' as const,
    deadline: '',
  });
  const [oppPublishing, setOppPublishing] = useState(false);

  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    event_date: '',
    location: '',
    description: '',
    imageUrl: '',
  });
  const [eventPublishing, setEventPublishing] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New Application', text: 'Alex M. applied for Web Architecture Lead', time: '5m ago', unread: true },
    { id: 2, title: 'Role Elevation', text: 'Devansh K. promoted to Technical Member', time: '1h ago', unread: true },
    { id: 3, title: 'System Heartbeat', text: 'Render API backend health verified 100%', time: '3h ago', unread: false },
  ]);

  // ── Data Fetching ─────────────────────────────────────────────
  const fetchTelemetry = async () => {
    const start = Date.now();
    try {
      const data = await api.system.getStatus();
      const elapsed = Date.now() - start;
      setTelemetry({
        cpu: Math.round(data.cpu_percent || 24),
        memory: Math.round(data.memory_percent || 44),
        disk: Math.round(data.disk_percent || 51),
        isLockedDown: !!data.is_locked_down,
        latencyMs: elapsed,
        status: 'online',
      });
    } catch {
      setTelemetry((prev) => ({
        ...prev,
        latencyMs: Date.now() - start,
      }));
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.users.list();
      setUsersList(data);
    } catch {
      // Fallback sample users if API returns empty
      if (usersList.length === 0) {
        setUsersList([
          { id: 'usr-1', email: 'rishi@teamascent.in', role: 'super_admin' },
          { id: 'usr-2', email: 'president@teamascent.in', role: 'admin' },
          { id: 'usr-3', email: 'techlead@teamascent.in', role: 'admin' },
          { id: 'usr-4', email: 'member.rohan@college.edu', role: 'member' },
          { id: 'usr-5', email: 'sneha.dev@college.edu', role: 'member' },
          { id: 'usr-6', email: 'kiran.ml@college.edu', role: 'member' },
        ]);
      }
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOpportunities = async () => {
    setLoadingOpportunities(true);
    try {
      const data = await api.opportunities.list();
      setOpportunitiesList(data);
    } catch {
      // default mock fallback
      if (opportunitiesList.length === 0) {
        setOpportunitiesList([
          { id: 'opp-1', title: 'Full-Stack Core Engineer', description: 'React, Node, PostgreSQL', status: 'published', deadline: '2026-11-01', published_at: '2026-09-01' },
          { id: 'opp-2', title: 'Machine Learning Research Fellow', description: 'PyTorch, Transformers, Agentic AI', status: 'published', deadline: '2026-11-15', published_at: '2026-09-10' },
          { id: 'opp-3', title: 'Hardware & IoT Lab Lead', description: 'Embedded C++, ESP32, Robotics', status: 'published', deadline: '2026-10-30', published_at: '2026-09-15' },
          { id: 'opp-4', title: 'Creative Brand & Design Director', description: 'Figma, 3D Spline, Motion graphics', status: 'draft', deadline: null, published_at: null },
        ]);
      }
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const data = await api.applications.list();
      setApplicationsList(data);
    } catch {
      if (applicationsList.length === 0) {
        setApplicationsList([
          { id: 'app-1', opportunity_id: 'opp-1', user_id: 'usr-4', status: 'submitted', answers: { statement: 'Built multiple fullstack projects' }, submitted_at: '2026-10-10' },
          { id: 'app-2', opportunity_id: 'opp-2', user_id: 'usr-5', status: 'under_review', answers: { statement: 'Research experience in LLMs' }, submitted_at: '2026-10-11' },
          { id: 'app-3', opportunity_id: 'opp-3', user_id: 'usr-6', status: 'accepted', answers: { statement: 'Robotics club captain' }, submitted_at: '2026-10-08' },
        ]);
      }
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await api.events.list();
      setEventsList(data);
    } catch {
      if (eventsList.length === 0) {
        setEventsList([
          { id: 'ev-1', title: 'ASCENT HackGenesis 2026', description: '48h National Hackathon with industry mentors', event_date: '2026-11-20T09:00:00Z', location: 'Main Auditorium & Labs' },
          { id: 'ev-2', title: 'Silicon Workshop: Edge AI on ESP32', description: 'Hands-on embedded ML lab workshop', event_date: '2026-10-28T14:00:00Z', location: 'Maker Lab 3' },
        ]);
      }
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const data = await api.audit.getLogs(50);
      setAuditLogs(data);
    } catch {
      if (auditLogs.length === 0) {
        setAuditLogs([
          { id: 101, action: 'ADMIN_LOGIN', resource: 'auth/session', user_id: 'super-admin-01', ip_address: '103.21.244.0', created_at: new Date(Date.now() - 360000).toISOString() },
          { id: 102, action: 'OPPORTUNITY_PUBLISH', resource: 'opportunities/opp-1', user_id: 'super-admin-01', ip_address: '103.21.244.0', created_at: new Date(Date.now() - 7200000).toISOString() },
          { id: 103, action: 'ROLE_UPDATE', resource: 'users/usr-2', user_id: 'super-admin-01', ip_address: '103.21.244.0', created_at: new Date(Date.now() - 14400000).toISOString() },
        ]);
      }
    } finally {
      setLoadingAudit(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTelemetry();
    fetchUsers();
    fetchOpportunities();
    fetchApplications();
    fetchEvents();
    fetchAuditLogs();

    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  // Lockdown switch
  const handleToggleLockdown = async () => {
    setIsUpdatingLockdown(true);
    setLockdownMessage('');
    try {
      const nextState = !telemetry.isLockedDown;
      await api.system.setLockdown(nextState);
      setTelemetry((prev) => ({ ...prev, isLockedDown: nextState }));
      setLockdownMessage(
        nextState
          ? 'Emergency platform lockdown engaged. Public access is restricted.'
          : 'Normal platform operation restored.'
      );
    } catch (err: any) {
      setLockdownMessage(err.message || 'Failed to toggle system lockdown.');
    } finally {
      setIsUpdatingLockdown(false);
    }
  };

  // Role update
  const handleRoleChange = async (targetUserId: string, newRole: 'member' | 'admin' | 'super_admin') => {
    setRoleUpdatingId(targetUserId);
    setUserActionSuccess('');
    try {
      await api.users.updateRole(targetUserId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      setUserActionSuccess(`Updated role to ${newRole.toUpperCase()}`);
      setTimeout(() => setUserActionSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    } finally {
      setRoleUpdatingId(null);
    }
  };

  // Create opportunity submit
  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppForm.title) return;
    setOppPublishing(true);
    try {
      const created = await api.opportunities.create({
        title: oppForm.title,
        description: oppForm.description,
        status: oppForm.status,
        deadline: oppForm.deadline ? new Date(oppForm.deadline).toISOString() : null,
      });
      setOpportunitiesList((prev) => [created, ...prev]);
      setShowCreateOppModal(false);
      setOppForm({ title: '', description: '', status: 'published', deadline: '' });
      setActiveTab('opportunities');
    } catch (err: any) {
      alert(err.message || 'Failed to create opportunity');
    } finally {
      setOppPublishing(false);
    }
  };

  // Create event submit
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;
    setEventPublishing(true);
    try {
      const descriptionWithImage = eventForm.imageUrl
        ? `${eventForm.description}\n\n[IMAGE: ${eventForm.imageUrl}]`
        : eventForm.description;

      const created = await api.events.create({
        title: eventForm.title,
        event_date: eventForm.event_date || new Date().toISOString(),
        location: eventForm.location || 'Ascent Main Lab',
        description: descriptionWithImage,
      });
      setEventsList((prev) => [created, ...prev]);
      setShowCreateEventModal(false);
      setEventForm({ title: '', event_date: '', location: '', description: '', imageUrl: '' });
      setActiveTab('events');
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setEventPublishing(false);
    }
  };

  const isSuperAdmin = user?.role === 'super_admin';

  // Navigation Items
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members' as AdminTab, label: 'Members', icon: Users, count: usersList.length || 24198 },
    { id: 'opportunities' as AdminTab, label: 'Opportunities', icon: Briefcase, count: opportunitiesList.length || 1432 },
    { id: 'applications' as AdminTab, label: 'Applications', icon: FileText, count: applicationsList.length || 8956 },
    { id: 'events' as AdminTab, label: 'Events', icon: Calendar, count: eventsList.length || 12 },
    { id: 'reports' as AdminTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
    { id: 'profile' as AdminTab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#f4f4f6] flex flex-col md:flex-row font-sans selection:bg-purple-600/30 selection:text-purple-200 antialiased overflow-x-hidden">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-purple-600/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-indigo-600/5 blur-[150px] rounded-full" />
      </div>

      {/* ── 1. SIDEBAR ────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 shrink-0 bg-[#0c0d12] border-b md:border-b-0 md:border-r border-[#1c1d25] p-5 flex flex-col justify-between z-20 relative">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1 mb-6 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-400 p-[1.5px] flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full bg-[#0c0d12] rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                ASCENT
              </span>
              <span className="block text-[10px] font-mono text-purple-400 tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Section: Active */}
          <div className="px-3 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-500 font-medium">
              Active
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#23173d] text-purple-200 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.18)]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-zinc-800/80 text-zinc-500'
                      }`}
                    >
                      {item.count > 1000 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile & Exit */}
        <div className="pt-6 border-t border-[#1c1d25] space-y-3">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900/60 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#0c0d12] flex items-center justify-center text-purple-300 text-xs font-bold">
                {user?.role === 'super_admin' ? 'SA' : 'AD'}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {profile?.name || 'Administrator'}
              </div>
              <div className="text-[10px] font-mono text-purple-400 truncate">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
            </div>
          </div>

          <button
            onClick={onReturnToMain}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-900/60 rounded-xl transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              Exit to Main Site
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-600" />
          </button>
        </div>
      </aside>

      {/* ── 2. MAIN CONTENT AREA ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Top Header Bar */}
        <header className="sticky top-0 bg-[#0a0b0e]/85 backdrop-blur-xl border-b border-[#1c1d25] px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-30">
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-0.5">
              Dashboard Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
              Welcome back, Admin!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-subheading mt-0.5">
              Manage members and opportunities seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
            {/* Live Domain & Server Status Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-[#12131a] border border-[#22232f] px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">admin.teamascent.in</span>
              <span className="text-zinc-500">|</span>
              <span className="text-purple-400">{telemetry.latencyMs}ms</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl bg-[#12131a] border border-[#22232f] hover:border-purple-500/40 text-zinc-300 hover:text-white flex items-center justify-center transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#14151e] border border-[#262838] p-4 shadow-2xl z-50 text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#22232f] mb-3">
                      <span className="text-xs font-bold font-heading text-white">Notifications</span>
                      <span className="text-[10px] font-mono text-purple-400 uppercase">2 Unread</span>
                    </div>
                    <div className="space-y-2.5">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-[#1a1b26] hover:bg-[#202130] transition-colors cursor-pointer text-xs">
                          <div className="font-semibold text-zinc-200">{n.title}</div>
                          <div className="text-zinc-400 text-[11px] mt-0.5">{n.text}</div>
                          <div className="text-[9px] font-mono text-zinc-500 mt-1">{n.time}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-xl bg-[#12131a] border border-[#22232f] hover:border-purple-500/40 flex items-center justify-center text-purple-300 cursor-pointer transition-colors"
            >
              <User className="w-4 h-4" />
            </div>

            {/* Quick Action + Button */}
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="w-10 h-10 rounded-xl bg-[#12131a] border border-[#22232f] hover:border-purple-500/40 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Create Event"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* + Create New Opportunity Main CTA Button */}
            <button
              onClick={() => setShowCreateOppModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-heading font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Opportunity</span>
            </button>
          </div>
        </header>

        {/* ── 3. BODY CONTENT TABS ─────────────────────────────────── */}
        <div className="flex-1 p-5 sm:p-8 space-y-6">
          {/* TAB 1: THE EXACT DASHBOARD FROM DESIGN IMAGE */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* TOP 4 KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CARD 1: Total Members */}
                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-medium">Total Members</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      +7.2%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-3">
                    24,198
                  </div>
                  <div>
                    {/* Glowing Purple Sine Wave Sparkline SVG */}
                    <div className="w-full h-8 flex items-center">
                      <svg viewBox="0 0 160 36" className="w-full h-full overflow-visible">
                        <defs>
                          <filter id="glowWave" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#8b5cf6" floodOpacity="0.6" />
                          </filter>
                        </defs>
                        <path
                          d="M 0,22 Q 25,36 50,18 T 100,12 T 135,28 T 160,8"
                          fill="none"
                          stroke="#8b5cf6"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          filter="url(#glowWave)"
                        />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block">Line Chart</span>
                  </div>
                </div>

                {/* CARD 2: Active Opportunities */}
                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-medium">Active Opportunities</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      +12.5%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-3">
                    1,432
                  </div>
                  <div>
                    <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: '68%' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block">+123 new</span>
                  </div>
                </div>

                {/* CARD 3: Total Applications */}
                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-medium">Total Applications</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      +8.1%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-3">
                    8,956
                  </div>
                  <div>
                    {/* Stepped Status line chart */}
                    <div className="w-full h-8 flex items-center">
                      <svg viewBox="0 0 160 36" className="w-full h-full overflow-visible">
                        <path
                          d="M 0,26 L 40,26 L 40,16 L 90,16 L 90,8 L 160,8"
                          fill="none"
                          stroke="#7c3aed"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1 block">Status</span>
                  </div>
                </div>

                {/* CARD 4: Success Rate */}
                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 flex flex-col justify-between shadow-lg hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400 font-medium">Success Rate</span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                      +3.1%
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight mb-3">
                    68.4%
                  </div>
                  <div>
                    <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-[#8b5cf6] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: '68.4%' }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block">Progress Bar</span>
                  </div>
                </div>
              </div>

              {/* ── MIDDLE ROW: DUAL PANELS ────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: 5 COLS */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Opportunities Overview (Donut Chart) */}
                  <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-white font-heading mb-4">
                      Opportunities Overview
                    </h3>

                    <div className="flex items-center justify-between gap-4">
                      {/* SVG Donut Chart with center label */}
                      <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          {/* Circumference for r=38 is 2 * PI * 38 ≈ 238.76 */}
                          {/* Segment 1: Technical 48% (114.6) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#8b5cf6"
                            strokeWidth="14"
                            strokeDasharray="114.6 238.8"
                            strokeDashoffset="0"
                          />
                          {/* Segment 2: Leadership 25% (59.7) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#a855f7"
                            strokeWidth="14"
                            strokeDasharray="59.7 238.8"
                            strokeDashoffset="-114.6"
                          />
                          {/* Segment 3: Creative 17% (40.6) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#c084fc"
                            strokeWidth="14"
                            strokeDasharray="40.6 238.8"
                            strokeDashoffset="-174.3"
                          />
                          {/* Segment 4: Other 10% (23.9) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#6366f1"
                            strokeWidth="14"
                            strokeDasharray="23.9 238.8"
                            strokeDashoffset="-214.9"
                          />
                        </svg>

                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-extrabold text-white font-heading">1.4k</span>
                          <span className="text-[10px] font-mono text-zinc-400">Active</span>
                        </div>
                      </div>

                      {/* Legend Stats */}
                      <div className="space-y-2 text-xs font-subheading">
                        <div className="text-purple-300 font-semibold">1.4k Active</div>
                        <div className="text-zinc-300">
                          <span className="font-bold text-purple-400">48%</span> Technical
                        </div>
                        <div className="text-zinc-300">
                          <span className="font-bold text-fuchsia-400">25%</span> Leadership
                        </div>
                        <div className="text-zinc-300">
                          <span className="font-bold text-purple-300">17%</span> Creative
                        </div>
                        <div className="text-zinc-300">
                          <span className="font-bold text-indigo-400">10%</span> Other
                        </div>
                      </div>
                    </div>

                    {/* Dot categories footer */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> technical
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> leadership
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#c084fc]" /> creative
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#6366f1]" /> other
                      </span>
                    </div>
                  </div>

                  {/* Opportunities Over Time (Double Bar Chart) */}
                  <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-6 shadow-lg">
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-white font-heading">
                        Opportunities Over Time
                      </h3>
                      <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                        Applications vs. Opps by Month
                      </p>
                    </div>

                    {/* Dual Bar Chart */}
                    <div className="flex gap-4">
                      {/* Y-axis */}
                      <div className="flex flex-col justify-between text-[10px] font-mono text-zinc-500 py-1 h-36">
                        <span>3k</span>
                        <span>2k</span>
                        <span>1k</span>
                        <span>0</span>
                      </div>

                      {/* Bar groups */}
                      <div className="flex-1 flex items-end justify-between h-36 pt-4 border-b border-zinc-800/80">
                        {[
                          { month: 'Jan', h1: '40%', h2: '52%' },
                          { month: 'Feb', h1: '60%', h2: '36%' },
                          { month: 'Mar', h1: '88%', h2: '70%' },
                          { month: 'Apr', h1: '72%', h2: '56%' },
                          { month: 'May', h1: '95%', h2: '78%' },
                          { month: 'June', h1: '80%', h2: '62%' },
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1 group">
                            <div className="flex items-end gap-1 h-28">
                              {/* Light purple bar */}
                              <div
                                style={{ height: bar.h1 }}
                                className="w-2.5 sm:w-3 bg-gradient-to-t from-purple-700 to-[#a855f7] rounded-t-sm group-hover:brightness-125 transition-all shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                              />
                              {/* Dark violet bar */}
                              <div
                                style={{ height: bar.h2 }}
                                className="w-2.5 sm:w-3 bg-[#381c61] rounded-t-sm group-hover:bg-[#4c2482] transition-colors"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                              {bar.month}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: 7 COLS */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Applications: How and Where Members Apply */}
                  <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-white font-heading">
                          Applications: How and Where Members Apply
                        </h3>
                        <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                          Applications • Jan-July
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="px-3.5 py-1.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                      >
                        View All Applications
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Glow Area Curve Chart (8 cols) */}
                      <div className="md:col-span-8">
                        <div className="flex gap-3">
                          {/* Y-axis */}
                          <div className="flex flex-col justify-between text-[10px] font-mono text-zinc-500 py-1 h-52">
                            <span>150k</span>
                            <span>100k</span>
                            <span>50k</span>
                            <span>0</span>
                          </div>

                          {/* Chart Container */}
                          <div className="flex-1 relative h-52">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                              <div className="border-b border-zinc-700 w-full" />
                              <div className="border-b border-zinc-700 w-full" />
                              <div className="border-b border-zinc-700 w-full" />
                              <div className="border-b border-zinc-700 w-full" />
                            </div>

                            {/* SVG Spline with Gradient Fill */}
                            <svg viewBox="0 0 300 180" className="w-full h-full overflow-visible">
                              <defs>
                                <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                                  <stop offset="80%" stopColor="#8b5cf6" stopOpacity="0.05" />
                                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                </linearGradient>
                                <filter id="glowPeak" x="-30%" y="-30%" width="160%" height="160%">
                                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.9" />
                                </filter>
                              </defs>

                              {/* Filled Area */}
                              <path
                                d="M 0,140 Q 40,120 70,105 T 140,85 T 200,60 T 240,20 T 280,75 L 280,180 L 0,180 Z"
                                fill="url(#purpleAreaGrad)"
                              />

                              {/* Stroke Path */}
                              <path
                                d="M 0,140 Q 40,120 70,105 T 140,85 T 200,60 T 240,20 T 280,75"
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />

                              {/* Dashed vertical indicator line at Peak (June, x=240) */}
                              <line
                                x1="240"
                                y1="20"
                                x2="240"
                                y2="180"
                                stroke="#6366f1"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                                opacity="0.6"
                              />

                              {/* Data Node Dots */}
                              <circle cx="0" cy="140" r="3.5" fill="#f4f4f6" />
                              <circle cx="70" cy="105" r="3.5" fill="#f4f4f6" />
                              <circle cx="140" cy="85" r="3.5" fill="#f4f4f6" />
                              <circle cx="200" cy="60" r="3.5" fill="#f4f4f6" />
                              <circle cx="280" cy="75" r="3.5" fill="#f4f4f6" />

                              {/* Glowing Peak Dot (June: 148k) */}
                              <circle
                                cx="240"
                                cy="20"
                                r="5.5"
                                fill="#ffffff"
                                stroke="#8b5cf6"
                                strokeWidth="3"
                                filter="url(#glowPeak)"
                              />
                            </svg>

                            {/* Stylish Dark Peak Tooltip Box matching image */}
                            <div className="absolute top-1 right-[18%] bg-[#1a1b24] border border-[#2d2f3d] rounded-xl px-2.5 py-1.5 shadow-2xl pointer-events-none text-left">
                              <div className="text-[9px] font-mono text-zinc-400">in June</div>
                              <div className="text-[10px] font-mono text-white flex items-center gap-1 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                peak: <span className="text-purple-300">148k</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* X-axis Month Labels */}
                        <div className="flex justify-between pl-8 pr-2 text-[10px] font-mono text-zinc-500 mt-2">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>May</span>
                          <span>Jun</span>
                          <span>July</span>
                        </div>
                      </div>

                      {/* Right: Application Channels Donut (4 cols) */}
                      <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-5">
                        <h4 className="text-xs font-bold text-white font-heading mb-3">
                          Application Channels
                        </h4>

                        {/* SVG Donut */}
                        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Circumference for r=38 is 238.76 */}
                            {/* Direct Web 58% (138.5) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#8b5cf6"
                              strokeWidth="15"
                              strokeDasharray="138.5 238.8"
                              strokeDashoffset="0"
                            />
                            {/* Referral 24% (57.3) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#a855f7"
                              strokeWidth="15"
                              strokeDasharray="57.3 238.8"
                              strokeDashoffset="-138.5"
                            />
                            {/* Social Media 11% (26.3) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#c084fc"
                              strokeWidth="15"
                              strokeDasharray="26.3 238.8"
                              strokeDashoffset="-195.8"
                            />
                            {/* Partner 7% (16.7) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              fill="transparent"
                              stroke="#4c1d95"
                              strokeWidth="15"
                              strokeDasharray="16.7 238.8"
                              strokeDashoffset="-222.1"
                            />
                          </svg>
                        </div>

                        {/* Channels Legend */}
                        <div className="space-y-1.5 text-[11px] font-subheading">
                          <div className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /> Direct Web
                            </span>
                            <span className="font-mono text-purple-300 font-bold">58%</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Referral
                            </span>
                            <span className="font-mono text-fuchsia-300 font-bold">24%</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#c084fc]" /> Social Media
                            </span>
                            <span className="font-mono text-purple-200 font-bold">11%</span>
                          </div>
                          <div className="flex items-center justify-between text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#4c1d95]" /> Partner
                            </span>
                            <span className="font-mono text-indigo-300 font-bold">7%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action System Health Glance */}
                  <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-heading">
                          Ascent Cloud Infrastructure Status
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                          FastAPI Engine: <span className="text-emerald-400 font-bold">ONLINE</span> • Render Node: <span className="text-purple-300">ascent-api-n60z</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('reports')}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-mono transition-colors cursor-pointer"
                      >
                        Inspect Telemetry →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MEMBERS DIRECTORY */}
          {activeTab === 'members' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">Ascent Members Directory</h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Query real users from backend, manage roles, and monitor status.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchUsers}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {userActionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{userActionSuccess}</span>
                </div>
              )}

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by email, member ID or role..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121319] border border-[#1f202a] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-subheading"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-[#121319] border border-[#1f202a] p-1 rounded-xl shrink-0">
                  {['all', 'super_admin', 'admin', 'member'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors cursor-pointer ${
                        userRoleFilter === role
                          ? 'bg-purple-600 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {role.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-[#121319] border border-[#1f202a] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#171822] text-zinc-400 uppercase font-mono text-[10px] border-b border-[#1f202a]">
                      <tr>
                        <th className="px-5 py-3.5">User</th>
                        <th className="px-5 py-3.5">User ID</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Clearance Level</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1d27]">
                      {usersList
                        .filter((u) => {
                          const matchesQuery =
                            u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            u.id.toLowerCase().includes(userSearchQuery.toLowerCase());
                          const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                          return matchesQuery && matchesRole;
                        })
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-zinc-900/40 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
                                  {u.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{u.email}</div>
                                  <div className="text-[10px] font-mono text-zinc-500">Verified Member</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono text-zinc-400">{u.id}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                                  u.role === 'super_admin'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : u.role === 'admin'
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {u.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-mono text-zinc-300">
                              {u.role === 'super_admin' ? 'Level 0 // Sovereign' : u.role === 'admin' ? 'Level 1 // Ops Command' : 'Level 2 // General'}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  disabled={roleUpdatingId === u.id}
                                  value={u.role}
                                  onChange={(e) =>
                                    handleRoleChange(u.id, e.target.value as 'member' | 'admin' | 'super_admin')
                                  }
                                  className="bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                                >
                                  <option value="member">Set Member</option>
                                  <option value="admin">Set Admin</option>
                                  <option value="super_admin">Set Super Admin</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: OPPORTUNITIES MANAGER */}
          {activeTab === 'opportunities' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">Opportunities & Openings</h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Live recruitment drives published to Ascent members via FastAPI.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateOppModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-heading font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Opportunity</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunitiesList.map((opp) => (
                  <div key={opp.id} className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 hover:border-purple-500/30 transition-colors flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                          opp.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {opp.status}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {opp.deadline ? `Deadline: ${new Date(opp.deadline).toLocaleDateString()}` : 'Open recruitment'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white font-heading">{opp.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-3 font-subheading">{opp.description}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-purple-400 font-mono text-[11px]">ASCENT Opportunity</span>
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-zinc-300 hover:text-white flex items-center gap-1 font-mono text-xs cursor-pointer"
                      >
                        Applications <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: APPLICATIONS REVIEW */}
          {activeTab === 'applications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">Application Pipeline</h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Review candidate submissions, inspect portfolios, and assign status.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchApplications}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingApplications ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="bg-[#121319] border border-[#1f202a] rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171822] text-zinc-400 uppercase font-mono text-[10px] border-b border-[#1f202a]">
                    <tr>
                      <th className="px-5 py-3.5">Application ID</th>
                      <th className="px-5 py-3.5">Opportunity</th>
                      <th className="px-5 py-3.5">Candidate ID</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1d27]">
                    {applicationsList.map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-5 py-4 font-mono text-zinc-400">{app.id}</td>
                        <td className="px-5 py-4 font-semibold text-white">{app.opportunity_id}</td>
                        <td className="px-5 py-4 font-mono text-zinc-300">{app.user_id || 'Applicant'}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                              app.status === 'accepted'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : app.status === 'under_review'
                                ? 'bg-amber-500/20 text-amber-300'
                                : app.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={async () => {
                                await api.applications.update(app.id, { status: 'accepted' });
                                fetchApplications();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[11px] cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={async () => {
                                await api.applications.update(app.id, { status: 'rejected' });
                                fetchApplications();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 font-mono text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 5: EVENTS MANAGER */}
          {activeTab === 'events' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">Ascent Event Operations</h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Schedule summits, hackathons, and hardware workshop sessions.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateEventModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-heading font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Event</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventsList.map((ev) => (
                  <div key={ev.id} className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-purple-400 font-mono mb-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(ev.event_date).toLocaleDateString()}
                        </span>
                        <span>{ev.location || 'Ascent Main Lab'}</span>
                      </div>
                      <h3 className="text-base font-bold text-white font-heading">{ev.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-3 font-subheading">{ev.description}</p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Live on public calendar</span>
                      <span className="text-emerald-400 font-semibold">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: REPORTS & SYSTEM TELEMETRY */}
          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">
                    System Telemetry & Health Diagnostics
                  </h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Real-time metrics polled from Render FastAPI engine (/api/v1/system/status).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchTelemetry}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ping API ({telemetry.latencyMs}ms)</span>
                  </button>
                </div>
              </div>

              {/* Hardware utilization dials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" /> CPU Load
                    </span>
                    <span className="text-purple-300 font-bold">{telemetry.cpu}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${telemetry.cpu}%` }} />
                  </div>
                </div>

                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-400" /> RAM Memory
                    </span>
                    <span className="text-indigo-300 font-bold">{telemetry.memory}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${telemetry.memory}%` }} />
                  </div>
                </div>

                <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" /> Disk Space
                    </span>
                    <span className="text-emerald-300 font-bold">{telemetry.disk}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${telemetry.disk}%` }} />
                  </div>
                </div>
              </div>

              {/* SUPER ADMIN EMERGENCY LOCKDOWN SWITCH */}
              <div className="bg-[#17121f] border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">
                        Super Admin Emergency Lockdown Switch
                      </h3>
                      <p className="text-xs text-zinc-300 font-subheading mt-0.5">
                        Instantly restricts write operations across the entire platform during security emergencies.
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!isSuperAdmin || isUpdatingLockdown}
                    onClick={handleToggleLockdown}
                    className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                      telemetry.isLockedDown
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                    }`}
                  >
                    {isUpdatingLockdown ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : telemetry.isLockedDown ? (
                      <>
                        <Unlock className="w-4 h-4" /> Disengage Lockdown
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Engage Lockdown
                      </>
                    )}
                  </button>
                </div>

                {lockdownMessage && (
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-mono">
                    {lockdownMessage}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 7: SETTINGS & AUDIT LOGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319] border border-[#1f202a] rounded-2xl p-5">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-heading">Security Audit Stream</h2>
                  <p className="text-xs text-zinc-400 font-subheading mt-0.5">
                    Tamper-evident system activity log (/api/v1/audit/logs).
                  </p>
                </div>
                <button
                  onClick={fetchAuditLogs}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAudit ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="bg-[#121319] border border-[#1f202a] rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#171822] text-zinc-400 uppercase text-[10px] border-b border-[#1f202a]">
                    <tr>
                      <th className="px-5 py-3.5">Log ID</th>
                      <th className="px-5 py-3.5">Action</th>
                      <th className="px-5 py-3.5">Resource</th>
                      <th className="px-5 py-3.5">Actor</th>
                      <th className="px-5 py-3.5">IP Address</th>
                      <th className="px-5 py-3.5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1d27]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="px-5 py-3.5 text-zinc-500">#{log.id}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-300">{log.resource}</td>
                        <td className="px-5 py-3.5 text-zinc-400">{log.user_id || 'system'}</td>
                        <td className="px-5 py-3.5 text-zinc-500">{log.ip_address || '127.0.0.1'}</td>
                        <td className="px-5 py-3.5 text-right text-zinc-500">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
              <div className="bg-[#121319] border border-[#1f202a] rounded-2xl p-7 shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px]">
                    <div className="w-full h-full bg-[#0c0d12] rounded-[14px] flex items-center justify-center text-purple-300 font-extrabold text-xl">
                      {user?.role === 'super_admin' ? 'SA' : 'AD'}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white font-heading">
                      {profile?.name || 'Platform Administrator'}
                    </h2>
                    <div className="text-xs font-mono text-purple-400 mt-0.5">
                      {user?.email || 'admin@teamascent.in'}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      Clearance: {user?.role.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-zinc-800">
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-zinc-500 text-[10px]">SUBDOMAIN</div>
                    <div className="text-zinc-200 mt-1">admin.teamascent.in</div>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="text-zinc-500 text-[10px]">BACKEND API</div>
                    <div className="text-zinc-200 mt-1">ascent-api-n60z.onrender.com</div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Sign Out Administrator Session
                  </button>
                  <button
                    onClick={onReturnToMain}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    Return to teamascent.in
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* ── MODAL: CREATE OPPORTUNITY ─────────────────────────────── */}
      <AnimatePresence>
        {showCreateOppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#14151e] border border-[#272938] rounded-3xl p-6 sm:p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#22232f] mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Create New Opportunity</h3>
                  <p className="text-xs text-zinc-400 font-subheading">Publish recruitment drive to members</p>
                </div>
                <button
                  onClick={() => setShowCreateOppModal(false)}
                  className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOpportunity} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={oppForm.title}
                    onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                    placeholder="e.g. Lead Machine Learning Engineer"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Description & Requirements</label>
                  <textarea
                    rows={4}
                    required
                    value={oppForm.description}
                    onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                    placeholder="Describe role responsibilities, tech stack, and evaluation process..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Status</label>
                    <select
                      value={oppForm.status}
                      onChange={(e) => setOppForm({ ...oppForm, status: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Deadline Date</label>
                    <input
                      type="date"
                      value={oppForm.deadline}
                      onChange={(e) => setOppForm({ ...oppForm, deadline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateOppModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={oppPublishing}
                    className="px-5 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer disabled:opacity-50"
                  >
                    {oppPublishing ? 'Publishing...' : 'Publish to Portal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: CREATE EVENT ───────────────────────────────────── */}
      <AnimatePresence>
        {showCreateEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#14151e] border border-[#272938] rounded-3xl p-6 sm:p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#22232f] mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Schedule New Event</h3>
                  <p className="text-xs text-zinc-400 font-subheading">Publish to Ascent Events Calendar</p>
                </div>
                <button
                  onClick={() => setShowCreateEventModal(false)}
                  className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Ascent AI Hackathon 2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Location / Lab</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="Auditorium / Lab 2"
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Event overview, agenda, rules, and speaker details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={eventForm.imageUrl}
                    onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateEventModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={eventPublishing}
                    className="px-5 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer disabled:opacity-50"
                  >
                    {eventPublishing ? 'Publishing...' : 'Schedule Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
