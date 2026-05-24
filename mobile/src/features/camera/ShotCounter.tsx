import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { textStyles } from '@/theme/typography';

interface ShotCounterProps {
  count: number;
  maxCount: number;
}

// Flip clock effect when shot count decrements
export function ShotCounter({ count, maxCount }: ShotCounterProps) {
  const prevCount = useRef(count);
  const flipY = useSharedValue(0);
  const isLow = count <= 5;
  const isCritical = count <= 3;

  useEffect(() => {
    if (count < prevCount.current) {
      flipY.value = withSequence(
        withTiming(-90, { duration: 80 }),
        withTiming(0, { duration: 120 })
      );
      if (isCritical) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
    prevCount.current = count;
  }, [count, isCritical, flipY]);

  const counterStyle = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${flipY.value}deg` }],
  }));

  const bgColor = isCritical ? colors.coral : isLow ? '#E8803A' : colors.amber;

  return (
    <View 
      className="w-full flex-row items-center justify-start px-4 py-2"
      style={{ backgroundColor: bgColor }}
    >
      <Animated.Text style={[textStyles.counter, counterStyle, { color: colors.void }]}>
        {String(count).padStart(2, '0')}
      </Animated.Text>
      <Text style={[textStyles.micro, { color: colors.void, marginLeft: 6, letterSpacing: 2 }]}>
        SHOTS REMAINING
      </Text>
    </View>
  );
}
