import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fonts, radius, textStyles } from '@/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { Archive, Play, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

interface VaultEvent {
  id: string;
  title: string;
  cover_signed_url: string;
  ends_at: string;
}

export default function MemoryVaultScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pastEvents, setPastEvents] = useState<VaultEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPastEvents() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, cover_signed_url, ends_at,
          participants!inner(user_id)
        `)
        .eq('participants.user_id', user.id)
        .lt('ends_at', new Date().toISOString())
        .order('ends_at', { ascending: false });
        
      if (!error && data) {
        setPastEvents(data as any);
      }
      setIsLoading(false);
    }
    
    fetchPastEvents();
  }, [user]);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backButton}>
          <ChevronLeft color={colors.cream} size={28} />
        </Pressable>
        <Text style={s.headerTitle}>Memory Vault</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={s.scrollContent}>
        <View style={s.hero}>
          <Archive color={colors.amber} size={32} style={{ marginBottom: 12 }} />
          <Text style={s.heroTitle}>Your Past Events</Text>
          <Text style={s.heroSubtitle}>Relive the memories and watch AI-generated recaps from events you've attended.</Text>
        </View>

        {isLoading ? (
          <Text style={s.loadingText}>Unlocking vault...</Text>
        ) : pastEvents.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>You haven't attended any events that have ended yet.</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {pastEvents.map((event, index) => (
              <Animated.View key={event.id} entering={FadeInDown.delay(index * 100)}>
                <Pressable
                  style={s.card}
                  onPress={() => router.push(`/(shared)/album/${event.id}` as any)}
                >
                  <Image
                    source={{ uri: event.cover_signed_url }}
                    style={s.cardImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={s.cardOverlay}>
                    <Text style={s.cardTitle} numberOfLines={1}>{event.title}</Text>
                    <Text style={s.cardDate}>
                      {new Date(event.ends_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  <Pressable style={s.playButton} onPress={() => {
                    // Logic to open recap slideshow
                    console.log('Play recap for', event.id);
                  }}>
                    <Play color={colors.void} size={16} fill={colors.void} />
                  </Pressable>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.void },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { ...textStyles.h3, color: colors.cream },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  hero: { alignItems: 'center', marginVertical: 32 },
  heroTitle: { ...textStyles.h2, color: colors.cream, marginBottom: 8 },
  heroSubtitle: { ...textStyles.body, color: colors.parchment, textAlign: 'center', paddingHorizontal: 16 },
  loadingText: { ...textStyles.body, color: colors.amber, textAlign: 'center', marginTop: 40 },
  emptyState: { padding: 32, alignItems: 'center', backgroundColor: colors.graphite, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.smoke, marginTop: 24 },
  emptyText: { ...textStyles.body, color: colors.parchment, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: { width: CARD_WIDTH, aspectRatio: 3/4, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.graphite },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, paddingTop: 32, backgroundColor: 'rgba(10,8,6,0.8)' },
  cardTitle: { ...textStyles.h3, color: colors.cream, fontSize: 16 },
  cardDate: { ...textStyles.micro, color: colors.parchment, marginTop: 4 },
  playButton: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' }
});
