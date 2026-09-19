import React, { useState, useEffect } from 'react';
import { AscentLogo } from './AscentLogo';
import { NavSection } from '../types';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'motion/react';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'contacts', label: 'Contact Us' },
  ];

  const handleNavClick = (id: NavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-none bg-transparent ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      id="ascent-main-header"
    >
      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
        {/* Very Left Corner: ASCENT Logomark and Wordmark */}
        <div className="flex items-center justify-start z-10">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="group flex items-center gap-3 transition-opacity hover:opacity-90 pl-1 sm:pl-0"
            id="navbar-brand-button"
          >
            <AscentLogo size={32} showWordmark={true} variant="monochrome" />
          </a>
        </div>

        {/* Center / Middle: Navigation Links (Home, About, Contact Us) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center pointer-events-auto z-10">
          <nav
            aria-label="Main Navigation"
            className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/40 dark:bg-white/[0.05] backdrop-blur-[32px] backdrop-saturate-[200%] shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-none relative"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-body text-xs px-4 py-1.5 rounded-full transition-colors duration-200 whitespace-nowrap cursor-pointer z-10 ${
                    isActive
                      ? 'text-white dark:text-black font-semibold'
                      : 'text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-[#545454] dark:bg-white rounded-full shadow-[0_2px_12px_rgba(84,84,84,0.3)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.25)] -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Very Right Corner: Theme Switcher & Mobile Menu Toggle */}
        <div className="flex items-center justify-end gap-2.5 z-10">
          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border-none bg-white dark:bg-[#1A1A1A] text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white transition-all shadow-sm cursor-pointer"
            id="toggle-theme-mode"
          >
            {theme === 'dark' ? (
              <Sun size={15} className="text-[#D4A373] transition-transform hover:rotate-45" />
            ) : (
              <Moon size={15} className="text-[#545454] transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border-none bg-white dark:bg-[#1A1A1A] text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white shadow-sm md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with Frosted Glassmorphism */}
      {mobileMenuOpen && (
        <div className="md:hidden border-none bg-white dark:bg-[#121212] px-4 py-5 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200 shadow-md">
          <div className="flex flex-col gap-1.5 mb-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`font-body text-sm py-2.5 px-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[#545454] text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white hover:bg-[#D4A373]/15 dark:hover:bg-[#161616]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
