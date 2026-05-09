/**
 * Digi — Root Layout
 * 
 * Loads fonts, initializes auth, sets up providers.
 * This is the entry point for the entire app via expo-router.
 */
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme';
import { ThemeProvider } from '@/theme/ThemeProvider';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function AuthGate() {
  const { session, isLoading, isOnboarded } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOwnerGroup = segments[0] === '(owner)';
    const inGuestGroup = segments[0] === '(guest)';

    if (!session && !inAuthGroup) {
      // Not signed in → redirect to onboarding
      router.replace('/(auth)/onboarding');
    } else if (session && inAuthGroup) {
      // Signed in → redirect to home
      router.replace('/(owner)/home');
    }
  }, [session, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          'PlayfairDisplay-Italic': require('../../assets/fonts/PlayfairDisplay-Italic.ttf'),
          'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Bold': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
          'Syne-Regular': require('../../assets/fonts/Syne-Regular.ttf'),
          'Syne-Medium': require('../../assets/fonts/Syne-Medium.ttf'),
          'Syne-SemiBold': require('../../assets/fonts/Syne-SemiBold.ttf'),
          'Syne-Bold': require('../../assets/fonts/Syne-Bold.ttf'),
          'DMSans-Regular': require('../../assets/fonts/DMSans-Regular.ttf'),
          'DMSans-Medium': require('../../assets/fonts/DMSans-Medium.ttf'),
          'DMSans-SemiBold': require('../../assets/fonts/DMSans-SemiBold.ttf'),
          'DMSans-Bold': require('../../assets/fonts/DMSans-Bold.ttf'),
          'JetBrainsMono-Regular': require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
          'JetBrainsMono-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
          'Caveat-Medium': require('../../assets/fonts/Caveat-Medium.ttf'),
          'Caveat-Bold': require('../../assets/fonts/Caveat-Bold.ttf'),
        });

        // Initialize auth
        await initialize();

        setFontsLoaded(true);
      } catch (e) {
        console.warn('Font loading error:', e);
        setFontsLoaded(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.amber} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <AuthGate />
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.void,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
