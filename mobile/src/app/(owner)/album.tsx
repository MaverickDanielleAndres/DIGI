/**
 * Digi — Album Tab
 */
import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEventStore } from '@/store/event.store';
import { useAlbumStore } from '@/store/album.store';
import { PhotoGrid } from '@/components/PhotoGrid';
import { RevealCountdown } from '@/components/RevealCountdown';
import { PhotoViewerModal } from '@/components/PhotoViewerModal';
import { colors, fonts, radius } from '@/theme';
import type { Photo } from '@/types';

export default function AlbumTab() {
  const currentEvent = useEventStore((s) => s.currentEvent);
  const currentSettings = useEventStore((s) => s.currentSettings);
  
  const photos = useAlbumStore((s) => s.photos);
  const loadPhotos = useAlbumStore((s) => s.loadPhotos);
  const loadReactions = useAlbumStore((s) => s.loadReactions);
  const subscribeToRealtime = useAlbumStore((s) => s.subscribeToRealtime);
  const unsubscribe = useAlbumStore((s) => s.unsubscribe);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [forceRevealed, setForceRevealed] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      loadPhotos(currentEvent.id);
      loadReactions(currentEvent.id);
      subscribeToRealtime(currentEvent.id);
    }
    return () => unsubscribe();
  }, [currentEvent?.id]);

  const isRevealed = useMemo(() => {
    if (forceRevealed) return true;
    if (currentSettings?.reveal_mode === 'instant') return true;
    if (currentSettings?.reveal_mode === 'delayed' && currentSettings.reveal_at) {
      return new Date().getTime() >= new Date(currentSettings.reveal_at).getTime();
    }
    return false;
  }, [currentSettings, forceRevealed]);

  if (!currentEvent) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyEmoji}>🖼️</Text>
        <Text style={s.emptyTitle}>No album yet</Text>
        <Text style={s.emptyDesc}>Join or create an event to see the shared album.</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Album</Text>
        <Text style={s.sub}>{currentEvent.title}</Text>
      </View>

      {!isRevealed && currentSettings?.reveal_at && (
        <Animated.View entering={FadeInDown}>
          <RevealCountdown 
            targetDate={currentSettings.reveal_at} 
            onComplete={() => setForceRevealed(true)} 
          />
        </Animated.View>
      )}

      {/* Realtime Grid */}
      <PhotoGrid 
        photos={photos} 
        isRevealed={isRevealed} 
        onPhotoPress={(p) => {
          if (isRevealed || p.is_revealed) setSelectedPhoto(p);
        }} 
      />

      <PhotoViewerModal 
        photo={selectedPhoto} 
        eventId={currentEvent.id}
        onClose={() => setSelectedPhoto(null)} 
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void},
  header:{paddingHorizontal:24,paddingTop:70,paddingBottom:16},
  title:{fontFamily:fonts.heading,fontSize:28,color:colors.cream},
  sub:{fontFamily:fonts.body,fontSize:14,color:colors.parchment,marginTop:4},
  empty:{flex:1,backgroundColor:colors.void,justifyContent:'center',alignItems:'center',paddingHorizontal:40},
  emptyEmoji:{fontSize:56,marginBottom:16},
  emptyTitle:{fontFamily:fonts.heading,fontSize:22,color:colors.cream,marginBottom:8},
  emptyDesc:{fontFamily:fonts.body,fontSize:14,lineHeight:22,color:colors.parchment,textAlign:'center'},
});
