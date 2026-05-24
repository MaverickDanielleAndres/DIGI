/**
 * Digi — Guest Join Flow
 */
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { useEventStore } from '@/store/event.store';
import { registerForPushNotificationsAsync } from '@/lib/useNotifications';
import { colors, fonts, radius } from '@/theme';
import type { Event } from '@/types';

export default function GuestJoinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session, signInAnonymously } = useAuthStore();
  const { setCurrentEvent, setCurrentSettings } = useEventStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadEventDetails();
  }, [id]);

  const loadEventDetails = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error || !data) {
        Alert.alert('Event not found', 'This invitation link might be invalid or expired.');
        return;
      }
      setEvent(data as unknown as Event);
      
      const { data: settings } = await supabase.from('event_settings').select('*').eq('event_id', id).single();
      
      setCurrentEvent(data as unknown as Event);
      if (settings) setCurrentSettings(settings as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setIsJoining(true);
    
    // Ensure we have an auth session (anonymous or registered)
    if (!session) {
      const { error } = await signInAnonymously();
      if (error) {
        Alert.alert('Error', 'Failed to authenticate.');
        setIsJoining(false);
        return;
      }
    }

    // Get current user ID (might have just been created anonymously)
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const userId = currentSession?.user?.id;

    if (!userId) {
       Alert.alert('Error', 'Authentication missing.');
       setIsJoining(false);
       return;
    }

    // Join the event as a participant
    try {
      const { error } = await supabase.from('participants').insert({
        event_id: id,
        user_id: userId,
        guest_nickname: nickname.trim() || 'Guest',
        role: 'participant'
      } as any);

      // Ignore uniqueness constraint error if they already joined
      if (error && error.code !== '23505') {
        throw error;
      }

      // Ask for push notification opt-in
      Alert.alert(
        'Don\'t miss the reveal! 📸',
        'Want to get notified when the photos unlock?',
        [
          {
            text: 'Skip',
            style: 'cancel',
            onPress: () => router.replace(`/(guest)/camera?eventId=${id}`)
          },
          {
            text: 'Yes, notify me',
            onPress: async () => {
              const token = await registerForPushNotificationsAsync();
              if (token) {
                // optionally save push token to supabase user profile
                await supabase.from('users').update({ push_token: token }).eq('id', userId);
              }
              router.replace(`/(guest)/camera?eventId=${id}`);
            }
          }
        ]
      );

    } catch (e: any) {
      Alert.alert('Error joining', e.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.amber} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(100)} style={styles.card}>
          <Text style={styles.tag}>YOU'RE INVITED</Text>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>{event.event_type.replace('_', ' ')} • {new Date(event.created_at).toLocaleDateString()}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>WHAT SHOULD WE CALL YOU?</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Guest Nickname"
            placeholderTextColor={colors.ash}
            autoCapitalize="words"
            maxLength={30}
          />

          <Pressable 
            style={[styles.btn, isJoining && styles.btnDisabled]} 
            onPress={handleJoin}
            disabled={isJoining}
          >
            <Text style={styles.btnText}>{isJoining ? 'Joining...' : 'Join Event'}</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
      <View style={styles.grain} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.void },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.void },
  errorText: { fontFamily: fonts.heading, fontSize: 20, color: colors.coral },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: colors.charcoal, borderRadius: radius.lg, padding: 32, borderWidth: 1, borderColor: colors.amber + '40' },
  tag: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2, color: colors.amber, marginBottom: 12 },
  title: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, color: colors.cream, marginBottom: 8, letterSpacing: -0.64 },
  meta: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment, textTransform: 'capitalize' },
  divider: { height: 1, backgroundColor: colors.smoke, marginVertical: 24 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 1.5, color: colors.parchment, marginBottom: 12 },
  input: { backgroundColor: colors.graphite, borderWidth: 1, borderColor: colors.smoke, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, fontFamily: fonts.body, fontSize: 15, color: colors.cream, marginBottom: 24 },
  btn: { backgroundColor: colors.amber, height: 56, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.void },
  grain: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.filmGrain, zIndex: 10, pointerEvents: 'none' },
});
