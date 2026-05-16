/**
 * Digi — Projector Mode
 * Designed for tablets/TVs to show a live stream of photos.
 */
import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useEventStore } from '@/store/event.store';
import { useAlbumStore } from '@/store/album.store';
import { supabase } from '@/lib/supabase';
import { colors, fonts } from '@/theme';

export default function ProjectorModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const currentEvent = useEventStore((s) => s.currentEvent);
  const photos = useAlbumStore((s) => s.photos);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // Auto-advance photos
  useEffect(() => {
    if (photos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000); // Change photo every 5 seconds

    return () => clearInterval(interval);
  }, [photos.length]);

  // Load signed url for current photo
  useEffect(() => {
    if (photos.length === 0) return;
    
    let isActive = true;
    const photo = photos[currentIndex];
    
    if (!photo.is_revealed) {
      setSignedUrl(null);
      return;
    }

    const loadUrl = async () => {
      const { data } = await supabase.storage.from('photos').createSignedUrl(photo.storage_path, 3600);
      if (isActive && data?.signedUrl) {
        setSignedUrl(data.signedUrl);
      }
    };
    
    loadUrl();
    return () => { isActive = false; };
  }, [currentIndex, photos]);

  if (!currentEvent) return null;

  return (
    <View style={s.root}>
      <Pressable style={s.exitArea} onPress={() => router.back()}>
        <Text style={s.exitText}>Exit</Text>
      </Pressable>

      <View style={s.container}>
        {photos.length === 0 ? (
          <Text style={s.empty}>Waiting for memories...</Text>
        ) : signedUrl ? (
          <Animated.View key={signedUrl} entering={FadeIn.duration(1000)} exiting={FadeOut.duration(1000)} style={s.imageWrapper}>
            <Image
              source={{ uri: signedUrl }}
              style={s.image}
              contentFit="contain"
            />
          </Animated.View>
        ) : (
          <Animated.View key="mystery" entering={ZoomIn} style={s.mysteryBox}>
            <Text style={s.mysteryEmoji}>⏳</Text>
            <Text style={s.mysteryText}>A new memory is developing...</Text>
          </Animated.View>
        )}
      </View>

      <View style={s.footer}>
        <Text style={s.eventTitle}>{currentEvent.title}</Text>
        <Text style={s.joinPrompt}>Join at digi.app/join/{id}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' }, // Pure black for projector
  exitArea: { position: 'absolute', top: 40, right: 40, zIndex: 100, padding: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  exitText: { color: colors.ash, fontFamily: fonts.bodySemiBold },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  imageWrapper: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  empty: { fontFamily: fonts.heading, fontSize: 32, color: colors.ash },
  mysteryBox: { justifyContent: 'center', alignItems: 'center', padding: 60, backgroundColor: colors.charcoal, borderRadius: 20, borderWidth: 1, borderColor: colors.smoke },
  mysteryEmoji: { fontSize: 64, marginBottom: 24, opacity: 0.8 },
  mysteryText: { fontFamily: fonts.body, fontSize: 24, color: colors.parchment },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  eventTitle: { fontFamily: fonts.display, fontSize: 48, color: colors.cream },
  joinPrompt: { fontFamily: fonts.mono, fontSize: 24, color: colors.amber, backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 8 },
});
