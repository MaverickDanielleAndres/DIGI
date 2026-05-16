/**
 * Digi — Camera Tab (Owner)
 */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { useEventStore } from '@/store/event.store';
import { CameraViewfinder } from '@/components/CameraViewfinder';
import { colors, fonts, radius } from '@/theme';

export default function CameraTab() {
  const router = useRouter();
  const currentEvent = useEventStore((s) => s.currentEvent);
  const currentSettings = useEventStore((s) => s.currentSettings);
  const session = useAuthStore((s) => s.session);

  if (!currentEvent) {
    return (
      <View style={s.noEvent}>
        <Text style={s.noEventEmoji}>📷</Text>
        <Text style={s.noEventTitle}>No active event</Text>
        <Text style={s.noEventDesc}>Join or create an event to start capturing memories.</Text>
        <Pressable style={s.noEventBtn} onPress={() => router.push('/(owner)/events/create')}>
          <Text style={s.noEventBtnText}>Create Event</Text>
        </Pressable>
      </View>
    );
  }

  // Find the owner's participant record (or pass a default if they are the owner)
  // For simplicity, we assume the owner's participant ID is the session user ID 
  // (In a real scenario, we would fetch their specific participant.id)
  const participantId = session?.user.id || 'anonymous';
  const shotLimit = currentSettings?.shot_limit_per_participant || 24;
  const cameraStyle = currentSettings?.camera_style || 'disposable';
  const cooldownSeconds = currentSettings?.cooldown_seconds || 0;
  const allowFrontCamera = currentSettings?.allow_front_camera ?? true;
  const allowFlash = currentSettings?.allow_flash ?? true;

  return (
    <CameraViewfinder 
      eventId={currentEvent.id}
      participantId={participantId}
      shotLimit={shotLimit}
      initialShotsUsed={0} // Typically fetched from participant record
      cameraStyle={cameraStyle}
      cooldownSeconds={cooldownSeconds}
      allowFrontCamera={allowFrontCamera}
      allowFlash={allowFlash}
    />
  );
}

const s = StyleSheet.create({
  noEvent:{flex:1,backgroundColor:colors.void,justifyContent:'center',alignItems:'center',paddingHorizontal:40},
  noEventEmoji:{fontSize:56,marginBottom:16},
  noEventTitle:{fontFamily:fonts.heading,fontSize:22,color:colors.cream,marginBottom:8},
  noEventDesc:{fontFamily:fonts.body,fontSize:14,lineHeight:22,color:colors.parchment,textAlign:'center',marginBottom:24},
  noEventBtn:{backgroundColor:colors.amber,paddingHorizontal:24,paddingVertical:14,borderRadius:radius.md},
  noEventBtnText:{fontFamily:fonts.headingSemiBold,fontSize:15,color:colors.void},
});
