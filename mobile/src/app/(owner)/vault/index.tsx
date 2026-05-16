import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius } from '@/theme';

export default function MemoryVaultScreen() {
  const router = useRouter();

  return (
    <ScrollView style={s.root} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.title}>Memory Vault</Text>
        <Text style={s.desc}>Your past events safely locked away for the future.</Text>
      </View>

      <Text style={s.sectionTitle}>TIME CAPSULES</Text>
      <View style={s.vaultItem}>
        <Text style={s.vaultEmoji}>🔒</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.vaultTitle}>Alex & Jamie's Wedding</Text>
          <Text style={s.vaultMeta}>Unlocks: Dec 2026 (1-Year Anniversary)</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>PAST RECAPS</Text>
      <View style={s.vaultItem}>
        <Text style={s.vaultEmoji}>🎞️</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.vaultTitle}>Summer Boat Party</Text>
          <Text style={s.vaultMeta}>Aug 2025 · 421 Photos</Text>
        </View>
        <Pressable style={s.playBtn}>
          <Text style={s.playText}>▶</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.void, paddingHorizontal: 24 },
  header: { paddingTop: 80, marginBottom: 40 },
  title: { fontFamily: fonts.heading, fontSize: 32, color: colors.cream, marginBottom: 8 },
  desc: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment },
  
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 2, color: colors.amber, marginBottom: 16, marginTop: 24 },
  vaultItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.charcoal, padding: 16, borderRadius: radius.md, marginBottom: 12, borderWidth: 1, borderColor: colors.smoke },
  vaultEmoji: { fontSize: 32, marginRight: 16 },
  vaultTitle: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.cream, marginBottom: 4 },
  vaultMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.ash },
  
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.amber, justifyContent: 'center', alignItems: 'center' },
  playText: { fontSize: 16, color: colors.void, marginLeft: 4 },
});
