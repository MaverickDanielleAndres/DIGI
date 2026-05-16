/**
 * Digi — Moderation Queue
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import type { PhotoWithDetails } from '@/types';

export default function ModerationQueueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadQueue();
  }, [id]);

  const loadQueue = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('photos')
      .select('*, uploader:participants(guest_nickname)')
      .eq('event_id', id)
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    
    if (data) {
      setPhotos(data as unknown as PhotoWithDetails[]);
    }
    setLoading(false);
  };

  const handleAction = async (photoId: string, isApproved: boolean) => {
    // Optimistic update
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    
    await supabase.from('photos').update({ is_approved: isApproved } as never).eq('id', photoId);
  };

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Moderation Queue</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.amber} style={{ marginTop: 40 }} />
      ) : photos.length === 0 ? (
        <Text style={s.empty}>The queue is empty.</Text>
      ) : (
        <View style={s.grid}>
          {photos.map((p) => (
            <View key={p.id} style={s.card}>
              <View style={s.imagePlaceholder}>
                {p.thumbnail_path ? (
                  <Text style={s.imageText}>Image: {p.thumbnail_path}</Text>
                ) : (
                  <Text style={s.imageText}>Processing...</Text>
                )}
              </View>
              <Text style={s.uploader}>By {p.uploader?.guest_nickname || 'Guest'}</Text>
              
              <View style={s.actions}>
                <Pressable style={[s.btn, s.rejectBtn]} onPress={() => handleAction(p.id, false)}>
                  <Text style={s.rejectText}>Reject</Text>
                </Pressable>
                <Pressable style={[s.btn, s.approveBtn]} onPress={() => handleAction(p.id, true)}>
                  <Text style={s.approveText}>Approve</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void, paddingHorizontal: 24 },
  header: { paddingTop: 60, marginBottom: 24 },
  back: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.amber, marginBottom: 8 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.cream },
  empty: { fontFamily: fonts.body, fontSize: 15, color: colors.ash, textAlign: 'center', marginTop: 40 },
  grid: { gap: 24 },
  card: { backgroundColor: colors.charcoal, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.smoke },
  imagePlaceholder: { height: 200, backgroundColor: colors.graphite, borderRadius: radius.sm, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  imageText: { fontFamily: fonts.body, color: colors.ash, fontSize: 12 },
  uploader: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.parchment, marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 44, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  rejectBtn: { borderColor: colors.coral, backgroundColor: colors.coral + '15' },
  rejectText: { fontFamily: fonts.headingSemiBold, fontSize: 14, color: colors.coral },
  approveBtn: { borderColor: colors.sage, backgroundColor: colors.sage + '15' },
  approveText: { fontFamily: fonts.headingSemiBold, fontSize: 14, color: colors.sage },
});
