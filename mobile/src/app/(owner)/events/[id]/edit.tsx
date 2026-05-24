/**
 * Digi — Edit Event Details
 */
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventStore } from '@/store/event.store';
import { colors, fonts, radius } from '@/theme';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentEvent, updateEvent } = useEventStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      setTitle(currentEvent.title || '');
      setDescription(currentEvent.description || '');
      setLocation(currentEvent.location || '');
      setStartsAt(currentEvent.starts_at || null);
      setEndsAt(currentEvent.ends_at || null);
    }
  }, [currentEvent]);

  if (!currentEvent) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter an event name');
      return;
    }
    
    setSubmitting(true);
    const { error } = await updateEvent(id, {
      title: title.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      starts_at: startsAt,
      ends_at: endsAt,
    } as any);
    setSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  };

  return (
    <ScrollView style={s.root} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <Pressable onPress={() => router.back()}><Text style={s.back}>← Cancel</Text></Pressable>
        <Text style={s.headerTitle}>Edit Details</Text>
      </View>

      <Animated.View entering={FadeInDown} style={s.content}>
        <Text style={s.label}>EVENT NAME</Text>
        <TextInput 
          style={s.input} 
          value={title} 
          onChangeText={setTitle}
          placeholder="Summer Reunion 2026" 
          placeholderTextColor={colors.ash} 
        />
        
        <Text style={s.label}>DESCRIPTION</Text>
        <TextInput 
          style={[s.input, { height: 80 }]} 
          value={description} 
          onChangeText={setDescription}
          placeholder="Optional description..." 
          placeholderTextColor={colors.ash} 
          multiline 
        />
        
        <Text style={s.label}>LOCATION</Text>
        <TextInput 
          style={s.input} 
          value={location} 
          onChangeText={setLocation}
          placeholder="Location (optional)" 
          placeholderTextColor={colors.ash} 
        />

        <Text style={s.label}>START TIME (OPTIONAL)</Text>
        <Pressable style={s.input} onPress={() => setShowStartPicker(true)}>
          <Text style={{color: startsAt ? colors.cream : colors.ash}}>
            {startsAt ? new Date(startsAt).toLocaleString() : 'Select Start Date & Time'}
          </Text>
        </Pressable>
        {showStartPicker && (
          <DateTimePicker
            value={startsAt ? new Date(startsAt) : new Date()}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowStartPicker(Platform.OS === 'ios');
              if (date) setStartsAt(date.toISOString());
            }}
          />
        )}

        <Text style={s.label}>END TIME (OPTIONAL)</Text>
        <Pressable style={s.input} onPress={() => setShowEndPicker(true)}>
          <Text style={{color: endsAt ? colors.cream : colors.ash}}>
            {endsAt ? new Date(endsAt).toLocaleString() : 'Select End Date & Time'}
          </Text>
        </Pressable>
        {showEndPicker && (
          <DateTimePicker
            value={endsAt ? new Date(endsAt) : new Date()}
            mode="datetime"
            display="default"
            onChange={(event, date) => {
              setShowEndPicker(Platform.OS === 'ios');
              if (date) setEndsAt(date.toISOString());
            }}
          />
        )}
      </Animated.View>

      <Pressable
        style={[s.saveBtn, submitting && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={submitting}
      >
        <Text style={s.saveText}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void },
  scroll: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, gap: 16 },
  back: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.amber },
  headerTitle: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream },
  content: { marginBottom: 32 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2, color: colors.parchment, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: colors.charcoal, borderWidth: 1, borderColor: colors.smoke, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, fontFamily: fonts.body, fontSize: 15, color: colors.cream },
  saveBtn: { height: 56, borderRadius: radius.md, backgroundColor: colors.amber, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  saveText: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.void },
});
