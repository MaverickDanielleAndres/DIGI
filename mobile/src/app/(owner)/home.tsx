/**
 * Digi — Home Screen
 * 
 * Warm greeting, hero event card, past events filmstrip, quick actions.
 */
import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useEventStore } from '@/store/event.store';
import { colors, fonts, radius, spacing } from '@/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { events, fetchEvents, isLoading } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const activeEvents = events.filter((e) => e.status === 'active');
  const pastEvents = events.filter((e) => e.status === 'ended' || e.status === 'archived');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{user?.display_name || 'Creator'}</Text>
        </Animated.View>
      </View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.quickActions}>
        <Pressable
          style={styles.createButton}
          onPress={() => router.push('/(owner)/events/create')}
        >
          <Text style={styles.createIcon}>+</Text>
          <View>
            <Text style={styles.createTitle}>New Event</Text>
            <Text style={styles.createSub}>Create a shared camera</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* Active Events */}
      {activeEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LIVE NOW</Text>
          {activeEvents.map((event, index) => (
            <Animated.View key={event.id} entering={FadeInDown.delay(300 + index * 100)}>
              <Pressable
                style={styles.eventCard}
                onPress={() => router.push(`/(owner)/events/${event.id}`)}
              >
                <View style={styles.eventCardGlow} />
                <View style={styles.eventLiveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>
                  {event.event_type.replace('_', ' ')} • {event.location || 'No location'}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {events.length === 0 && !isLoading && (
        <Animated.View entering={FadeInDown.delay(300)} style={styles.empty}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>No events yet</Text>
          <Text style={styles.emptyDesc}>
            Create your first event and invite your guests to start capturing memories together.
          </Text>
        </Animated.View>
      )}

      {/* Past Events Filmstrip */}
      {pastEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEMORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filmstrip}>
            {pastEvents.map((event, index) => (
              <Animated.View key={event.id} entering={FadeInRight.delay(200 + index * 100)}>
                <Pressable
                  style={styles.filmCard}
                  onPress={() => router.push(`/(owner)/events/${event.id}`)}
                >
                  <Text style={styles.filmTitle}>{event.title}</Text>
                  <Text style={styles.filmDate}>
                    {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </Pressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.spacer} />
      <View style={styles.grain} pointerEvents="none" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.void },
  header: { paddingHorizontal: 24, paddingTop: 70, paddingBottom: 8 },
  greeting: { fontFamily: fonts.body, fontSize: 16, color: colors.parchment },
  name: { fontFamily: fonts.heading, fontSize: 28, color: colors.cream, marginTop: 4 },
  quickActions: { paddingHorizontal: 24, marginTop: 24 },
  createButton: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: colors.charcoal, borderRadius: radius.lg,
    padding: 20, borderWidth: 1, borderColor: colors.smoke, borderStyle: 'dashed',
  },
  createIcon: {
    fontFamily: fonts.heading, fontSize: 28, color: colors.amber,
    width: 48, height: 48, textAlign: 'center', lineHeight: 48,
    backgroundColor: colors.amberGlow, borderRadius: radius.md,
  },
  createTitle: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.cream },
  createSub: { fontFamily: fonts.body, fontSize: 13, color: colors.parchment, marginTop: 2 },
  section: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2,
    color: colors.amber, marginBottom: 16,
  },
  eventCard: {
    backgroundColor: colors.charcoal, borderRadius: radius.lg,
    padding: 24, borderWidth: 1, borderColor: colors.amber + '30',
    overflow: 'hidden', marginBottom: 12,
  },
  eventCardGlow: {
    position: 'absolute', top: -50, right: -50,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: colors.amberGlow,
  },
  eventLiveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.coral + '20', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start',
    marginBottom: 12,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.coral },
  liveText: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 1.5, color: colors.coral },
  eventTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.cream, marginBottom: 8 },
  eventMeta: { fontFamily: fonts.body, fontSize: 13, color: colors.parchment, textTransform: 'capitalize' },
  empty: { marginTop: 60, alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.cream, marginBottom: 8 },
  emptyDesc: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.parchment, textAlign: 'center' },
  filmstrip: { paddingRight: 24, gap: 12 },
  filmCard: {
    width: 140, backgroundColor: colors.graphite, borderRadius: radius.md,
    padding: 16, borderWidth: 1, borderColor: colors.smoke,
  },
  filmTitle: { fontFamily: fonts.headingSemiBold, fontSize: 14, color: colors.cream, marginBottom: 8 },
  filmDate: { fontFamily: fonts.body, fontSize: 12, color: colors.ash },
  spacer: { height: 100 },
  grain: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.filmGrain, zIndex: -1, pointerEvents: 'none' },
});
