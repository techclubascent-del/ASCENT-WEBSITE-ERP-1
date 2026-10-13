import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  NavSection,
  ProjectItem,
  InitiativeItem,
  EventItem,
  RegistrationFormData,
} from './types';
import { MinimalBackground } from './components/MinimalBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { InitiativesSection } from './components/InitiativesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EventsSection } from './components/EventsSection';
import { FoundersSection } from './components/FoundersSection';
import { FacultyAdvisorsSection } from './components/FacultyAdvisorsSection';
import { TeamSection } from './components/TeamSection';
import { AchievementsSection } from './components/AchievementsSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/portal/LoginPage';
import { RegistrationPage } from './components/portal/RegistrationPage';
import { MemberPortal } from './components/portal/MemberPortal';

// Brand secondary color pairings
const DARK_ACCENT_PAIRS = [
  {
    name: 'Cobalt & Ochre Gold (#004AAD & #D4A373)',
    c1: '#004AAD',
    c2: '#D4A373',
  },
  {
    name: 'Ochre Gold & Crimson (#D4A373 & #AA0044)',
    c1: '#D4A373',
    c2: '#AA0044',
  },
  {
    name: 'Cobalt & Crimson (#004AAD & #AA0044)',
    c1: '#004AAD',
    c2: '#AA0044',
  },
  {
    name: 'Acid Lime & Ochre Gold (#A0C400 & #D4A373)',
    c1: '#A0C400',
    c2: '#D4A373',
  },
];

const LIGHT_ACCENT_PAIRS = [
  {
    name: 'Ochre Gold & Slate (#D4A373 & #545454)',
    c1: '#D4A373',
    c2: '#545454',
  },
  {
    name: 'Slate & Ochre Gold (#545454 & #D4A373)',
    c1: '#545454',
    c2: '#D4A373',
  },
  {
    name: 'Ochre Gold & Deep Charcoal (#D4A373 & #1E1E1E)',
    c1: '#D4A373',
    c2: '#1E1E1E',
  },
];

