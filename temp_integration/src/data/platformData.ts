import { ProjectItem, InitiativeItem, EventItem, TeamMember, AchievementItem } from '../types';

export const INITIATIVES: InitiativeItem[] = [
  {
    id: 'init-1',
    code: 'ASC-ALPHA',
    title: 'Autonomous Systems & Robotics Vanguard',
    pillar: 'Deep Tech Acceleration',
    objective: 'Empowering engineering cohorts to build next-generation unmanned aerial systems and robotic navigation clusters.',
    lead: 'Dr. Sarah Lin (ex-MIT CSAIL)',
    timeline: 'Q1 2026 - Q4 2026',
    stats: '24 Fellowships Active',
    highlights: [
      'High-bandwidth sub-millimeter positioning sensors',
      'Real-time edge computation for unstructured terrain',
      'Direct pipeline to aerospace manufacturing labs'
    ],
    secondaryAccent: 'blue'
  },
  {
    id: 'init-2',
    code: 'ASC-NEXUS',
    title: 'Quantum Computing & Cryptographic Protocols',
    pillar: 'Foundational Science',
    objective: 'Bridging algorithmic research with post-quantum security infrastructure for distributed networks and financial systems.',
    lead: 'Marcus Vance, PhD',
    timeline: 'Annual Continuous Cohort',
    stats: '$3.4M Grants Disbursed',
    highlights: [
      'Fault-tolerant lattice encryption benchmarking',
      'Cryogenic qubit sensor simulation suite',
      'Open-source hardware verification framework'
    ],
    secondaryAccent: 'crimson'
  },
  {
    id: 'init-3',
    code: 'ASC-ORBIT',
    title: 'Next-Gen Orbital & Atmospheric Sensing',
    pillar: 'Aerospace & Environment',
    objective: 'Low-cost satellite payloads and hyperspectral atmospheric monitoring arrays for precision climate intelligence.',
    lead: 'Elena Rostova',
    timeline: 'Launch Windows 2026–2027',
    stats: '6 Orbital Flights Scheduled',
    highlights: [
      'Modular CubeSat telemetry transceivers',
      'Synthetic aperture radar (SAR) micro-nodes',
      'Global sensor data federation API'
    ],
    secondaryAccent: 'gold'
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Vanguard Stratospheric Glider',
    category: 'Aerospace',
    year: '2026',
    summary: 'Autonomous solar-electric atmospheric pseudo-satellite capable of 45-day continuous station-keeping.',
    description: 'Designed for persistent observation and high-altitude telecommunications relay. Operates at 65,000 feet utilizing ultra-light carbon lattice structures and gallium arsenide solar cells.',
    tags: ['Autonomous', 'Solar-Electric', 'Composite Aerostructures'],
    metrics: [
      { label: 'Endurance', value: '45 Days' },
      { label: 'Ceiling', value: '65,000 ft' },
      { label: 'Payload', value: '18.5 kg' }
    ],
    accentColor: '#004AAD',
    modelType: 'polyhedron',
    status: 'Active'
  },
  {
    id: 'proj-2',
    title: 'Chronos Quantum Annealing Core',
    category: 'Quantum',
    year: '2026',
    summary: 'Dilution-refrigerated superconducting quantum processor testbed for combinatorial optimization algorithms.',
    description: 'Enables high-fidelity state coherence and real-time error mitigation for industrial logistics, route planning, and cryptographic analysis.',
    tags: ['Cryogenics', 'Qubit Coherence', 'FPGA Controller'],
    metrics: [
      { label: 'Qubit Count', value: '128 Logical' },
      { label: 'Fidelity', value: '99.94%' },
      { label: 'Cycle Time', value: '12 ns' }
    ],
    accentColor: '#AA0044',
    modelType: 'torus',
    status: 'Deployed'
  },
  {
    id: 'proj-3',
    title: 'Aegis Swarm Mesh Controller',
    category: 'Autonomous',
    year: '2025',
    summary: 'Decentralized consensus protocol for heterogeneous drone formations operating in GPS-denied environments.',
    description: 'Implements biological flocking algorithms alongside cryptographically verified peer-to-peer telemetry to maintain coordinated geometric formations.',
    tags: ['Mesh Networking', 'SLAM Navigation', 'Resilient RF'],
    metrics: [
      { label: 'Nodes', value: '250+ Coordinated' },
      { label: 'Latency', value: '< 2.1 ms' },
      { label: 'Reliability', value: '99.999%' }
    ],
    accentColor: '#004AAD',
    modelType: 'icosahedron',
    status: 'Active'
  },
  {
    id: 'proj-4',
    title: 'Synapse Neuromorphic Vision Sensor',
    category: 'AI Systems',
    year: '2026',
    summary: 'Event-based spike vision processor consuming micro-watts for ultra-high-speed robotic object tracking.',
    description: 'Mimics biological retina architecture by reporting asynchronous luminance differentials rather than traditional full-frame video frames.',
    tags: ['Neuromorphic', 'Sub-mW Silicon', 'Low Latency'],
    metrics: [
      { label: 'Bandwidth', value: '10,000 fps eq' },
      { label: 'Power', value: '3.8 mW' },
      { label: 'Latency', value: '50 µs' }
    ],
    accentColor: '#AA0044',
    modelType: 'cylinder',
    status: 'Research'
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'ASCENT Global Innovation Summit 2026',
    type: 'Summit',
    date: 'October 24–26, 2026',
    location: 'Zurich Innovation Campus & Hybrid Livestream',
    capacity: '1,200 Attendees',
    speakers: ['Dr. Sarah Lin', 'Marcus Vance', 'Prof. Aris Thorne', 'Kavita Patel'],
    agendaSummary: 'Three days of keynote keynotes, technical deep dives in quantum navigation, venture capital roundtables, and showcase prototypes.',
    status: 'Open'
  },
  {
    id: 'evt-2',
    title: 'Sub-Orbital Systems Hackathon',
    type: 'Hackathon',
    date: 'November 12–14, 2026',
    location: 'Cape Canaveral Research Hangar',
    capacity: '60 Selected Teams',
    speakers: ['Elena Rostova', 'Chief Flight Dynamics Officer', 'Dr. Julian Cho'],
    agendaSummary: '48-hour hardware and telemetry sprint. Top 3 prototypes will be allocated verified flight manifests on high-altitude balloon launches.',
    status: 'Few Seats Left'
  },
  {
    id: 'evt-3',
    title: 'Quantum Cryptography Technical Symposium',
    type: 'Symposium',
    date: 'December 05, 2026',
    location: 'Cambridge Quantum Lab & Virtual Metaverse',
    capacity: '450 Delegates',
    speakers: ['Prof. Clara Wei', 'Security Architecture Lead', 'NIST Fellow'],
    agendaSummary: 'Peer-reviewed paper presentations on post-quantum lattice protocols, side-channel analysis, and hardware security modules.',
    status: 'Upcoming'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Dr. Sarah Lin',
    role: 'Co-Founder & Head of Autonomous Systems',
    domain: 'Robotics & Guidance Systems',
    bio: 'Pioneered decentralised flight swarm topologies at CSAIL; former technical fellow at NASA JPL.',
    initials: 'SL',
    image: '/assets/team/sarah-lin.jpg',
    socials: { x: '#', linkedin: '#', github: '#' }
  },
  {
    id: 'tm-2',
    name: 'Marcus Vance, PhD',
    role: 'Principal Research Scientist',
    domain: 'Quantum Optics & Cryptography',
    bio: 'Author of 18 foundational papers on superconducting coherence; advises international quantum standards committees.',
    initials: 'MV',
    image: '/assets/team/marcus-vance.jpg',
    socials: { linkedin: '#', github: '#' }
  },
  {
    id: 'tm-3',
    name: 'Elena Rostova',
    role: 'Director of Aerospace Initiatives',
    domain: 'Orbital Dynamics & Satellite Engineering',
    bio: 'Managed commercial launch manifests and CubeSat deployment architectures across 14 orbital missions.',
    initials: 'ER',
    image: '/assets/team/elena-rostova.jpg',
    socials: { x: '#', linkedin: '#' }
  },
  {
    id: 'tm-4',
    name: 'Dr. Tariq Al-Mansoor',
    role: 'Head of Advanced Materials Lab',
    domain: 'Carbon Nanotubes & Metamaterials',
    bio: 'Invented high-durability thermal barrier coatings deployed on reusable atmospheric reentry vehicles.',
    initials: 'TA',
    image: '/assets/team/tariq-almansoor.jpg',
    socials: { linkedin: '#', github: '#' }
  }
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    metric: '18,400+',
    label: 'Engineers & Researchers',
    descriptor: 'Across 42 countries actively building through the ASCENT innovation platform.',
    milestoneYear: '2026',
    highlightCategory: 'Global Talent Reach'
  },
  {
    id: 'ach-2',
    metric: '$14.2M',
    label: 'Direct R&D Capital Deployed',
    descriptor: 'Non-dilutive innovation grants and lab access awarded to promising initiatives.',
    milestoneYear: '2025–2026',
    highlightCategory: 'Ecosystem Funding'
  },
  {
    id: 'ach-3',
    metric: '99.98%',
    label: 'Telemetry Verification Rate',
    descriptor: 'Robust edge networks tested across extreme atmospheric and orbital conditions.',
    milestoneYear: 'Q3 2026',
    highlightCategory: 'Technical Reliability'
  },
  {
    id: 'ach-4',
    metric: '32',
    label: 'Patents & Open Standards',
    descriptor: 'Contributions published to international consortiums in robotics and post-quantum security.',
    milestoneYear: '2024–2026',
    highlightCategory: 'IP & Scientific Output'
  }
];
