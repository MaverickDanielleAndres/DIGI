/**
 * Digi — Event Store (Zustand)
 * 
 * Manages the current event context and event creation wizard state.
 */
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Event, EventSettings, EventInsert, EventSettingsInsert, EventType, CameraStyle, RevealMode, EventVisibility } from '@/types';

interface EventCreationWizard {
  step: number;
  title: string;
  description: string;
  eventType: EventType;
  visibility: EventVisibility;
  startsAt: string | null;
  endsAt: string | null;
  location: string;
  shotLimit: number;
  cameraStyle: CameraStyle;
  revealMode: RevealMode;
  revealAt: string | null;
  coverPhotoUri: string | null;
  maxParticipants: number | null;
}

interface EventState {
  currentEvent: Event | null;
  currentSettings: EventSettings | null;
  events: Event[];
  isLoading: boolean;

  // Wizard
  wizard: EventCreationWizard;

  // Actions
  setCurrentEvent: (event: Event | null) => void;
  setCurrentSettings: (settings: EventSettings | null) => void;
  setEvents: (events: Event[]) => void;
  setLoading: (loading: boolean) => void;

  // Wizard actions
  setWizardStep: (step: number) => void;
  updateWizard: (updates: Partial<EventCreationWizard>) => void;
  resetWizard: () => void;

  // API actions
  fetchEvents: () => Promise<void>;
  createEvent: () => Promise<{ event: Event | null; error: Error | null }>;
  updateEvent: (id: string, updates: Partial<Event>) => Promise<{ error: Error | null }>;
  endEvent: (id: string) => Promise<{ error: Error | null }>;
}

const defaultWizard: EventCreationWizard = {
  step: 0,
  title: '',
  description: '',
  eventType: 'custom',
  visibility: 'private',
  startsAt: null,
  endsAt: null,
  location: '',
  shotLimit: 24,
  cameraStyle: 'disposable',
  revealMode: 'end_of_event',
  revealAt: null,
  coverPhotoUri: null,
  maxParticipants: null,
};

export const useEventStore = create<EventState>((set, get) => ({
  currentEvent: null,
  currentSettings: null,
  events: [],
  isLoading: false,
  wizard: { ...defaultWizard },

  setCurrentEvent: (currentEvent) => set({ currentEvent }),
  setCurrentSettings: (currentSettings) => set({ currentSettings }),
  setEvents: (events) => set({ events }),
  setLoading: (isLoading) => set({ isLoading }),

  setWizardStep: (step) => set((s) => ({ wizard: { ...s.wizard, step } })),
  updateWizard: (updates) => set((s) => ({ wizard: { ...s.wizard, ...updates } })),
  resetWizard: () => set({ wizard: { ...defaultWizard } }),

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) set({ events: data as unknown as Event[] });
    } finally {
      set({ isLoading: false });
    }
  },

  createEvent: async () => {
    const { wizard } = get();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { event: null, error: new Error('Not authenticated') };

      const { data: rawEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          owner_id: session.user.id,
          title: wizard.title,
          description: wizard.description || null,
          event_type: wizard.eventType,
          visibility: wizard.visibility,
          starts_at: wizard.startsAt,
          ends_at: wizard.endsAt,
          location: wizard.location || null,
          status: 'active',
        } as any)
        .select()
        .single();

      if (eventError || !rawEvent) return { event: null, error: eventError || new Error('Failed to create event') };
      
      const event = rawEvent as any;

      // Create event settings
      await supabase.from('event_settings').insert({
        event_id: event.id,
        shot_limit_per_participant: wizard.shotLimit,
        camera_style: wizard.cameraStyle,
        reveal_mode: wizard.revealMode,
        reveal_at: wizard.revealAt,
        max_participants: wizard.maxParticipants,
      } as any);

      // Create default shared album
      await supabase.from('albums').insert({
        event_id: event.id,
        name: 'Shared Album',
        type: 'shared',
        layout: 'timeline',
        created_by: session.user.id,
      } as any);

      // Add owner as participant
      await supabase.from('participants').insert({
        event_id: event.id,
        user_id: session.user.id,
        role: 'owner',
      } as any);

      // Generate QR code
      const codeData = `digi://join/${event.id}`;
      await supabase.from('qr_codes').insert({
        event_id: event.id,
        type: 'dynamic',
        code_data: codeData,
      } as any);

      const typedEvent = event as unknown as Event;
      set((s) => ({ events: [typedEvent, ...s.events], currentEvent: typedEvent }));
      get().resetWizard();
      return { event: typedEvent, error: null };
    } catch (error) {
      return { event: null, error: error as Error };
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates as never)
        .eq('id', id);
      if (error) return { error };

      set((s) => ({
        events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        currentEvent: s.currentEvent?.id === id ? { ...s.currentEvent, ...updates } : s.currentEvent,
      }));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  endEvent: async (id) => {
    return get().updateEvent(id, { status: 'ended' } as any);
  },
}));
