"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useAuth — authentication hook
//
// Provides the current user session and auth actions (sign in / sign up / sign out).
// Wraps the Supabase browser client so components stay decoupled from Supabase.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface AuthState {
  /** Supabase user object. null while loading or unauthenticated. */
  user: User | null;
  /** Supabase session object. null while loading or unauthenticated. */
  session: Session | null;
  /** True while the initial session check is in progress. */
  isLoading: boolean;
  /** True when there is an authenticated session. */
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Subscribe to auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}
