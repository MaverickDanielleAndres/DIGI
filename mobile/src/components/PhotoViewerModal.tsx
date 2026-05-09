import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import type { Photo, ReactionType } from '@/types';
import { useAlbumStore } from '@/store/album.store';
import { useAuthStore } from '@/store/auth.store';
import { useEventStore } from '@/store/event.store';

interface PhotoViewerModalProps {
  photo: Photo | null;
  eventId: string;
  onClose: () => void;
}

const EMOJIS: { type: ReactionType; icon: string }[] = [
  { type: 'heart', icon: '❤️' },
  { type: 'sparkle', icon: '✨' },
  { type: 'laugh', icon: '😂' },
  { type: 'wow', icon: '😮' },
  { type: 'cry', icon: '😭' },
];

export function PhotoViewerModal({ photo, eventId, onClose }: PhotoViewerModalProps) {
  const session = useAuthStore((s) => s.session);
  const currentEvent = useEventStore((s) => s.currentEvent);
  const reactions = useAlbumStore((s) => photo ? s.reactions[photo.id] || [] : []);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = currentEvent && session && currentEvent.owner_id === session.user.id;

  if (!photo) return null;

  const { data } = supabase.storage.from('photos').getPublicUrl(photo.storage_path);

  const handleReaction = async (type: ReactionType) => {
    if (!session || submitting) return;
    setSubmitting(true);
    try {
      const { data: part } = await supabase
        .from('participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', session.user.id)
        .single();
      
      if (!part) return;

      const { error } = await supabase.from('reactions').insert({
        photo_id: photo.id,
        participant_id: part.id,
        reaction_type: type
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHide = async () => {
    try {
      const { error } = await supabase.from('photos').update({ is_hidden: !photo.is_hidden }).eq('id', photo.id);
      if (error) throw error;
      Alert.alert('Success', `Photo is now ${photo.is_hidden ? 'visible' : 'hidden'} from guests.`);
      onClose(); // Will close and realtime update handles grid refresh
    } catch (e) {
      Alert.alert('Error', 'Failed to update photo visibility.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Are you sure you want to permanently delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await supabase.from('photos').delete().eq('id', photo.id);
          onClose();
        } catch(e) {
          Alert.alert('Error', 'Failed to delete photo.');
        }
      }},
    ]);
  };

  const reactionCounts = reactions.reduce((acc, r) => {
    acc[r.reaction_type] = (acc[r.reaction_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Modal visible={!!photo} transparent animationType="fade" onRequestClose={onClose}>
      <Animated.View style={s.overlay} entering={FadeIn} exiting={FadeOut}>
        <View style={s.header}>
          <Pressable style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeText}>✕</Text>
          </Pressable>
        </View>

        <View style={s.imageContainer}>
          <Image
            source={{ uri: data.publicUrl }}
            style={[s.image, photo.is_hidden && s.hiddenImage]}
            contentFit="contain"
          />
          {photo.is_hidden && <View style={s.hiddenBadge}><Text style={s.hiddenText}>HIDDEN</Text></View>}
        </View>

        <View style={s.bottomSheet}>
          <View style={s.sheetHeader}>
            <Text style={s.uploaderText}>Captured at {new Date(photo.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            {isOwner && (
              <View style={s.hostControls}>
                <Pressable onPress={handleHide} style={s.hostBtn}>
                  <Text style={s.hostBtnText}>{photo.is_hidden ? '👁️ Unhide' : '🙈 Hide'}</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={s.hostBtn}>
                  <Text style={s.hostBtnText}>🗑️ Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.reactionsScroll}>
            <View style={s.reactionsRow}>
              {EMOJIS.map((emoji) => (
                <Pressable
                  key={emoji.type}
                  style={s.reactionBtn}
                  onPress={() => handleReaction(emoji.type)}
                >
                  <Text style={s.reactionEmoji}>{emoji.icon}</Text>
                  {reactionCounts[emoji.type] > 0 && (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{reactionCounts[emoji.type]}</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable style={s.noteInput}>
            <Text style={s.notePlaceholder}>Add a memory note...</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(10, 8, 6, 0.95)', justifyContent: 'space-between' },
  header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'flex-end' },
  closeBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.charcoal, borderRadius: 22 },
  closeText: { color: colors.cream, fontSize: 20 },
  
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  hiddenImage: { opacity: 0.3 },
  hiddenBadge: { position: 'absolute', backgroundColor: colors.coral, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  hiddenText: { fontFamily: fonts.bodySemiBold, color: colors.void, fontSize: 10, letterSpacing: 2 },
  
  bottomSheet: { backgroundColor: colors.charcoal, padding: 24, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  uploaderText: { fontFamily: fonts.body, fontSize: 13, color: colors.parchment },
  hostControls: { flexDirection: 'row', gap: 8 },
  hostBtn: { backgroundColor: colors.void + '80', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.md },
  hostBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.amber },
  
  reactionsScroll: { marginBottom: 24 },
  reactionsRow: { flexDirection: 'row', gap: 12 },
  reactionBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.graphite, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.smoke },
  reactionEmoji: { fontSize: 24 },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.amber, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { fontFamily: fonts.mono, fontSize: 10, color: colors.void, fontWeight: '700' },
  
  noteInput: { backgroundColor: colors.graphite, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.smoke },
  notePlaceholder: { fontFamily: fonts.body, fontSize: 14, color: colors.ash },
});
