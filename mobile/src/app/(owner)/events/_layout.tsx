import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.void },
      }}
    />
  );
}
