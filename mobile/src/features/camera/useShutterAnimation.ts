import { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '@/theme/animations';

// Triggered on every photo capture
export function useShutterAnimation() {
  const flashOpacity = useSharedValue(0);
  const cameraScale = useSharedValue(1);

  const triggerShutter = useCallback(() => {
    // Screen flash
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 40 }),
      withTiming(0, { duration: 120 })
    );
    // Camera frame compression + bounce
    cameraScale.value = withSequence(
      withTiming(0.97, { duration: 60 }),
      withSpring(1, springs.bouncy)
    );
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [flashOpacity, cameraScale]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));
  const cameraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cameraScale.value }],
  }));

  return { triggerShutter, flashStyle, cameraStyle };
}
