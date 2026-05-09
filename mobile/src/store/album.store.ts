import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Photo, Reaction } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AlbumState {
  photos: Photo[];
  reactions: Record<string, Reaction[]>; // grouped by photo_id
  loading: boolean;
  channel: RealtimeChannel | null;

  loadPhotos: (eventId: string) => Promise<void>;
  loadReactions: (eventId: string) => Promise<void>;
  subscribeToRealtime: (eventId: string) => void;
  unsubscribe: () => void;
  addReaction: (reaction: Reaction) => void;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  photos: [],
  reactions: {},
  loading: true,
  channel: null,

  loadPhotos: async (eventId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ photos: data || [], loading: false });
    } catch (e) {
      console.error('Error loading photos:', e);
      set({ loading: false });
    }
  },

  loadReactions: async (eventId: string) => {
    try {
      // For large events, we might need to filter by photo IDs, but for now we fetch all
      const { data, error } = await supabase
        .from('reactions')
        .select('*, photos!inner(event_id)')
        .eq('photos.event_id', eventId);

      if (error) throw error;
      
      const reactionsMap: Record<string, Reaction[]> = {};
      data?.forEach((r: any) => {
        if (!reactionsMap[r.photo_id]) reactionsMap[r.photo_id] = [];
        reactionsMap[r.photo_id].push(r);
      });
      
      set({ reactions: reactionsMap });
    } catch (e) {
      console.error('Error loading reactions:', e);
    }
  },

  subscribeToRealtime: (eventId: string) => {
    const existingChannel = get().channel;
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase.channel(`public:event:${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` },
        (payload) => {
          const newPhoto = payload.new as Photo;
          set((state) => ({ photos: [newPhoto, ...state.photos] }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'photos', filter: `event_id=eq.${eventId}` },
        (payload) => {
          const updatedPhoto = payload.new as Photo;
          set((state) => ({
            photos: state.photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p)
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reactions' },
        (payload) => {
          const newReaction = payload.new as Reaction;
          get().addReaction(newReaction);
        }
      )
      .subscribe();

    set({ channel });
  },

  unsubscribe: () => {
    const { channel } = get();
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: null });
    }
  },

  addReaction: (reaction: Reaction) => {
    set((state) => {
      const existing = state.reactions[reaction.photo_id] || [];
      // Prevent duplicates if already present
      if (existing.some(r => r.id === reaction.id)) return state;
      return {
        reactions: {
          ...state.reactions,
          [reaction.photo_id]: [...existing, reaction],
        }
      };
    });
  }
}));
