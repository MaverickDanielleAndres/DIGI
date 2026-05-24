/**
 * Digi — Edit Event Details
 */
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentEvent) {
      setTitle(currentEvent.title || '');
      setDescription(currentEvent.description || '');
      setLocation(currentEvent.location || '');
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
