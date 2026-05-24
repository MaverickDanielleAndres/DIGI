import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { textStyles } from '@/theme/typography';
import { springs } from '@/theme/animations';
import { spacing, radius } from '@/theme/spacing';

export interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'error';
  visible: boolean;
}

// Slides from top, auto-dismisses after 3s
export function Toast({ message, type = 'info', visible }: ToastProps) {
  const translateY = useSharedValue(-80);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, springs.standard);
      const timeout = setTimeout(() => {
        translateY.value = withTiming(-80, { duration: 250 });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [visible, translateY]);

  const accentColor = { info: colors.amber, success: colors.sage, error: colors.coral }[type];

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          top: 0,
          left: 16,
          right: 16,
          backgroundColor: colors.charcoal,
          borderRadius: radius.md,
          borderLeftWidth: 3,
          borderLeftColor: accentColor,
          padding: spacing[4],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 9999,
        }
      ]}
    >
      <Text style={[textStyles.small, { color: colors.cream, flex: 1 }]}>{message}</Text>
    </Animated.View>
  );
}
