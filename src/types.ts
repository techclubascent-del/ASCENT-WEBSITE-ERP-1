export type ThemeMode = 'dark' | 'light';

export type NavSection =
  | 'home'
  | 'about'
  | 'initiatives'
  | 'projects'
  | 'events'
  | 'team'
  | 'achievements'
  | 'contacts';

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Autonomous' | 'Quantum' | 'Aerospace' | 'AI Systems' | 'Materials';
  year: string;
  summary: string;
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
  modelType: 'polyhedron' | 'torus' | 'cylinder' | 'icosahedron';
  status: 'Active' | 'Deployed' | 'Research' | 'Incubating';
}

export interface InitiativeItem {
  id: string;
  code: string;
  title: string;
  pillar: string;
  objective: string;
  lead: string;
  timeline: string;
  stats: string;
  highlights: string[];
  secondaryAccent: 'blue' | 'crimson' | 'gold';
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Summit' | 'Hackathon' | 'Symposium' | 'Demo Day';
  date: string;
  location: string;
  capacity: string;
  speakers: string[];
  agendaSummary: string;
  status: 'Open' | 'Few Seats Left' | 'Upcoming';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  domain: string;
  bio: string;
  initials: string;
  image?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    x?: string;
  };
}

export interface AchievementItem {
  id: string;
  metric: string;
  label: string;
  descriptor: string;
  milestoneYear: string;
  highlightCategory: string;
}
