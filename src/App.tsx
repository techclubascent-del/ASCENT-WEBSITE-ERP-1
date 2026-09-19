import React, { useState, useEffect } from 'react';
import { NavSection, ProjectItem, InitiativeItem, EventItem } from './types';
import { MinimalBackground } from './components/MinimalBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { InitiativesSection } from './components/InitiativesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EventsSection } from './components/EventsSection';
import { TeamSection } from './components/TeamSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { useTheme } from './context/ThemeContext';

// Brand secondary color pairings from Screenshot (165).png
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

// Light Mode Accent Pairings with Ochre Gold (#D4A373) and Slate (#545454)
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
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [accentPairIndex, setAccentPairIndex] = useState<number>(0);

  // Modal States
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<InitiativeItem | null>(null);

  const currentPairs = theme === 'light' ? LIGHT_ACCENT_PAIRS : DARK_ACCENT_PAIRS;
  const activePair = currentPairs[accentPairIndex % currentPairs.length];

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections: NavSection[] = [
        'home',
        'about',
        'initiatives',
        'projects',
        'events',
        'team',
        'achievements',
        'contacts',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            let mappedSection = section;
            if (['initiatives', 'projects', 'events', 'team', 'achievements'].includes(section)) {
              mappedSection = 'about';
            }
            setActiveSection(mappedSection);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAccentPalette = () => {
    setAccentPairIndex((prev) => (prev + 1) % currentPairs.length);
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
      {/* 1. Sleek Minimal Monochrome Background */}
      <MinimalBackground
        accentColor1={activePair.c1}
        accentColor2={activePair.c2}
      />

      {/* 2. Top Navigation with Ascent Logo on top left */}
      <Navbar
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />

      {/* 3. Main Content Sections */}
      <main className="relative z-10">
        {/* Home / Hero Section */}
        <HeroSection
          accentColor1={activePair.c1}
          accentColor2={activePair.c2}
          onRegisterClick={() => handleOpenRegistration()}
        />

        {/* About Section */}
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

        {/* Projects & 3D Interactive Holodeck Section */}
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

        {/* Contact & Communications Section */}
        <ContactSection
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
          setApplyModalOpen(true);
        }}
      />
    </div>
  );
}
