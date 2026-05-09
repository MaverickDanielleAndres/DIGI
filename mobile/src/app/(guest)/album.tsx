/**
 * Digi — Album Tab (Guest)
 */
import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAlbumStore } from '@/store/album.store';
import { PhotoGrid } from '@/components/PhotoGrid';
import { RevealCountdown } from '@/components/RevealCountdown';
import { PhotoViewerModal } from '@/components/PhotoViewerModal';
import { colors, fonts } from '@/theme';
import type { Photo, EventSettings } from '@/types';

export default function GuestAlbumScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  const [settings, setSettings] = useState<EventSettings | null>(null);
  
  const photos = useAlbumStore((s) => s.photos);
  const loadPhotos = useAlbumStore((s) => s.loadPhotos);
  const loadReactions = useAlbumStore((s) => s.loadReactions);
  const subscribeToRealtime = useAlbumStore((s) => s.subscribeToRealtime);
  const unsubscribe = useAlbumStore((s) => s.unsubscribe);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [forceRevealed, setForceRevealed] = useState(false);

  useEffect(() => {
    if (eventId) {
      // Fetch settings to know reveal rules
      supabase.from('event_settings').select('*').eq('event_id', eventId).single()
        .then(({ data }) => { if (data) setSettings(data as EventSettings); });

      loadPhotos(eventId);
      loadReactions(eventId);
      subscribeToRealtime(eventId);
    }
    return () => unsubscribe();
  }, [eventId]);

  const isRevealed = useMemo(() => {
    if (forceRevealed) return true;
    if (settings?.reveal_mode === 'instant') return true;
    if (settings?.reveal_mode === 'delayed' && settings.reveal_at) {
      return new Date().getTime() >= new Date(settings.reveal_at).getTime();
    }
    return false;
  }, [settings, forceRevealed]);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Camera</Text>
        </Pressable>
        <Text style={s.title}>Shared Album</Text>
      </View>

      {!isRevealed && settings?.reveal_at && (
        <Animated.View entering={FadeInDown}>
          <RevealCountdown 
            targetDate={settings.reveal_at} 
            onComplete={() => setForceRevealed(true)} 
          />
        </Animated.View>
      )}

      <PhotoGrid 
        photos={photos} 
        isRevealed={isRevealed} 
        onPhotoPress={(p) => {
          if (isRevealed || p.is_revealed) setSelectedPhoto(p);
        }} 
      />

      <PhotoViewerModal 
        photo={selectedPhoto} 
        eventId={eventId!}
        onClose={() => setSelectedPhoto(null)} 
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void},
  header:{flexDirection:'row',alignItems:'center',paddingHorizontal:24,paddingTop:60,paddingBottom:16},
  backBtn:{marginRight:16},
  backText:{fontFamily:fonts.bodySemiBold,color:colors.amber,fontSize:14},
  title:{fontFamily:fonts.heading,fontSize:24,color:colors.cream},
});
