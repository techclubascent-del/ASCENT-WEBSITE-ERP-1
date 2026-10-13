import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MemberProfile,
  RegistrationFormData,
  SAMPLE_MEMBERS,
} from '../types';
import { api, ApiUser } from '../lib/api';

interface AuthContextType {
  user: ApiUser | null;
  profile: MemberProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  register: (data: RegistrationFormData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<MemberProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ascent_auth_token');
    }
    return null;
  });

  // Restore session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('ascent_current_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setUser({
            id: parsed.id || 'usr-default',
            email: parsed.email || 'member@ascent.club',
            role: 'member',
          });
        } catch (e) {
          console.error('Failed to parse saved profile', e);
        }
      }
    }
  }, []);

  const login = async (identifier: string, _password?: string): Promise<boolean> => {
    const cleanId = identifier.trim();
    let memberProfile: MemberProfile | null = null;

    // Check sample members first
    if (SAMPLE_MEMBERS[cleanId]) {
      memberProfile = SAMPLE_MEMBERS[cleanId];
    } else {
      // Check stored custom registered members
      const savedReg = localStorage.getItem('ascent_registered_profiles');
      if (savedReg) {
        try {
          const dict: Record<string, MemberProfile> = JSON.parse(savedReg);
          if (dict[cleanId.toUpperCase()] || dict[cleanId]) {
            memberProfile = dict[cleanId.toUpperCase()] || dict[cleanId];
          }
        } catch {
          // ignore
        }
      }
    }

    // If still not found, generate a dynamic member profile for the login identifier
    if (!memberProfile) {
      memberProfile = {
        id: `ASC-${cleanId.toUpperCase()}`,
        name: cleanId.toUpperCase(),
        usn: cleanId.toUpperCase(),
        email: `${cleanId.toLowerCase()}@college.edu`,
        department: 'Computer Science & Engineering',
        year: '3rd Year (Junior)',
        division: 'Core Technology',
        role: 'Technical Member',
        memberTier: 'Technical Member',
        joinDate: 'March 2026',
        badgeLevel: 'Silver Reticle // Tier 2',
        skills: ['Full-Stack Web', 'Python', 'Cloud / DevOps'],
        bio: 'Ascent technical chapter member.',
        projects: [],
        uploadedProjects: [],
        certificates: [],
        events: [],
        hardwarePass: {
          allocatedHours: 32,
          assignedLab: 'Lab 2 // Node 04',
          activeQuota: 'Workstation Access',
        },
      };
    }

    // Set auth state
    const dummyToken = `demo_jwt_${btoa(cleanId)}_${Date.now()}`;
    api.setToken(dummyToken);
    setToken(dummyToken);

    const apiUser: ApiUser = {
      id: memberProfile.id,
      email: memberProfile.email,
      role: memberProfile.memberTier === 'Core Innovator' ? 'admin' : 'member',
    };

    setUser(apiUser);
    setProfile(memberProfile);

    localStorage.setItem('ascent_current_profile', JSON.stringify(memberProfile));
    return true;
  };

  const register = async (formData: RegistrationFormData): Promise<boolean> => {
    // 1. Create a member profile from registration data
    const newProfile: MemberProfile = {
      id: `ASC-2026-${formData.usn.toUpperCase().slice(-5) || 'CAND'}`,
      name: formData.name,
      usn: formData.usn.toUpperCase(),
      email: `${formData.usn.toLowerCase()}@college.edu`,
      department: formData.department,
      year: formData.year,
      division: 'Candidate Innovator',
      role: 'Candidate Member',
      memberTier: 'Candidate Member',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      badgeLevel: 'Bronze Reticle // Tier 3',
      skills: formData.skills.length > 0 ? formData.skills : ['Engineering', 'Design'],
      bio: formData.reasonToJoin,
      phone: formData.contactNumber,
      projects: [],
      uploadedProjects: [],
      certificates: [],
      events: [],
      hardwarePass: {
        allocatedHours: 12,
        assignedLab: 'Ascent Incubation Bay',
        activeQuota: 'General Lab Pass',
      },
    };

    // 2. Persist in stored registered profiles dictionary
    try {
      const savedReg = localStorage.getItem('ascent_registered_profiles');
      const dict: Record<string, MemberProfile> = savedReg ? JSON.parse(savedReg) : {};
      dict[newProfile.usn] = newProfile;
      localStorage.setItem('ascent_registered_profiles', JSON.stringify(dict));
    } catch (e) {
      console.error('Error persisting registration', e);
    }

    // 3. Attempt to push application to FastAPI backend if available
    try {
      await api.applications.create({
        opportunity_id: 'opp-general-membership',
        answers: {
          name: formData.name,
          usn: formData.usn,
          phone: formData.contactNumber,
          department: formData.department,
          year: formData.year,
          skills: formData.skills.join(', '),
          reason: formData.reasonToJoin,
        },
      });
    } catch (err) {
      // Backend may be offline or requiring auth - registration still succeeds locally
      console.warn('Backend application sync deferred:', err);
    }

    // 4. Log in immediately as the registered user
    return await login(newProfile.usn);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ascent_current_profile');
      localStorage.removeItem('ascent_auth_token');
    }
  };

  const updateProfile = (data: Partial<MemberProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ascent_current_profile', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!profile,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
