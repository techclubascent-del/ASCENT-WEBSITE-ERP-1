import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, User, MessageSquare, FolderGit2, Award, Settings, LogOut, X, ChevronRight, UserPlus } from 'lucide-react';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'home' | 'profile' | 'messages' | 'projects' | 'certificates' | 'settings') => void;
  onLogout: () => void;
  onViewPeerProfile?: (usn: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'navigation' | 'user' | 'action';
  icon?: React.ReactNode;
  subtitle?: string;
  action: () => void;
}

export function UniversalSearchModal({ isOpen, onClose, onNavigate, onLogout, onViewPeerProfile }: UniversalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleUserClick = (usn: string) => {
    if (onViewPeerProfile) {
      onViewPeerProfile(usn);
    } else {
      console.warn("onViewPeerProfile not provided");
    }
    onClose();
  };

  const allActions: SearchResult[] = [
    { id: 'nav-home', title: 'Go to Home', type: 'navigation', icon: <Home className="w-4 h-4" />, action: () => { onNavigate('home'); onClose(); } },
    { id: 'nav-profile', title: 'Go to Profile', type: 'navigation', icon: <User className="w-4 h-4" />, action: () => { onNavigate('profile'); onClose(); } },
    { id: 'nav-messages', title: 'Go to Messages', type: 'navigation', icon: <MessageSquare className="w-4 h-4" />, action: () => { onNavigate('messages'); onClose(); } },
    { id: 'nav-projects', title: 'Go to Projects', type: 'navigation', icon: <FolderGit2 className="w-4 h-4" />, action: () => { onNavigate('projects'); onClose(); } },
    { id: 'nav-certificates', title: 'Go to Certificates', type: 'navigation', icon: <Award className="w-4 h-4" />, action: () => { onNavigate('certificates'); onClose(); } },
    { id: 'nav-settings', title: 'Go to Settings', type: 'navigation', icon: <Settings className="w-4 h-4" />, action: () => { onNavigate('settings'); onClose(); } },
    { id: 'act-logout', title: 'Sign Out', type: 'action', icon: <LogOut className="w-4 h-4" />, action: () => { onLogout(); onClose(); } },
    
    // Sample users for searching by Name or USN
    { id: 'usr-1', title: 'Alex Mercer', subtitle: '1MS22CS042', type: 'user', icon: <User className="w-4 h-4" />, action: () => handleUserClick('1MS22CS042') },
    { id: 'usr-2', title: 'Sarah Chen', subtitle: '1MS21IS011', type: 'user', icon: <User className="w-4 h-4" />, action: () => handleUserClick('1MS21IS011') },
    { id: 'usr-3', title: 'Jordan Smith', subtitle: '1MS23EC089', type: 'user', icon: <User className="w-4 h-4" />, action: () => handleUserClick('1MS23EC089') },
  ];

  const filteredResults = allActions.filter(action => {
    const q = query.toLowerCase();
    return action.title.toLowerCase().includes(q) || (action.subtitle && action.subtitle.toLowerCase().includes(q));
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-xl bg-[#0C0D0E] border border-[#26282A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-4 border-b border-[#26282A] bg-[#141517]">
            <Search className="w-5 h-5 text-[#8E9296] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people by name/USN, or type a command..."
              className="flex-1 bg-transparent border-none outline-none text-[#F3F4F6] placeholder-[#8E9296] ml-3 text-base font-subheading"
            />
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-subheading font-medium text-[#8E9296] bg-[#1E2022] border border-[#26282A] rounded-md">
                ESC
              </span>
              <button onClick={onClose} className="p-1 sm:hidden text-[#8E9296] hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#26282A] scrollbar-track-transparent">
            {filteredResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#8E9296] text-sm font-subheading">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Group by type roughly */}
                {query.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-[#8E9296] uppercase tracking-wider">
                    Results
                  </div>
                )}
                
                {filteredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={result.action}
                    className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-[#1A1C1F] group transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1E2022] border border-[#26282A] flex items-center justify-center text-[#8E9296] group-hover:text-[#D4A373] transition-colors shrink-0">
                      {result.icon}
                    </div>
                    <div className="ml-3 flex-1 flex flex-col">
                      <span className="text-sm font-subheading font-medium text-[#D1D5DB] group-hover:text-white transition-colors">
                        {result.title}
                      </span>
                      {result.subtitle && (
                        <span className="text-xs text-[#8E9296] font-mono mt-0.5">
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8E9296] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-[#141517] border-t border-[#26282A] px-4 py-3 flex items-center justify-between text-xs font-subheading text-[#8E9296]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-[#1E2022] border border-[#26282A]">↵</span> to select</span>
              <span className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-[#1E2022] border border-[#26282A]">↑↓</span> to navigate</span>
            </div>
            <span>Universal Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
