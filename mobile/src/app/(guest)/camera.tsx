/**
 * Digi — Camera Tab (Guest)
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { CameraViewfinder } from '@/components/CameraViewfinder';
import { colors, fonts, radius } from '@/theme';

export default function GuestCameraScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const session = useAuthStore((s) => s.session);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [shotsUsed, setShotsUsed] = useState(0);
  const [shotLimit, setShotLimit] = useState(24);
  const [cameraStyle, setCameraStyle] = useState('disposable');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [allowFrontCamera, setAllowFrontCamera] = useState(true);
  const [allowFlash, setAllowFlash] = useState(true);

  useEffect(() => {
    if (!eventId || !session) return;
    loadParticipantData();
  }, [eventId, session]);

  const loadParticipantData = async () => {
    try {
      // Get event settings
      const { data: settings } = await supabase
        .from('event_settings')
        .select('shot_limit_per_participant, camera_style, cooldown_seconds, allow_front_camera, allow_flash')
        .eq('event_id', eventId)
        .single();

      if (settings) {
        setShotLimit((settings as any).shot_limit_per_participant || 24);
        setCameraStyle((settings as any).camera_style || 'disposable');
        setCooldownSeconds((settings as any).cooldown_seconds || 0);
        setAllowFrontCamera((settings as any).allow_front_camera ?? true);
        setAllowFlash((settings as any).allow_flash ?? true);
      }

      // Get participant record
      const { data: participant } = await supabase
        .from('participants')
        .select('id, shots_used')
        .eq('event_id', eventId)
        .eq('user_id', session!.user.id)
        .single();

      if (participant) {
        setParticipantId((participant as any).id);
        setShotsUsed((participant as any).shots_used || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.amber} />
      </View>
    );
  }

  if (!participantId) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Unable to load camera.</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <CameraViewfinder 
        eventId={eventId}
        participantId={participantId}
        shotLimit={shotLimit}
        initialShotsUsed={shotsUsed}
        cameraStyle={cameraStyle}
        cooldownSeconds={cooldownSeconds}
        allowFrontCamera={allowFrontCamera}
        allowFlash={allowFlash}
      />
      
      <Pressable 
        style={s.albumBtn} 
        onPress={() => router.push(`/(guest)/album?eventId=${eventId}`)}
      >
        <Text style={s.albumBtnEmoji}>🖼️</Text>
        <Text style={s.albumBtnText}>Album</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, backgroundColor: colors.void, justifyContent: 'center', alignItems: 'center' },
  error: { fontFamily: fonts.heading, fontSize: 18, color: colors.coral },
  albumBtn: { position: 'absolute', top: 60, left: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.void + 'CC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, gap: 8, zIndex: 100 },
  albumBtnEmoji: { fontSize: 16 },
  albumBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.cream },
});
