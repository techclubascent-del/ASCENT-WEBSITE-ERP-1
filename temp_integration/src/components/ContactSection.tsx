import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  accentColor1,
  accentColor2,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Research Collaboration');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section id="contacts" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Connect With ASCENT
            </h2>
          </div>
        </motion.div>

        {/* Centered Direct Inquiry Form */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200 dark:border-[#545454]/40 bg-white/80 dark:bg-[#070707]/90 backdrop-blur-xl p-6 sm:p-10 shadow-sm dark:shadow-none"
          >
            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm"
                  style={{
                    backgroundColor: `${accentColor1}15`,
                    borderColor: accentColor1,
                    color: accentColor1,
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-slate-900 dark:text-white">
                  Transmission Dispatched
                </h3>
                <p className="font-body text-sm text-slate-600 dark:text-[#A6A6A6] max-w-sm">
                  Thank you, <span className="font-semibold text-slate-900 dark:text-white">{name}</span>. Your inquiry has been routed to the appropriate department coordinator. A response will be dispatched within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-button text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAE4D9] transition-all mt-4 shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} style={{ color: accentColor1 }} />
                  <h3 className="font-heading text-base font-bold uppercase text-slate-900 dark:text-white">
                    Send Direct Inquiry
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Elena Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors text-xs font-body"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@laboratory.org"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors text-xs font-body"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Inquiry Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors text-xs font-body"
                  >
                    <option value="Research Collaboration">Research Collaboration & Joint Labs</option>
                    <option value="Fellowship & Grants">ASCENT Fellowships & Accelerator Grants</option>
                    <option value="Hardware Evaluation">3D Lab & Hardware Specification Access</option>
                    <option value="Media & Press">Media, Press & Symposium Inquiries</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-[#A6A6A6] uppercase tracking-wider text-[10px] mb-1.5 font-semibold">
                    Message / Technical Brief *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your initiative, technology domain, or proposed collaboration..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141414] border border-slate-300 dark:border-[#545454]/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder-[#545454] focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none text-xs font-body"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#A6A6A6]">
                    <ShieldCheck size={13} style={{ color: accentColor2 }} />
                    <span>256-bit encrypted transmission channel</span>
                  </div>

                  <button
                    type="submit"
                    className="font-button text-xs font-bold px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAE4D9] transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Transmit Message</span>
                    <Send size={13} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
