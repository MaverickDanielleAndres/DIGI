import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAlbumStore } from '@/store/album.store';
import { Image } from 'expo-image';
import { colors, fonts, radius } from '@/theme';

export default function PhotobookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const photos = useAlbumStore((s) => s.photos);
  const [size, setSize] = useState('8x8');
  
  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backArrow}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <Text style={s.title}>Design Photobook</Text>
      </View>

      <Text style={s.desc}>We've automatically curated your best memories into a beautiful keepsake.</Text>

      <View style={s.previewContainer}>
        {photos.slice(0, 4).map((p, i) => (
          <View key={p.id} style={[s.pageBox, i % 2 !== 0 && { marginTop: 20 }]}>
            <Image source={{ uri: p.storage_path }} style={s.pageImage} />
          </View>
        ))}
        {photos.length === 0 && <Text style={s.empty}>Need more photos!</Text>}
      </View>

      <Text style={s.sectionTitle}>SELECT SIZE</Text>
      <View style={s.sizeRow}>
        {['5x5', '8x8', '10x10'].map((sz) => (
          <Pressable key={sz} style={[s.sizeBtn, size === sz && s.sizeBtnActive]} onPress={() => setSize(sz)}>
            <Text style={[s.sizeText, size === sz && s.sizeTextActive]}>{sz}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={s.orderBtn}>
        <Text style={s.orderBtnText}>Order for $39.99</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, marginBottom: 16 },
  backArrow: { width: 44, height: 44, justifyContent: 'center' },
  backIcon: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream, marginLeft: 8 },
  desc: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment, marginBottom: 32 },
  
  previewContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 40 },
  pageBox: { width: '45%', aspectRatio: 1, backgroundColor: colors.cream, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  pageImage: { flex: 1, backgroundColor: colors.charcoal },
  empty: { color: colors.ash },

  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2, color: colors.amber, marginBottom: 12 },
  sizeRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  sizeBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: colors.smoke, borderRadius: radius.md, alignItems: 'center' },
  sizeBtnActive: { backgroundColor: colors.amber, borderColor: colors.amber },
  sizeText: { fontFamily: fonts.bodySemiBold, color: colors.parchment },
  sizeTextActive: { color: colors.void },

  orderBtn: { backgroundColor: colors.amber, paddingVertical: 16, borderRadius: radius.md, alignItems: 'center', marginBottom: 40 },
  orderBtnText: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.void },
});
