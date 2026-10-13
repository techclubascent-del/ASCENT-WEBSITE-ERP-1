import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { EventItem, InitiativeItem } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: EventItem | InitiativeItem | null;
  accentColor1: string;
  accentColor2: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  accentColor1,
  accentColor2,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('Engineer / Researcher');
  const [statement, setStatement] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after showing confirmation
    }, 2500);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setEmail('');
    setOrganization('');
    setStatement('');
    onClose();
  };

  const isEvent = targetItem && 'location' in targetItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-[#545454]/50 bg-white dark:bg-[#0a0a0a] p-6 sm:p-8 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg border border-slate-300 dark:border-[#545454]/40 text-slate-500 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161616] transition-colors"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div
              className="w-14 h-14 rounded-full mx-auto flex items-center justify-center border"
              style={{
                borderColor: `${accentColor1}66`,
                backgroundColor: `${accentColor1}20`,
                color: accentColor1,
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-slate-900 dark:text-white">
              Application Dispatched
            </h3>
            <p className="font-body text-sm text-slate-600 dark:text-[#A6A6A6] max-w-sm mx-auto">
              Your transmission has been logged into the ASCENT coordination queue. An invitation token
              and credentials will arrive via email.
            </p>
            <button
              onClick={handleResetAndClose}
              className="font-button text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAE4D9] transition-all mt-4 shadow-sm"
            >
              Return to Platform
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span
                className="font-body text-xs font-semibold uppercase tracking-wider block mb-1"
                style={{ color: accentColor1 }}
              >
                {isEvent ? 'Delegate Registration' : 'Opportunity Application'}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase text-slate-900 dark:text-white">
                {targetItem ? targetItem.title : 'ASCENT Global Cohort Intake'}
              </h3>
              <p className="font-body text-xs text-slate-600 dark:text-[#A6A6A6] mt-1">
                {isEvent
                  ? 'Reserve your verified attendee pass for live and hybrid sessions.'
                  : 'Submit candidate profile for grant allocation and research cluster access.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Work / Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@lab.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Affiliation / Organization
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="University, Lab, or Venture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Primary Specialization
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                  >
                    <option value="Engineer / Researcher">Engineer / Researcher</option>
                    <option value="Hardware Architect">Hardware Architect</option>
                    <option value="Founder / Executive">Founder / Executive</option>
                    <option value="Student / Postdoc">Student / Postdoc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                  Brief Technical Objective (Optional)
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Outline proposed prototype or interest domain..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="font-button text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="font-button text-xs font-bold px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAE4D9] transition-all flex items-center gap-2 shadow-sm dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)] active:scale-95"
                >
                  <span>Transmit Application</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
