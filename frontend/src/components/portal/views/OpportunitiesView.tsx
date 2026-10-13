import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Clock, ExternalLink, ArrowRight, Check, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Part-time';
  stipend: string;
  deadline: string;
  description: string;
  requirements: string[];
}

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineering Intern',
    company: 'TechNova Solutions',
    location: 'Bangalore, India',
    type: 'Internship',
    stipend: '₹40,000 / month',
    deadline: 'Nov 15, 2026',
    description: 'Join our core engineering team to build scalable microservices. You will be working directly with senior engineers on our new distributed caching system.',
    requirements: ['Strong knowledge of Data Structures', 'Experience with Go or Rust', 'Familiarity with distributed systems']
  },
  {
    id: 'opp-2',
    title: 'Frontend Developer',
    company: 'Nexus Creative',
    location: 'Remote',
    type: 'Full-time',
    stipend: '12LPA - 15LPA',
    deadline: 'Oct 30, 2026',
    description: 'Looking for a UI/UX focused frontend engineer to revamp our core product dashboard using React and Tailwind CSS.',
    requirements: ['React / Next.js', 'Tailwind CSS', 'Framer Motion']
  },
  {
    id: 'opp-3',
    title: 'Data Science Intern',
    company: 'Quantium Analytics',
    location: 'Mumbai, India',
    type: 'Internship',
    stipend: '₹35,000 / month',
    deadline: 'Dec 01, 2026',
    description: 'Work on predictive models for fintech clients. Great opportunity to learn PyTorch in a production environment.',
    requirements: ['Python, Pandas, NumPy', 'Basic PyTorch', 'Strong statistics background']
  }
];

export function OpportunitiesView() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SAMPLE_OPPORTUNITIES);
  const [appliedOpps, setAppliedOpps] = useState<Record<string, boolean>>({});
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({
    title: '',
    company: '',
    location: '',
    type: 'Internship',
    stipend: '',
    deadline: '',
    description: '',
    requirements: [''],
  });

  const handleApply = (oppId: string) => {
    setAppliedOpps(prev => ({
      ...prev,
      [oppId]: true
    }));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newOpp.title || 'New Opportunity',
      company: newOpp.company || 'Unknown Company',
      location: newOpp.location || 'Remote',
      type: (newOpp.type as any) || 'Internship',
      stipend: newOpp.stipend || 'Unpaid',
      deadline: newOpp.deadline || 'TBD',
      description: newOpp.description || '',
      requirements: newOpp.requirements?.filter(r => r.trim() !== '') || [],
    };
    setOpportunities([newOpportunity, ...opportunities]);
    setIsPostingModalOpen(false);
    setNewOpp({
      title: '', company: '', location: '', type: 'Internship', stipend: '', deadline: '', description: '', requirements: ['']
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Placement Cell</h2>
          <p className="text-sm font-subheading text-gray-500 dark:text-[#8E9296]">Explore exclusive internships and job opportunities curated for Ascent members.</p>
        </div>
        
        {/* Admin Post Button */}
        <button
          type="button"
          onClick={() => setIsPostingModalOpen(true)}
          className="px-4 py-2 bg-[#D4A373] text-white dark:text-black rounded-lg text-sm font-subheading font-medium hover:bg-[#c49363] transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-[#D4A373]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post Opportunity</span>
        </button>
      </div>

      <AnimatePresence>
        {isPostingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Post New Opportunity</h3>
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="text-gray-500 hover:text-gray-900 dark:text-[#8E9296] dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newOpp.title}
                      onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                      placeholder="e.g. Software Engineering Intern"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Company</label>
                      <input
                        type="text"
                        required
                        value={newOpp.company}
                        onChange={(e) => setNewOpp({ ...newOpp, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                        placeholder="e.g. TechNova Solutions"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                      <select
                        value={newOpp.type}
                        onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                      >
                        <option>Internship</option>
                        <option>Part-time</option>
                        <option>Full-time</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input
                        type="text"
                        required
                        value={newOpp.location}
                        onChange={(e) => setNewOpp({ ...newOpp, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                        placeholder="e.g. Bangalore or Remote"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                      <input
                        type="text"
                        required
                        value={newOpp.deadline}
                        onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                        placeholder="e.g. Nov 15, 2026"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Stipend / Salary</label>
                    <input
                      type="text"
                      required
                      value={newOpp.stipend}
                      onChange={(e) => setNewOpp({ ...newOpp, stipend: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                      placeholder="e.g. ₹40,000 / month"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      required
                      value={newOpp.description}
                      onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373] min-h-[100px] resize-none"
                      placeholder="Describe the opportunity..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex justify-between items-center">
                      <span>Requirements</span>
                      <button 
                        type="button" 
                        onClick={() => setNewOpp({ ...newOpp, requirements: [...(newOpp.requirements || []), ''] })}
                        className="text-[#D4A373] flex items-center gap-1 text-[10px]"
                      >
                        <Plus className="w-3 h-3" /> Add Requirement
                      </button>
                    </label>
                    <div className="space-y-2">
                      {newOpp.requirements?.map((req, i) => (
                        <input
                          key={i}
                          type="text"
                          value={req}
                          onChange={(e) => {
                            const newReqs = [...(newOpp.requirements || [])];
                            newReqs[i] = e.target.value;
                            setNewOpp({ ...newOpp, requirements: newReqs });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#D4A373]"
                          placeholder={`Requirement ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-[#26282A] flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-[#0C0D0E] pb-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsPostingModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-subheading font-medium text-gray-600 dark:text-[#8E9296] hover:bg-gray-100 dark:hover:bg-[#141517] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D4A373] text-white dark:text-black rounded-lg text-sm font-subheading font-medium hover:bg-[#c49363] transition-colors shadow-md shadow-[#D4A373]/20"
                  >
                    Post Opportunity
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {opportunities.map(opp => (
          <div key={opp.id} className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl p-6 shadow-xl flex flex-col h-full group hover:border-[#D4A373]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center text-[#D4A373]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">{opp.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-[#8E9296]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.company}</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-xs font-subheading text-[#D4A373]">
                {opp.type}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-[#8E9296]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span>{opp.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#D4A373]" />
                <span>{opp.stipend}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D4A373]" />
                <span>Deadline: {opp.deadline}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-[#8E9296] mb-4">
              {opp.description}
            </p>
            
            <div className="mb-6 flex-grow">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Requirements</h4>
              <ul className="space-y-1">
                {opp.requirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-gray-500 dark:text-[#8E9296] flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-[#26282A] flex justify-end">
              <button 
                onClick={() => handleApply(opp.id)}
                disabled={appliedOpps[opp.id]}
                className={`px-5 py-2.5 rounded-lg text-sm font-subheading font-medium flex items-center gap-2 transition-all ${
                  appliedOpps[opp.id]
                    ? 'bg-gray-50 dark:bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 cursor-not-allowed'
                    : 'bg-[#D4A373] text-white dark:text-black hover:bg-[#c49363] border border-transparent cursor-pointer shadow-md shadow-[#D4A373]/20'
                }`}
              >
                {appliedOpps[opp.id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
