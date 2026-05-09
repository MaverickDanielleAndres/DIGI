/**
 * Digi — Event Dashboard
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { colors, fonts, radius } from '@/theme';
import type { Event, Participant } from '@/types';

export default function EventDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [showQr, setShowQr] = useState(false);

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
  };

  if (!event) return <View style={s.root}><Text style={s.loading}>Loading...</Text></View>;

  const joinUrl = `digi://join/${id}`;

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
              <QRCodeDisplay value={joinUrl} size={220} />
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
  modalDesc: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  qrBox: { marginBottom: 32 },
  modalClose: { backgroundColor: colors.amber, paddingHorizontal: 32, paddingVertical: 14, borderRadius: radius.md, width: '100%', alignItems: 'center' },
  modalCloseText: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.void },
});
