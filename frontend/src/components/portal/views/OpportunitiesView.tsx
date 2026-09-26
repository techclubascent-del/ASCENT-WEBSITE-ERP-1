import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, DollarSign, Clock, ExternalLink, ArrowRight, Check } from 'lucide-react';

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
  const [appliedOpps, setAppliedOpps] = useState<Record<string, boolean>>({});

  const handleApply = (oppId: string) => {
    setAppliedOpps(prev => ({
      ...prev,
      [oppId]: true
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">Placement Cell</h2>
          <p className="text-sm font-subheading text-[#8E9296]">Explore exclusive internships and job opportunities curated for Ascent members.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {SAMPLE_OPPORTUNITIES.map(opp => (
          <div key={opp.id} className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-6 shadow-xl flex flex-col h-full group hover:border-[#D4A373]/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A373]/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#141517] border border-[#26282A] flex items-center justify-center text-[#D4A373]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">{opp.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-[#8E9296]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.company}</span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#141517] border border-[#26282A] text-xs font-subheading text-[#D4A373]">
                {opp.type}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#8E9296]">
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
            
            <p className="text-sm text-[#8E9296] mb-4">
              {opp.description}
            </p>
            
            <div className="mb-6 flex-grow">
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Requirements</h4>
              <ul className="space-y-1">
                {opp.requirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-[#8E9296] flex items-start gap-2">
                    <span className="text-[#D4A373] mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto pt-4 border-t border-[#26282A] flex justify-end">
              <button 
                onClick={() => handleApply(opp.id)}
                disabled={appliedOpps[opp.id]}
                className={`px-5 py-2.5 rounded-lg text-sm font-subheading font-medium flex items-center gap-2 transition-all ${
                  appliedOpps[opp.id]
                    ? 'bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 cursor-not-allowed'
                    : 'bg-[#D4A373] text-black hover:bg-[#c49363] border border-transparent cursor-pointer shadow-md shadow-[#D4A373]/20'
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
