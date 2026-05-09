import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function EventDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.void },
      }}
    />
  );
}