export default function App() {
  const { theme } = useTheme();
  const { isAuthenticated, profile, login, register, logout } = useAuth();

  // App View Routing: 'landing' | 'login' | 'register' | 'portal'
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'portal'>('landing');
  const [activeMemberIdentifier, setActiveMemberIdentifier] = useState<string>('1MS22CS042');
  const [registeredUser, setRegisteredUser] = useState<RegistrationFormData | null>(null);
  const [loginSessionCount, setLoginSessionCount] = useState<number>(0);

  // Landing page section navigation
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [accentPairIndex] = useState<number>(0);

  // Modals
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeItem | null>(null);

  const currentPairs = theme === 'light' ? LIGHT_ACCENT_PAIRS : DARK_ACCENT_PAIRS;
  const activePair = currentPairs[accentPairIndex % currentPairs.length];

  // Scroll spy to update active section in navbar (only for landing view)
  useEffect(() => {
    if (currentView !== 'landing') return;

    const sections: NavSection[] = [
      'home',
      'about',
      'initiatives',
      'projects',
      'events',
      'founders',
      'faculty-advisors',
      'team',
      'achievements',
      'contacts',
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section crosses the middle of the screen
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as NavSection;
          let mappedSection = sectionId;
          if (['about', 'founders', 'faculty-advisors', 'team'].includes(sectionId)) {
            mappedSection = 'about';
          } else if (['achievements', 'contacts'].includes(sectionId)) {
            mappedSection = 'contacts';
          } else if (['initiatives', 'projects', 'events'].includes(sectionId)) {
            mappedSection = 'home';
          }
          setActiveSection(mappedSection);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [currentView]);

  // Auth flow handlers
  const handleLogin = async (identifier: string) => {
    try {
      sessionStorage.removeItem('ascent_portal_nav');
    } catch {}
    await login(identifier);
    setActiveMemberIdentifier(identifier || '1MS22CS042');
    setLoginSessionCount((c) => c + 1);
    setCurrentView('portal');
  };

  const handleRegistrationSuccess = async (data: RegistrationFormData) => {
    try {
      sessionStorage.removeItem('ascent_portal_nav');
    } catch {}
    await register(data);
    setRegisteredUser(data);
    setActiveMemberIdentifier(data.usn);
    setLoginSessionCount((c) => c + 1);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const handleOpenRegistration = (item?: EventItem | InitiativeItem) => {
    if (item && 'location' in item) {
      setSelectedEvent(item);
      setSelectedInitiative(null);
    } else if (item) {
      setSelectedInitiative(item as InitiativeItem);
      setSelectedEvent(null);
    } else {
      setSelectedEvent(null);
      setSelectedInitiative(null);
    }
    setApplyModalOpen(true);
  };

  const handleOpenProjectDetail = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setSelectedInitiative(null);
    setDetailModalOpen(true);
  };

  const handleOpenInitiativeDetail = (init: InitiativeItem) => {
    setSelectedInitiative(init);
    setSelectedProject(null);
    setDetailModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#1E1E1E] dark:bg-[#000000] dark:text-white selection:bg-[#D4A373] selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <AnimatePresence mode="wait">
        {/* VIEW 1: Member Login Page */}
        {currentView === 'login' && (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full min-h-screen flex items-center justify-start p-3 sm:p-6 lg:p-12 bg-ambient-glow"
          >
            <LoginPage
              onLoginClick={handleLogin}
              onNavigateToRegistration={() => setCurrentView('register')}
              onBackToHome={() => setCurrentView('landing')}
            />
          </motion.div>
        )}

        {/* VIEW 2: Member Portal Dashboard */}
        {currentView === 'portal' && (
          <motion.div
            key={`portal-view-${loginSessionCount}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full min-h-screen bg-ambient-glow text-[#F3F4F6]"
          >
            <MemberPortal
              memberIdentifier={profile?.usn || activeMemberIdentifier}
              registeredUser={registeredUser}
              initialNav="home"
              onLogout={handleLogout}
              onNavigateToRegistration={() => setCurrentView('register')}
            />
          </motion.div>
        )}

        {/* VIEW 3: Candidate Detailed Registration Page */}
        {currentView === 'register' && (
          <motion.div
            key="registration-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8 bg-ambient-glow"
          >
            <RegistrationPage
              onBackToLogin={() => setCurrentView('login')}
              onGoToPortal={handleRegistrationSuccess}
              onBackToHome={() => setCurrentView('landing')}
            />
          </motion.div>
        )}

        {/* VIEW 4: Public Landing Page */}
        {currentView === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
          >
            {/* 1. Sleek Minimal Monochrome Background */}
            <MinimalBackground
              accentColor1={activePair.c1}
              accentColor2={activePair.c2}
            />

            {/* 2. Top Navigation with Ascent Logo on top left */}
            <Navbar
              activeSection={activeSection}
              onNavigate={setActiveSection}
              onLoginClick={() => (isAuthenticated ? setCurrentView('portal') : setCurrentView('login'))}
              onRegisterClick={() => setCurrentView('register')}
              isAuthenticated={isAuthenticated}
            />

            {/* 3. Main Content Sections */}
            <main className="relative z-10">
              {/* Home / Hero Section */}
              <HeroSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
                onRegisterClick={() => setCurrentView('register')}
              />

              {/* About / Know More (Mission, Vision, Objectives) Section */}
              <AboutSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
              />

              {/* Flagship Initiatives Section */}
              <InitiativesSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
                onSelectInitiative={handleOpenInitiativeDetail}
              />

              {/* Projects Section */}
              <ProjectsSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
                onSelectProject={handleOpenProjectDetail}
              />

              {/* Curated Events & Hackathons Section */}
              <EventsSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
                onRegisterEvent={handleOpenRegistration}
              />

              {/* Founders Section */}
              <FoundersSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
              />

              {/* Faculty Advisors Section */}
              <FacultyAdvisorsSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
              />

              {/* Team Section */}
              <TeamSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
              />

              {/* Achievements Section */}
              <AchievementsSection
                accentColor1={activePair.c1}
                accentColor2={activePair.c2}
              />
            </main>

            {/* 4. Footer */}
            <Footer
              onNavigate={setActiveSection}
              accentColor1={activePair.c1}
              accentColor2={activePair.c2}
            />

            {/* 5. Modals */}
            <RegistrationModal
              isOpen={applyModalOpen}
              onClose={() => setApplyModalOpen(false)}
              targetItem={selectedEvent || selectedInitiative}
              accentColor1={activePair.c1}
              accentColor2={activePair.c2}
            />

            <ProjectDetailModal
              isOpen={detailModalOpen}
              onClose={() => setDetailModalOpen(false)}
              project={selectedProject}
              initiative={selectedInitiative}
              accentColor1={activePair.c1}
              accentColor2={activePair.c2}
              onApplyForThis={() => {
                setDetailModalOpen(false);
                setCurrentView('register');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
