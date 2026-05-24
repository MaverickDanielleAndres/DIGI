import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
  FadeIn,
} from 'react-native-reanimated';
import { springs } from '@/theme/animations';

export function FilmRevealOverlay({ onComplete }: { onComplete: () => void }) {
  const grainOpacity = useSharedValue(1);
  const goldLeakOpacity = useSharedValue(0);
  const goldLeakScale = useSharedValue(0.3);

  useEffect(() => {
    // Phase 1: grain pulses (400ms)
    grainOpacity.value = withSequence(
      withTiming(0.6, { duration: 200 }),
      withTiming(1.0, { duration: 200 })
    );
    // Phase 2: gold light bleeds in
    goldLeakOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    goldLeakScale.value = withDelay(300, withSpring(1.5, springs.gentle));
    // Phase 3: dismiss and show photos
    grainOpacity.value = withDelay(900, withTiming(0, { duration: 300 }));
    goldLeakOpacity.value = withDelay(900, withTiming(0, { duration: 300 }));
    
    const timeout = setTimeout(() => {
      runOnJS(onComplete)();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [grainOpacity, goldLeakOpacity, goldLeakScale, onComplete]);

  const grainStyle = useAnimatedStyle(() => ({
    opacity: grainOpacity.value,
  }));
  const goldLeakStyle = useAnimatedStyle(() => ({
    opacity: goldLeakOpacity.value,
    transform: [{ scale: goldLeakScale.value }],
  }));

  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#0A0806' }]}>
      <Animated.View style={[StyleSheet.absoluteFillObject, grainStyle]}>
        {/* Simplified grain representation, in reality could be an SVG or image pattern */}
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(255, 220, 150, 0.05)' }]} />
      </Animated.View>
      <Animated.View 
        style={[
          {
            position: 'absolute',
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(244, 165, 53, 0.4)',
            shadowColor: '#F4A535',
            shadowRadius: 100,
            shadowOpacity: 1,
          },
          goldLeakStyle
        ]} 
      />
    </View>
  );
}

// Photo develop animation (sepia → full color) per photo
export function PhotoDevelopIn({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <Animated.View
      entering={FadeIn.delay(index * 120).springify().damping(22).stiffness(120)}
    >
      {children}
    </Animated.View>
  );
}
