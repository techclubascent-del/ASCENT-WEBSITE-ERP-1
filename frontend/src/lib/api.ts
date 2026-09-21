/**
 * Central API Client for ASCENT
 * Communicates with FastAPI backend (/api/v1)
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  'http://localhost:8000/api/v1';

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string | null;
  created_by?: string;
  created_at?: string;
}

export interface ApiOpportunity {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'closed';
  deadline: string | null;
  published_at: string | null;
  created_by?: string;
  created_at?: string;
}

export interface ApiApplication {
  id: string;
  opportunity_id: string;
  user_id?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  answers: Record<string, string>;
  submitted_at: string | null;
  created_at?: string;
}

export interface ApiCertificate {
  id: string;
  user_id: string;
  title: string;
  issued_by: string | null;
  url: string | null;
  issued_at: string;
  created_at?: string;
}

export interface ApiAttendance {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  marked_at: string;
  created_at?: string;
}

export interface ApiHardwarePass {
  id: string;
  user_id: string;
  assigned_lab: string;
  active_quota: string;
  allocated_hours: number;
  status: string;
  created_at: string;
}

export interface ApiUser {
  id: string;
  email: string;
  role: 'member' | 'admin' | 'super_admin';
}

export interface ApiProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('ascent_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('ascent_auth_token', token);
      } else {
        localStorage.removeItem('ascent_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      if (!res.ok) {
        let errorDetail = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errorJson = await res.json();
          if (errorJson.detail) {
            errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
          }
        } catch {
          // ignore non-json error responses
        }
        throw new Error(errorDetail);
      }

      return (await res.json()) as T;
    } catch (err: any) {
      // Re-throw so callers can handle or fallback gracefully
      throw err;
    }
  }

  // Health
  health = {
    check: () => this.request<{ status: string }>('/health'),
  };

  // Events
  events = {
    list: () => this.request<ApiEvent[]>('/events'),
    create: (data: Omit<ApiEvent, 'id' | 'created_by' | 'created_at'>) =>
      this.request<ApiEvent>('/events', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Opportunities
  opportunities = {
    list: () => this.request<ApiOpportunity[]>('/opportunities'),
    get: (id: string) => this.request<ApiOpportunity>(`/opportunities/${id}`),
    create: (data: Partial<ApiOpportunity>) =>
      this.request<ApiOpportunity>('/opportunities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Applications
  applications = {
    list: () => this.request<ApiApplication[]>('/applications'),
    create: (data: { opportunity_id: string; answers: Record<string, string> }) =>
      this.request<ApiApplication>('/applications', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ApiApplication>) =>
      this.request<ApiApplication>(`/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // Certificates
  certificates = {
    list: () => this.request<ApiCertificate[]>('/certificates'),
    create: (data: Omit<ApiCertificate, 'id' | 'created_at'>) =>
      this.request<ApiCertificate>('/certificates', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Attendance
  attendance = {
    list: () => this.request<ApiAttendance[]>('/attendance'),
    create: (data: Omit<ApiAttendance, 'id' | 'marked_at' | 'created_at'>) =>
      this.request<ApiAttendance>('/attendance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // Users
  users = {
    me: () => this.request<ApiUser>('/users/me'),
    getProfile: () => this.request<ApiProfile>('/users/me/profile'),
    updateProfile: (userId: string, data: Partial<ApiProfile>) =>
      this.request<ApiProfile>(`/users/${userId}/profile`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    list: () => this.request<ApiUser[]>('/users'),
  };

  // Hardware
  hardware = {
    getMyPass: () => this.request<ApiHardwarePass>('/hardware/me'),
    requestPass: (data: Partial<ApiHardwarePass>) =>
      this.request<ApiHardwarePass>('/hardware', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export const api = new ApiClient();
