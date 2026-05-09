/**
 * Digi — Events Tab (list view)
 */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useEventStore } from '@/store/event.store';
import { colors, fonts, radius } from '@/theme';

export default function EventsTab() {
  const router = useRouter();
  const { events, fetchEvents } = useEventStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchEvents(); }, []);

  const filtered = filter === 'all' ? events : events.filter((e) => e.status === filter);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>Events</Text>
        <Pressable style={s.addBtn} onPress={() => router.push('/(owner)/events/create')}>
          <Text style={s.addText}>+ New</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {['all','active','draft','ended'].map((f) => (
          <Pressable key={f} style={[s.chip, filter===f && s.chipOn]} onPress={() => setFilter(f)}>
            <Text style={[s.chipTxt, filter===f && s.chipTxtOn]}>{f.toUpperCase()}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.list}>
        {filtered.map((ev, i) => (
          <Animated.View key={ev.id} entering={FadeInDown.delay(i*80)}>
            <Pressable style={s.row} onPress={() => router.push(`/(owner)/events/${ev.id}`)}>
              <View style={{flex:1}}>
                <Text style={s.evTitle}>{ev.title}</Text>
                <Text style={s.evSub}>{ev.event_type.replace('_',' ')} · {new Date(ev.created_at).toLocaleDateString()}</Text>
              </View>
              <View style={[s.badge,{backgroundColor:(ev.status==='active'?colors.sage:colors.ash)+'20'}]}>
                <Text style={[s.badgeTxt,{color:ev.status==='active'?colors.sage:colors.ash}]}>{ev.status.toUpperCase()}</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
      {filtered.length===0 && <Text style={s.empty}>No events found</Text>}
      <View style={{height:100}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:24,paddingTop:70,paddingBottom:16},
  title:{fontFamily:fonts.heading,fontSize:28,color:colors.cream},
  addBtn:{backgroundColor:colors.amber,paddingHorizontal:16,paddingVertical:8,borderRadius:radius.pill},
  addText:{fontFamily:fonts.headingSemiBold,fontSize:13,color:colors.void},
  chips:{paddingHorizontal:24,gap:8,marginBottom:20},
  chip:{paddingHorizontal:16,paddingVertical:8,borderRadius:radius.pill,backgroundColor:colors.charcoal,borderWidth:1,borderColor:colors.smoke},
  chipOn:{backgroundColor:colors.amber+'20',borderColor:colors.amber},
  chipTxt:{fontFamily:fonts.bodySemiBold,fontSize:13,color:colors.parchment},
  chipTxtOn:{color:colors.amber},
  list:{paddingHorizontal:24,gap:8},
  row:{flexDirection:'row',alignItems:'center',backgroundColor:colors.charcoal,borderRadius:radius.md,padding:16,borderWidth:1,borderColor:colors.smoke},
  evTitle:{fontFamily:fonts.headingSemiBold,fontSize:16,color:colors.cream,marginBottom:4},
  evSub:{fontFamily:fonts.body,fontSize:12,color:colors.parchment,textTransform:'capitalize'},
  badge:{paddingHorizontal:10,paddingVertical:4,borderRadius:radius.pill},
  badgeTxt:{fontFamily:fonts.bodySemiBold,fontSize:10,letterSpacing:1},
  empty:{fontFamily:fonts.body,fontSize:15,color:colors.ash,textAlign:'center',marginTop:60},
});
