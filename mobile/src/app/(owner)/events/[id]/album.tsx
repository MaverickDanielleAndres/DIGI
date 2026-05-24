/**
 * Digi — Event Album
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import type { Photo, EventSettings } from '@/types';

export default function AlbumScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    const { data: setts } = await supabase.from('event_settings').select('*').eq('event_id', id).single();
    if (setts) setSettings(setts as unknown as EventSettings);

    const { data } = await supabase.from('photos').select('*').eq('event_id', id).order('created_at', { ascending: false });
    if (data) setPhotos(data as unknown as Photo[]);
    setLoading(false);
  };

  if (loading) return <View style={s.center}><ActivityIndicator color={colors.amber} /></View>;

  const isRevealed = (p: Photo) => {
    if (p.is_revealed) return true;
    if (settings?.reveal_mode === 'instant') return true;
    if (settings?.reveal_mode === 'manual' && p.is_revealed) return true;
    if (settings?.reveal_at && new Date(settings.reveal_at).getTime() < Date.now()) return true;
    return false;
  };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Album ({photos.length})</Text>
        <Pressable onPress={loadAlbum}><Text style={s.refresh}>🔄</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={s.grid} showsVerticalScrollIndicator={false}>
        {photos.map(p => {
          const revealed = isRevealed(p);
          return (
            <View key={p.id} style={s.photoContainer}>
              <View style={[s.photo, !revealed && s.photoUnrevealed]}>
                {revealed ? (
                  <Image source={{ uri: p.storage_path }} style={s.img} resizeMode="cover" />
                ) : (
                  <Text style={s.developingText}>Developing...</Text>
                )}
              </View>
            </View>
          );
        })}
        {photos.length === 0 && (
          <Text style={s.empty}>No photos yet. Start capturing!</Text>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.void },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.smoke },
  back: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.amber },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.cream },
  refresh: { fontSize: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
  photoContainer: { width: '33.33%', padding: 2, aspectRatio: 1 },
  photo: { flex: 1, backgroundColor: colors.charcoal, borderRadius: radius.sm, overflow: 'hidden' },
  photoUnrevealed: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.smoke },
  img: { width: '100%', height: '100%' },
  developingText: { fontFamily: fonts.bodyMedium, fontSize: 10, color: colors.ash, letterSpacing: 1 },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.ash, textAlign: 'center', width: '100%', marginTop: 100 },
});
