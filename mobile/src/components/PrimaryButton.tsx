import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { colors } from '@/theme/colors';
import { textStyles, fonts } from '@/theme/typography';
import { radius, spacing } from '@/theme/spacing';
import { springs } from '@/theme/animations';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'amber' | 'secondary' | 'outline';
}

export function PrimaryButton({
  label, onPress, disabled, variant = 'amber',
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => { scale.value = withTiming(0.96, { duration: 60 }); })
    .onFinalize(() => {
      scale.value = withSpring(1, springs.snappy);
      runOnJS(onPress)();
    })
    .enabled(!disabled);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.45 : 1,
  }));

  const getBackgroundColor = () => {
    if (variant === 'amber') return colors.amber;
    if (variant === 'secondary') return colors.charcoal;
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'amber') return colors.void;
    return colors.cream;
  };

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[animStyle, {
          backgroundColor: getBackgroundColor(),
          borderRadius: radius.pill,
          paddingVertical: 14,
          paddingHorizontal: 28,
          alignItems: 'center',
          borderWidth: variant === 'outline' ? 1.5 : variant === 'secondary' ? 1.5 : 0,
          borderColor: variant === 'outline' ? colors.smoke : variant === 'secondary' ? colors.ash : 'transparent',
        }]}
      >
        <Text style={[textStyles.body, {
          fontFamily: fonts.headingSemiBold,
          color: getTextColor(),
        }]}>
          {label}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
}
