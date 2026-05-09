/**
 * Digi — Auth Store (Zustand)
 * 
 * Manages authentication state, session persistence,
 * and user profile for the entire app.
 */
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;

  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signInAnonymously: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  isOnboarded: false,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboarded: (isOnboarded) => set({ isOnboarded }),

  signInWithEmail: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      await get().fetchProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error };

      // Create user profile
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          display_name: displayName,
          account_type: 'personal',
          plan: 'free',
        } as any);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signInAnonymously: async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) return { error };
      if (data.user) {
        await supabase.from('users').insert({
          id: data.user.id,
          account_type: 'personal',
          plan: 'free',
        } as any);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  fetchProfile: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      set({ user: profile as unknown as User });
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

      if (session?.user) {
        await get().fetchProfile();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session });
        if (session?.user) {
          await get().fetchProfile();
        } else {
          set({ user: null });
        }
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
