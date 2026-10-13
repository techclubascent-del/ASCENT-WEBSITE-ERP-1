import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  KeyRound,
  User,
  Bell,
  Cpu,
  Check,
  Smartphone,
  Mail,
  ExternalLink,
  Moon,
  Sun
} from 'lucide-react';
import { MemberProfile } from '../../types';
import { useTheme } from '../../../context/ThemeContext';

interface SettingsViewProps {
  profile: MemberProfile;
  onOpenEditProfile: () => void;
  onOpenChangePassword: () => void;
  onLogout?: () => void;
}

export function SettingsView({
  profile,
  onOpenEditProfile,
  onOpenChangePassword,
}: SettingsViewProps) {
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    hackathons: true,
    labQuotaAlerts: true,
    peerMentions: false,
  });

  const { theme, toggleTheme } = useTheme();

  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setSavedSettingsNotice(true);
      setTimeout(() => setSavedSettingsNotice(false), 2000);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl"
    >
      {savedSettingsNotice && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-subheading animate-fade-in w-fit">
          <Check className="w-3.5 h-3.5" />
          <span>Preferences updated</span>
        </div>
      )}

      {/* Profile & Credentials Section */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#26282A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[#D4A373]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white">Profile Information</h3>
              <p className="font-subheading text-xs text-gray-500 dark:text-[#8E9296]">Personal details and division tier</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenEditProfile}
            className="px-4 py-2 rounded-full bg-gray-50 dark:bg-[#141517] hover:bg-gray-100 dark:hover:bg-[#1E2022] text-gray-900 dark:text-white border border-gray-200 dark:border-[#26282A] hover:border-[#D4A373]/50 text-xs font-subheading font-medium transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-subheading">
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <span className="text-gray-500 dark:text-[#8E9296] block mb-1">Full Name</span>
            <span className="font-heading text-gray-900 dark:text-white font-medium">{profile.name}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <span className="text-gray-500 dark:text-[#8E9296] block mb-1">USN Identifier</span>
            <span className="font-mono-tech text-[#D4A373]">{profile.usn}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <span className="text-gray-500 dark:text-[#8E9296] block mb-1">Email</span>
            <span className="text-gray-900 dark:text-white">{profile.email}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <span className="text-gray-500 dark:text-[#8E9296] block mb-1">Department & Division</span>
            <span className="text-gray-900 dark:text-white">{profile.department} ({profile.division})</span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[#D4A373]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white">Security & Access</h3>
              <p className="font-subheading text-xs text-gray-500 dark:text-[#8E9296]">Password and cryptographic authentication</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenChangePassword}
            className="px-4 py-2 rounded-full bg-gray-50 dark:bg-[#141517] hover:bg-gray-100 dark:hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/30 hover:border-[#D4A373] text-xs font-subheading font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-[#26282A]">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[#D4A373]">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white">Notification Preferences</h3>
            <p className="font-subheading text-xs text-gray-500 dark:text-[#8E9296]">Choose which club updates you receive</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <div>
              <h4 className="font-heading text-xs font-medium text-gray-900 dark:text-white">Club Hackathons & Events</h4>
              <p className="font-subheading text-[11px] text-gray-500 dark:text-[#8E9296]">Direct alerts when registration opens</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('hackathons')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                notifications.hackathons ? 'bg-[#D4A373]' : 'bg-gray-200 dark:bg-[#26282A]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white dark:bg-black transition-transform ${
                  notifications.hackathons ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <div>
              <h4 className="font-heading text-xs font-medium text-gray-900 dark:text-white">Lab Compute Quota Alerts</h4>
              <p className="font-subheading text-[11px] text-gray-500 dark:text-[#8E9296]">Notify when quota reaches under 5 hours</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('labQuotaAlerts')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                notifications.labQuotaAlerts ? 'bg-[#D4A373]' : 'bg-gray-200 dark:bg-[#26282A]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white dark:bg-black transition-transform ${
                  notifications.labQuotaAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
            <div>
              <h4 className="font-heading text-xs font-medium text-gray-900 dark:text-white">Weekly Technical Digest</h4>
              <p className="font-subheading text-[11px] text-gray-500 dark:text-[#8E9296]">Summaries of top member projects and papers</p>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification('emailDigest')}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
                notifications.emailDigest ? 'bg-[#D4A373]' : 'bg-gray-200 dark:bg-[#26282A]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white dark:bg-black transition-transform ${
                  notifications.emailDigest ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-[#26282A]">
          <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[#D4A373]">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white">Appearance</h3>
            <p className="font-subheading text-xs text-gray-500 dark:text-[#8E9296]">Customize the UI theme</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#000000] border border-gray-200 dark:border-[#26282A]">
          <div>
            <h4 className="font-heading text-xs font-medium text-gray-900 dark:text-white">Dark Mode</h4>
            <p className="font-subheading text-[11px] text-gray-500 dark:text-[#8E9296]">Toggle between light and dark themes</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 ${
              theme === 'dark' ? 'bg-[#D4A373]' : 'bg-gray-300 dark:bg-[#26282A]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white dark:bg-black transition-transform ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
