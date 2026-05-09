/**
 * Digi — Event Settings
 */
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, radius } from '@/theme';
import { useState } from 'react';

export default function EventSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [moderationOn, setModerationOn] = useState(false);
  const [downloadOn, setDownloadOn] = useState(true);
  const [approvalOn, setApprovalOn] = useState(false);

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Settings</Text>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>MODERATION</Text>
        <View style={s.row}><Text style={s.rowLabel}>Auto-moderate photos</Text><Switch value={moderationOn} onValueChange={setModerationOn} trackColor={{true:colors.amber}} /></View>
        <View style={s.row}><Text style={s.rowLabel}>Require approval</Text><Switch value={approvalOn} onValueChange={setApprovalOn} trackColor={{true:colors.amber}} /></View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>ACCESS</Text>
        <View style={s.row}><Text style={s.rowLabel}>Allow downloads</Text><Switch value={downloadOn} onValueChange={setDownloadOn} trackColor={{true:colors.amber}} /></View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>DANGER ZONE</Text>
        <Pressable style={s.dangerBtn}><Text style={s.dangerText}>End Event</Text></Pressable>
        <Pressable style={[s.dangerBtn,{marginTop:8}]}><Text style={s.dangerText}>Delete Event</Text></Pressable>
      </View>
      <View style={{height:100}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.void,paddingHorizontal:24},
  header:{paddingTop:60,marginBottom:24},
  back:{fontFamily:fonts.bodyMedium,fontSize:14,color:colors.amber,marginBottom:8},
  title:{fontFamily:fonts.heading,fontSize:28,color:colors.cream},
  section:{marginBottom:24},
  sectionTitle:{fontFamily:fonts.bodySemiBold,fontSize:11,letterSpacing:2,color:colors.amber,marginBottom:12},
  row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.smoke},
  rowLabel:{fontFamily:fonts.bodyMedium,fontSize:15,color:colors.cream},
  dangerBtn:{backgroundColor:colors.coral+'15',padding:16,borderRadius:radius.md,alignItems:'center',borderWidth:1,borderColor:colors.coral+'30'},
  dangerText:{fontFamily:fonts.headingSemiBold,fontSize:14,color:colors.coral},
});
