import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MemberProfile,
  RegistrationFormData,
  SAMPLE_MEMBERS,
} from '../types';
import { api, ApiUser } from '../lib/api';

export interface RegisterResult {
  success: boolean;
  requiresEmailConfirmation?: boolean;
  message?: string;
}

interface AuthContextType {
  user: ApiUser | null;
  profile: MemberProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  loginAsAdmin: (role?: 'admin' | 'super_admin') => void;
  register: (data: RegistrationFormData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<MemberProfile>) => void;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
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
      const savedRole = localStorage.getItem('ascent_auth_role') as 'member' | 'admin' | 'super_admin' | null;
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setUser({
            id: parsed.id || 'usr-default',
            email: parsed.email || 'member@teamascent.in',
            role: savedRole || (parsed.role === 'super_admin' ? 'super_admin' : parsed.role === 'admin' ? 'admin' : 'member'),
          });
        } catch (e) {
          console.error('Failed to parse saved profile', e);
        }
      }
    }
  }, []);

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      throw new Error('Please enter your University Seat No. (USN) or registered Email.');
    }

    let memberProfile: MemberProfile | null = null;
    let assignedRole: 'member' | 'admin' | 'super_admin' = 'member';

    // 1. Check if administrative login
    if (
      cleanId.toLowerCase().includes('admin') ||
      cleanId.toLowerCase() === 'admin@teamascent.in' ||
      cleanId.toLowerCase() === 'superadmin@teamascent.in'
    ) {
      assignedRole = cleanId.toLowerCase().includes('super') ? 'super_admin' : 'admin';
      memberProfile = {
        id: `usr-admin-${Date.now()}`,
        name: assignedRole === 'super_admin' ? 'Super Administrator' : 'Operations Admin',
        usn: 'ASC-ADMIN-01',
        email: cleanId,
        department: 'Platform Architecture & Operations',
        year: 'Executive Lead',
        division: 'Platform Ops Chapter',
        role: assignedRole === 'super_admin' ? 'Platform Super Admin' : 'Operations Admin',
        memberTier: 'Executive Lead',
        joinDate: 'Jan 2026',
        badgeLevel: 'Obsidian Master // Tier 0',
        skills: ['Infrastructure', 'Security', 'FastAPI', 'Cloudflare'],
        bio: 'Administrative lead of ASCENT Club & ERP Platform.',
        phone: '+91 99999 88888',
        projects: [],
        uploadedProjects: [],
        certificates: [],
        events: [],
        hardwarePass: {
          allocatedHours: 999,
          assignedLab: 'All Ascent Labs',
          activeQuota: 'Executive Clearance',
        },
      };
    } else if (SAMPLE_MEMBERS[cleanId]) {
      // 2. Check sample members
      memberProfile = SAMPLE_MEMBERS[cleanId];
      if (memberProfile.memberTier === 'Core Innovator') {
        assignedRole = 'admin';
      }
    } else {
      // 3. Check stored custom registered members
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

    // 4. Fallback dynamic member profile
    if (!memberProfile) {
      memberProfile = {
        id: `ASC-${cleanId.toUpperCase()}`,
        name: cleanId.toUpperCase(),
        usn: cleanId.toUpperCase(),
        email: `${cleanId.toLowerCase()}@college.edu`,
        department: 'Computer Science & Engineering',
        year: '3rd Year (Junior)',
        division: 'Core Technology Chapter',
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
          assignedLab: 'Maker Lab',
          activeQuota: 'Workstation Access',
        },
      };
    }

    const dummyToken = `ascent_jwt_${btoa(cleanId)}_${Date.now()}`;
    api.setToken(dummyToken);
    setToken(dummyToken);

    const apiUser: ApiUser = {
      id: memberProfile.id,
      email: memberProfile.email,
      role: assignedRole,
    };

    setUser(apiUser);
    setProfile(memberProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ascent_current_profile', JSON.stringify(memberProfile));
      localStorage.setItem('ascent_auth_token', dummyToken);
      localStorage.setItem('ascent_auth_role', assignedRole);
    }
    return true;
  };

  const loginAsAdmin = (role: 'admin' | 'super_admin' = 'super_admin') => {
    const adminProfile: MemberProfile = {
      id: 'usr-admin-exec',
      name: 'Super Admin',
      usn: 'ASC-SUPERADMIN',
      email: 'admin@teamascent.in',
      department: 'Platform Architecture & Operations',
      year: 'Executive',
      division: 'Governing Council',
      role: 'Platform Super Admin',
      memberTier: 'Executive Lead',
      joinDate: 'Jan 2026',
      badgeLevel: 'Obsidian Master // Tier 0',
      skills: ['Infrastructure', 'Security', 'FastAPI', 'Cloudflare'],
      bio: 'Executive Super Administrator of ASCENT Club & ERP Platform.',
      phone: '+91 99999 88888',
      projects: [],
      uploadedProjects: [],
      certificates: [],
      events: [],
      hardwarePass: {
        allocatedHours: 999,
        assignedLab: 'All Ascent Labs',
        activeQuota: 'Executive Clearance',
      },
    };

    const tokenVal = `ascent_admin_token_${Date.now()}`;
    api.setToken(tokenVal);
    setToken(tokenVal);
    setUser({ id: 'usr-admin-exec', email: 'admin@teamascent.in', role });
    setProfile(adminProfile);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ascent_current_profile', JSON.stringify(adminProfile));
      localStorage.setItem('ascent_auth_token', tokenVal);
      localStorage.setItem('ascent_auth_role', role);
    }
  };

  const register = async (formData: RegistrationFormData): Promise<boolean> => {
    const newProfile: MemberProfile = {
      id: `ASC-2026-${formData.usn.toUpperCase().slice(-5) || 'CAND'}`,
      name: formData.name,
      usn: formData.usn.toUpperCase(),
      email: formData.email || `${formData.usn.toLowerCase()}@college.edu`,
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

    try {
      const savedReg = localStorage.getItem('ascent_registered_profiles');
      const dict: Record<string, MemberProfile> = savedReg ? JSON.parse(savedReg) : {};
      dict[newProfile.usn] = newProfile;
      localStorage.setItem('ascent_registered_profiles', JSON.stringify(dict));
    } catch (e) {
      console.error('Error persisting registration', e);
    }

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
      console.warn('Backend application sync deferred:', err);
    }

    return await login(newProfile.usn);
  };

  const resendConfirmationEmail = async (_email: string): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ascent_current_profile');
      localStorage.removeItem('ascent_auth_token');
      localStorage.removeItem('ascent_auth_role');
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
        loginAsAdmin,
        register,
        logout,
        updateProfile,
        resendConfirmationEmail,
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
