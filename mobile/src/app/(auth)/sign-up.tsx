/**
 * Digi — Sign Up Screen
 */
import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { colors, fonts, radius } from '@/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { accountType } = useLocalSearchParams<{ accountType: string }>();
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUpWithEmail(
      email.trim(), 
      password, 
      name.trim(), 
      (accountType as 'personal' | 'business') || 'personal'
    );
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
    } else {
      router.replace('/(owner)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.Text entering={FadeInDown.delay(100)} style={styles.tag}>
          CREATE ACCOUNT
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
          Join the{'\n'}memory
        </Animated.Text>

        <View style={styles.form}>
          <Animated.View entering={FadeInDown.delay(300)}>
            <Text style={styles.label}>{accountType === 'business' ? 'BRAND NAME' : 'DISPLAY NAME'}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={accountType === 'business' ? 'Your brand/agency name' : 'Your name'}
              placeholderTextColor={colors.ash}
              autoCapitalize="words"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.ash}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              placeholderTextColor={colors.ash}
              secureTextEntry
            />
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(600)}>
          <Pressable
            style={[styles.cta, isSubmitting && styles.ctaDisabled]}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            <Text style={styles.ctaText}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </Text>
          </Pressable>
        </Animated.View>

        <Pressable onPress={() => router.push('/(auth)/sign-in')} style={styles.switchAuth}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchLink}>Sign in</Text>
          </Text>
        </Pressable>
      </ScrollView>
      <View style={styles.grain} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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
    marginBottom: 36,
    letterSpacing: -0.76,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.parchment,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.smoke,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.cream,
  },
  cta: {
    backgroundColor: colors.amber,
    height: 56,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 16,
    color: colors.void,
  },
  switchAuth: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.parchment,
  },
  switchLink: {
    color: colors.amber,
    fontFamily: fonts.bodyMedium,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.filmGrain,
    zIndex: 10,
    pointerEvents: 'none',
  },
});
