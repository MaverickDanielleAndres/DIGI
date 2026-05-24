/**
 * Digi — Event Settings
 */
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, fonts, radius } from '@/theme';
import { useEventStore } from '@/store/event.store';

export default function EventSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentEvent, updateEvent, currentSettings, updateSettings, endEvent, deleteEvent } = useEventStore();

  if (!currentSettings || !currentEvent) return null;

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure you want to permanently delete this event and all its photos?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteEvent(id);
          router.replace('/(owner)/home');
      }}
    ]);
  };

  const handleEnd = () => {
    Alert.alert('End Event', 'Are you sure you want to end this event?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Event', style: 'destructive', onPress: async () => {
          await endEvent(id);
          router.replace('/(owner)/home');
      }}
    ]);
  };

  const handleToggle = async (field: string, value: boolean | string | number | null) => {
    await updateSettings(id, { [field]: value });
  };

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Back</Text></Pressable>
        <Text style={s.title}>Settings</Text>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>MODERATION</Text>
        <View style={s.row}>
          <Text style={s.rowLabel}>Auto-moderate photos</Text>
          <Switch 
            value={currentSettings.moderation_mode === 'auto'} 
            onValueChange={(val) => handleToggle('moderation_mode', val ? 'auto' : 'off')} 
            trackColor={{true:colors.amber}} 
          />
        </View>
        <View style={s.row}>
          <Text style={s.rowLabel}>Require approval (Waitlist)</Text>
          <Switch 
            value={currentSettings.require_approval} 
            onValueChange={(val) => handleToggle('require_approval', val)} 
            trackColor={{true:colors.amber}} 
          />
        </View>
        <View style={s.col}>
          <Text style={s.rowLabel}>Participant Limit</Text>
          <TextInput 
            style={s.input} 
            value={currentSettings.max_participants ? String(currentSettings.max_participants) : ''} 
            onChangeText={(val) => handleToggle('max_participants', val ? parseInt(val) : null)} 
            placeholder="No limit" 
            placeholderTextColor={colors.ash} 
            keyboardType="number-pad"
          />
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>VISIBILITY</Text>
        <View style={s.visibilityRow}>
          {['public', 'private', 'invite_only'].map((v) => (
            <Pressable 
              key={v} 
              style={[s.visBtn, currentEvent.visibility === v && s.visBtnActive]}
              onPress={() => updateEvent(id, { visibility: v as any })}
            >
              <Text style={[s.visText, currentEvent.visibility === v && s.visTextActive]}>
                {v.replace('_', ' ')}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>ACCESS CONTROLS</Text>
        <View style={s.row}>
          <Text style={s.rowLabel}>Allow downloads</Text>
          <Switch 
            value={currentSettings.download_enabled} 
            onValueChange={(val) => handleToggle('download_enabled', val)} 
            trackColor={{true:colors.amber}} 
          />
        </View>
        <View style={s.row}>
          <Text style={s.rowLabel}>Location restricted</Text>
          <Switch 
            value={currentSettings.location_restricted} 
            onValueChange={(val) => handleToggle('location_restricted', val)} 
            trackColor={{true:colors.amber}} 
          />
        </View>
        <View style={s.row}>
          <Text style={s.rowLabel}>Anonymous mode</Text>
          <Switch 
            value={currentSettings.anonymous_mode} 
            onValueChange={(val) => handleToggle('anonymous_mode', val)} 
            trackColor={{true:colors.amber}} 
          />
        </View>
        <View style={s.col}>
          <Text style={s.rowLabel}>Event Password (Optional)</Text>
          <TextInput 
            style={s.input} 
            value={currentSettings.password_hash || ''} 
            onChangeText={(val) => handleToggle('password_hash', val)} 
            placeholder="No password" 
            placeholderTextColor={colors.ash} 
            secureTextEntry 
          />
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>DANGER ZONE</Text>
        <Pressable style={s.dangerBtn} onPress={handleEnd}><Text style={s.dangerText}>End Event</Text></Pressable>
        <Pressable style={[s.dangerBtn,{marginTop:8}]} onPress={handleDelete}><Text style={s.dangerText}>Delete Event</Text></Pressable>
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
  col:{paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.smoke, gap:8},
  input:{backgroundColor:colors.charcoal,borderWidth:1,borderColor:colors.smoke,borderRadius:radius.md,paddingHorizontal:16,paddingVertical:12,fontFamily:fonts.body,fontSize:15,color:colors.cream},
  rowLabel:{fontFamily:fonts.bodyMedium,fontSize:15,color:colors.cream},
  visibilityRow: { flexDirection: 'row', gap: 8 },
  visBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: colors.charcoal, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.smoke },
  visBtnActive: { backgroundColor: colors.amber + '20', borderColor: colors.amber },
  visText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.parchment, textTransform: 'capitalize' },
  visTextActive: { color: colors.amber },
  dangerBtn:{backgroundColor:colors.coral+'15',padding:16,borderRadius:radius.md,alignItems:'center',borderWidth:1,borderColor:colors.coral+'30'},
  dangerText:{fontFamily:fonts.headingSemiBold,fontSize:14,color:colors.coral},
});
