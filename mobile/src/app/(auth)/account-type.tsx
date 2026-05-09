/**
 * Digi — Account Type Selection
 * 
 * Personal vs Business account selection.
 */
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, fonts, radius } from '@/theme';

export default function AccountTypeScreen() {
  const router = useRouter();

  const handleSelect = (type: 'personal' | 'business') => {
    router.push({
      pathname: '/(auth)/sign-up',
      params: { accountType: type },
    });
  };

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInDown.delay(100)} style={styles.tag}>
        CHOOSE YOUR PATH
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
        How will you{'\n'}use Digi?
      </Animated.Text>

      <View style={styles.cards}>
        {/* Personal */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleSelect('personal')}
          >
            <Text style={styles.cardEmoji}>📸</Text>
            <Text style={styles.cardTitle}>Personal</Text>
            <Text style={styles.cardDesc}>
              Birthdays, reunions, trips, and celebrations with friends and family.
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>FREE</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Business */}
        <Animated.View entering={FadeInDown.delay(550)}>
          <Pressable
            style={({ pressed }) => [styles.card, styles.cardBusiness, pressed && styles.cardPressed]}
            onPress={() => handleSelect('business')}
          >
            <Text style={styles.cardEmoji}>🎯</Text>
            <Text style={styles.cardTitle}>Business</Text>
            <Text style={styles.cardDesc}>
              Weddings, corporate events, festivals — branded experiences with analytics.
            </Text>
            <View style={[styles.cardBadge, styles.cardBadgePremium]}>
              <Text style={[styles.cardBadgeText, { color: colors.void }]}>PRO</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Film grain */}
      <View style={styles.grain} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  tag: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 2.4,
    color: colors.amber,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 42,
    color: colors.cream,
    marginBottom: 40,
    letterSpacing: -0.76,
  },
  cards: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.smoke,
  },
  cardBusiness: {
    borderColor: colors.amber + '40',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.cream,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.parchment,
  },
  cardBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.graphite,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  cardBadgePremium: {
    backgroundColor: colors.amber,
  },
  cardBadgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.cream,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.filmGrain,
    zIndex: 10,
    pointerEvents: 'none',
  },
});
