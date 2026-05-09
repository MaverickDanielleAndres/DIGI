/**
 * Digi — Splash / Entry Screen
 * 
 * Cinematic splash with logo pulse animation.
 * Redirects based on auth state after animation completes.
 */
import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors, durations } from '@/theme';

export default function SplashEntry() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo entrance
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 1000 });

    // Amber glow pulse
    glowOpacity.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1200 }),
          withTiming(0.2, { duration: 1200 })
        ),
        -1,
        true
      )
    );

    // Navigate after splash
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (session) {
          router.replace('/(owner)/home');
        } else {
          router.replace('/(auth)/onboarding');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, session]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Amber glow behind logo */}
      <Animated.View style={[styles.glow, glowStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('../../assets/digilogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Film grain overlay texture */}
      <View style={styles.grain} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    zIndex: 2,
  },
  logo: {
    width: 180,
    height: 180,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.amberGlow,
    zIndex: 1,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.filmGrain,
    zIndex: 3,
  },
});
