/**
 * Digi — Event Dashboard
 */
import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, Alert, Share } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { colors, fonts, radius } from '@/theme';
import { useEventStore } from '@/store/event.store';
import type { Event, Participant } from '@/types';

export default function EventDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [qrColor, setQrColor] = useState<string>(colors.void);
  const [qrBgColor, setQrBgColor] = useState<string>(colors.cream);
  const qrRef = useRef<any>(null);
  const { duplicateEvent } = useEventStore();

  useEffect(() => {
    if (!id) return;
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    const { data: ev } = await supabase.from('events').select('*').eq('id', id).single();
    if (ev) setEvent(ev as unknown as Event);
    const { data: parts } = await supabase.from('participants').select('*').eq('event_id', id);
    if (parts) setParticipants(parts as unknown as Participant[]);
    const { count } = await supabase.from('photos').select('*', { count: 'exact', head: true }).eq('event_id', id);
    setPhotoCount(count || 0);

    const evData = ev as any;
    if (evData?.starts_at) {
      const target = new Date(evData.starts_at).getTime();
      const now = new Date().getTime();
      if (target > now) {
        setCountdown('Starts in ' + Math.ceil((target - now) / (1000 * 60 * 60 * 24)) + ' days');
      }
    }
  };

  const handleDuplicate = async () => {
    setDuplicating(true);
    const { event: newEvent, error } = await duplicateEvent(id);
    setDuplicating(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else if (newEvent) {
      router.push(`/(owner)/events/${newEvent.id}`);
    }
  };

  const handleShareQR = () => {
    if (qrRef.current) {
      qrRef.current.toDataURL((data: string) => {
        Share.share({
          url: `data:image/png;base64,${data}`,
          title: 'Join ' + event?.title,
          message: 'Scan this QR code or click the link to join: ' + joinUrl,
        });
      });
    }
  };

  if (!event) return <View style={s.root}><Text style={s.loading}>Loading...</Text></View>;

  const joinUrl = `digi://join/${id}`;

  const handleShareLink = () => {
    Share.share({
      message: `Join ${event.title} on Digi! ${joinUrl}`,
    });
  };

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backArrow}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <View style={s.statusBadge}>
          <Text style={s.statusText}>{event.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={s.title}>{event.title}</Text>
      <Text style={s.meta}>{event.event_type.replace('_',' ')} · {event.location || 'No location'}</Text>
      
      {countdown && (
        <View style={s.countdownBox}>
          <Text style={s.countdownLabel}>COUNTDOWN</Text>
          <Text style={s.countdownText}>{countdown}</Text>
        </View>
      )}

      {/* Stats */}
      <View style={s.stats}>
        <View style={s.statCard}>
          <Text style={s.statNum}>{participants.length}</Text>
          <Text style={s.statLabel}>Guests</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{photoCount}</Text>
          <Text style={s.statLabel}>Photos</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statNum}>{participants.reduce((a,p) => a + (p.shots_used||0), 0)}</Text>
          <Text style={s.statLabel}>Shots Used</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <Pressable style={s.actionBtn} onPress={() => setShowQr(true)}>
          <Text style={s.actionEmoji}>📱</Text>
          <Text style={s.actionText}>Share QR</Text>
        </Pressable>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/settings`)}>
          <Text style={s.actionEmoji}>⚙️</Text>
          <Text style={s.actionText}>Settings</Text>
        </Pressable>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/guests`)}>
          <Text style={s.actionEmoji}>👥</Text>
          <Text style={s.actionText}>Guests</Text>
        </Pressable>
      </View>
      <View style={[s.actions, { marginBottom: 32 }]}>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/album`)}>
          <Text style={s.actionEmoji}>🖼️</Text>
          <Text style={s.actionText}>Album</Text>
        </Pressable>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/queue`)}>
          <Text style={s.actionEmoji}>🛡️</Text>
          <Text style={s.actionText}>Queue</Text>
        </Pressable>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/projector`)}>
          <Text style={s.actionEmoji}>📺</Text>
          <Text style={s.actionText}>Projector</Text>
        </Pressable>
      </View>
      <View style={[s.actions, { marginBottom: 32 }]}>
        <Pressable style={s.actionBtn} onPress={() => router.push(`/(owner)/events/${id}/edit`)}>
          <Text style={s.actionEmoji}>📝</Text>
          <Text style={s.actionText}>Edit Details</Text>
        </Pressable>
        <Pressable style={[s.actionBtn, duplicating && {opacity: 0.6}]} onPress={handleDuplicate} disabled={duplicating}>
          <Text style={s.actionEmoji}>📋</Text>
          <Text style={s.actionText}>{duplicating ? 'Copying...' : 'Duplicate'}</Text>
        </Pressable>
        <View style={s.actionBtn} pointerEvents="none" />
      </View>

      {/* Gamification / Leaderboard */}
      <Text style={s.sectionTitle}>TOP PHOTOGRAPHERS</Text>
      {participants.sort((a,b) => (b.shots_used || 0) - (a.shots_used || 0)).slice(0, 3).map((p, i) => (
        <Animated.View key={p.id} entering={FadeInDown.delay(i * 60)}>
          <View style={s.guestRow}>
            <Text style={s.rankNum}>{i + 1}</Text>
            <View style={s.avatar}><Text style={s.avatarText}>{(p.guest_nickname || 'G')[0].toUpperCase()}</Text></View>
            <View style={s.guestInfo}>
              <Text style={s.guestName}>
                {p.guest_nickname || 'Guest'}
                {i === 0 && p.shots_used > 0 && ' 👑'}
              </Text>
              <Text style={s.guestMeta}>{p.role} · {p.shots_used} shots</Text>
            </View>
          </View>
        </Animated.View>
      ))}
      {participants.length === 0 && <Text style={s.emptyGuests}>No guests have joined yet.</Text>}

      <View style={{height:100}} />

      {/* QR Modal */}
      <Modal visible={showQr} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Invite Guests</Text>
            <Text style={s.modalDesc}>Have guests scan this QR code with their camera to join {event.title}.</Text>
            
            <View style={s.qrBox}>
              <QRCodeDisplay 
                ref={qrRef}
                value={joinUrl} 
                size={220} 
                fgColor={qrColor}
                bgColor={qrBgColor}
              />
            </View>

            <View style={s.qrColors}>
              <Pressable style={[s.colorDot, {backgroundColor: colors.cream}]} onPress={() => { setQrColor(colors.void); setQrBgColor(colors.cream); }} />
              <Pressable style={[s.colorDot, {backgroundColor: colors.sage}]} onPress={() => { setQrColor(colors.void); setQrBgColor(colors.sage); }} />
              <Pressable style={[s.colorDot, {backgroundColor: colors.amber}]} onPress={() => { setQrColor(colors.void); setQrBgColor(colors.amber); }} />
              <Pressable style={[s.colorDot, {backgroundColor: colors.coral}]} onPress={() => { setQrColor(colors.cream); setQrBgColor(colors.coral); }} />
            </View>

            <View style={s.modalActions}>
              <Pressable style={s.modalBtn} onPress={handleShareQR}>
                <Text style={s.modalBtnText}>Share QR Image</Text>
              </Pressable>
              <Pressable style={s.modalBtnSecondary} onPress={handleShareLink}>
                <Text style={s.modalBtnTextSecondary}>Share Link</Text>
              </Pressable>
            </View>

            <Pressable style={s.modalClose} onPress={() => setShowQr(false)}>
              <Text style={s.modalCloseText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void,paddingHorizontal:24},
  loading:{fontFamily:fonts.body,fontSize:15,color:colors.ash,textAlign:'center',marginTop:100},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingTop:60,marginBottom:16},
  backArrow:{width:44,height:44,justifyContent:'center'},
  backIcon:{fontFamily:fonts.heading,fontSize:24,color:colors.cream},
  statusBadge:{backgroundColor:colors.sage+'20',paddingHorizontal:12,paddingVertical:4,borderRadius:radius.pill},
  statusText:{fontFamily:fonts.bodySemiBold,fontSize:10,letterSpacing:1,color:colors.sage},
  title:{fontFamily:fonts.heading,fontSize:28,color:colors.cream,marginBottom:6},
  meta:{fontFamily:fonts.body,fontSize:14,color:colors.parchment,textTransform:'capitalize',marginBottom:24},
  countdownBox: { backgroundColor: colors.amber + '15', padding: 16, borderRadius: radius.md, marginBottom: 24, borderWidth: 1, borderColor: colors.amber + '50', alignItems: 'center' },
  countdownLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: colors.amber, marginBottom: 4 },
  countdownText: { fontFamily: fonts.heading, fontSize: 24, color: colors.amber },
  stats:{flexDirection:'row',gap:8,marginBottom:24},
  statCard:{flex:1,backgroundColor:colors.charcoal,borderRadius:radius.md,padding:16,alignItems:'center',borderWidth:1,borderColor:colors.smoke},
  statNum:{fontFamily:fonts.mono,fontSize:28,color:colors.amber},
  statLabel:{fontFamily:fonts.body,fontSize:11,color:colors.parchment,marginTop:4},
  actions:{flexDirection:'row',gap:8,marginBottom:24},
  actionBtn:{flex:1,backgroundColor:colors.graphite,borderRadius:radius.md,padding:16,alignItems:'center',gap:8},
  actionEmoji:{fontSize:24},
  actionText:{fontFamily:fonts.bodySemiBold,fontSize:12,color:colors.cream},
  sectionTitle:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:2,color:colors.amber,marginBottom:12},
  guestRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10,borderBottomWidth:1,borderBottomColor:colors.smoke},
  rankNum:{fontFamily:fonts.mono,fontSize:18,color:colors.ash,width:24,textAlign:'center'},
  avatar:{width:36,height:36,borderRadius:18,backgroundColor:colors.smoke,justifyContent:'center',alignItems:'center'},
  avatarText:{fontFamily:fonts.headingSemiBold,fontSize:14,color:colors.cream},
  guestInfo:{flex:1},
  guestName:{fontFamily:fonts.bodyMedium,fontSize:14,color:colors.cream},
  guestMeta:{fontFamily:fonts.body,fontSize:11,color:colors.ash,textTransform:'capitalize'},
  emptyGuests:{fontFamily:fonts.body,fontSize:14,color:colors.ash,fontStyle:'italic',marginTop:16},
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(10, 8, 6, 0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: colors.charcoal, borderRadius: radius.lg, padding: 32, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: colors.smoke },
  modalTitle: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream, marginBottom: 8 },
  modalDesc: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  qrBox: { marginBottom: 24 },
  qrColors: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.smoke },
  modalActions: { width: '100%', gap: 12, marginBottom: 24 },
  modalBtn: { backgroundColor: colors.amber, padding: 14, borderRadius: radius.md, alignItems: 'center' },
  modalBtnText: { fontFamily: fonts.headingSemiBold, fontSize: 15, color: colors.void },
  modalBtnSecondary: { backgroundColor: 'transparent', padding: 14, borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: colors.smoke },
  modalBtnTextSecondary: { fontFamily: fonts.headingSemiBold, fontSize: 15, color: colors.cream },
  modalClose: { paddingHorizontal: 32, paddingVertical: 14, width: '100%', alignItems: 'center' },
  modalCloseText: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.ash },
});
