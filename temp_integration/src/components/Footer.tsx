import React from 'react';
import { AscentLogo } from './AscentLogo';
import { NavSection } from '../types';
import { ArrowUp, Mail, Linkedin, Github } from 'lucide-react';

interface FooterProps {
  onNavigate?: (section: NavSection) => void;
  accentColor1?: string;
  accentColor2?: string;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contacts" className="relative border-t border-[#545454]/20 dark:border-[#545454]/40 bg-[#FAF8F5] dark:bg-[#000000] py-12 px-4 sm:px-6 lg:px-8 z-10 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Ascent Logo & Description */}
        <div className="flex flex-col space-y-2 max-w-xl">
          <AscentLogo size={32} showWordmark={true} />
          <p className="font-body text-xs text-[#545454] dark:text-[#A6A6A6] mt-2 leading-relaxed">
            This website is made with a lot of dedication and love. If you try to copy anything from this website we will hunt you down. We mean it ! . All rights reserved &copy; 2026 Ascent Club. All rights reserved.
          </p>
        </div>

        {/* Contact Us & Social Links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div className="flex flex-col space-y-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#1E1E1E] dark:text-white">
              Contact Us
            </h3>
            <div className="flex items-center gap-3">
              {/* Gmail / Web Mail Link */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=techclubascent@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email Ascent Club via Gmail"
                title="Send email via Gmail"
                className="group flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 backdrop-blur-xl text-slate-700 dark:text-[#A6A6A6] hover:text-[#004AAD] dark:hover:text-white hover:border-[#004AAD] dark:hover:border-white transition-all shadow-sm hover:scale-105"
              >
                <Mail size={16} />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/teamascent?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ascent LinkedIn"
                title="Ascent LinkedIn"
                className="group flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 backdrop-blur-xl text-slate-700 dark:text-[#A6A6A6] hover:text-[#004AAD] dark:hover:text-white hover:border-[#004AAD] dark:hover:border-white transition-all shadow-sm hover:scale-105"
              >
                <Linkedin size={16} />
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/techclubascent-del"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ascent GitHub"
                title="Ascent GitHub"
                className="group flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-slate-300/80 dark:border-white/10 backdrop-blur-xl text-slate-700 dark:text-[#A6A6A6] hover:text-[#004AAD] dark:hover:text-white hover:border-[#004AAD] dark:hover:border-white transition-all shadow-sm hover:scale-105"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white/60 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 backdrop-blur-xl text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white transition-all shadow-sm self-start sm:self-center cursor-pointer"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
