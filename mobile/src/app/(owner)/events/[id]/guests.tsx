/**
 * Digi — Guest Management
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import type { Participant } from '@/types';

export default function GuestsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [guests, setGuests] = useState<Participant[]>([]);

  useEffect(() => {
    if (!id) return;
    loadGuests();
  }, [id]);

  const loadGuests = () => {
    supabase.from('participants').select('*').eq('event_id', id).then(({ data }) => {
      if (data) setGuests(data as unknown as Participant[]);
    });
  };

  const handleManage = (guest: Participant) => {
    Alert.alert('Manage Guest', `Manage ${guest.guest_nickname || 'Guest'}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: guest.role === 'co_host' ? 'Demote to Guest' : 'Make Co-host', onPress: async () => {
        const newRole = guest.role === 'co_host' ? 'participant' : 'co_host';
        await supabase.from('participants').update({ role: newRole } as never).eq('id', guest.id);
        loadGuests();
      }},
      { text: guest.role === 'viewer' ? 'Allow Camera' : 'Make Viewer-Only', onPress: async () => {
        const newRole = guest.role === 'viewer' ? 'participant' : 'viewer';
        await supabase.from('participants').update({ role: newRole } as never).eq('id', guest.id);
        loadGuests();
      }},
      { text: 'Remove', style: 'destructive', onPress: async () => {
        await supabase.from('participants').update({ is_removed: true } as never).eq('id', guest.id);
        loadGuests();
      }},
      { text: 'Ban', style: 'destructive', onPress: async () => {
        await supabase.from('participants').update({ is_banned: true } as never).eq('id', guest.id);
        loadGuests();
      }},
    ]);
  };

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Guests ({guests.length})</Text>
      </View>
      {guests.map((g, i) => (
        <Animated.View key={g.id} entering={FadeInDown.delay(i * 60)}>
          <View style={s.row}>
            <View style={s.avatar}><Text style={s.avatarText}>{(g.guest_nickname || 'G')[0].toUpperCase()}</Text></View>
            <View style={{flex:1}}>
              <Text style={[s.name, g.is_banned && s.bannedText, g.is_removed && s.removedText]}>
                {g.guest_nickname || 'Guest'}
                {g.is_banned && ' (Banned)'}
                {g.is_removed && ' (Removed)'}
              </Text>
              <Text style={s.meta}>{g.role} · {g.shots_used} shots</Text>
            </View>
            {g.role !== 'owner' && (
              <Pressable style={s.removeBtn} onPress={() => handleManage(g)}>
                <Text style={s.removeText}>⚙️</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      ))}
      <View style={{height:100}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void,paddingHorizontal:24},
  header:{paddingTop:60,marginBottom:24},
  back:{fontFamily:fonts.bodyMedium,fontSize:14,color:colors.amber,marginBottom:8},
  title:{fontFamily:fonts.heading,fontSize:28,color:colors.cream},
  row:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.smoke},
  avatar:{width:40,height:40,borderRadius:20,backgroundColor:colors.smoke,justifyContent:'center',alignItems:'center'},
  avatarText:{fontFamily:fonts.headingSemiBold,fontSize:16,color:colors.cream},
  name:{fontFamily:fonts.bodyMedium,fontSize:15,color:colors.cream},
  bannedText: { color: colors.coral, textDecorationLine: 'line-through' },
  removedText: { color: colors.ash, fontStyle: 'italic' },
  meta:{fontFamily:fonts.body,fontSize:12,color:colors.ash,textTransform:'capitalize'},
  removeBtn:{width:36,height:36,borderRadius:18,backgroundColor:colors.charcoal,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:colors.smoke},
  removeText:{fontFamily:fonts.heading,fontSize:14,color:colors.cream},
});
