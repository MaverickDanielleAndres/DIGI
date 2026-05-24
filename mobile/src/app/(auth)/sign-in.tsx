/**
 * Digi — Sign In Screen
 */
import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { colors, fonts, radius } from '@/theme';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithOtp, signInWithApple, signInWithGoogle } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Missing fields', 'Please enter your email.');
      return;
    }

    if (!isMagicLinkMode && !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    let error;

    if (isMagicLinkMode) {
      const res = await signInWithOtp(email.trim());
      error = res.error;
      if (!error) {
        Alert.alert('Check your email', 'We sent you a magic link to sign in.');
      }
    } else {
      const res = await signInWithEmail(email.trim(), password);
      error = res.error;
      if (!error) router.replace('/(owner)/home');
    }

    setIsSubmitting(false);

    if (error) {
      Alert.alert('Sign in failed', error.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        const { error } = await signInWithApple(credential.identityToken);
        if (error) throw error;
        router.replace('/(owner)/home');
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple Sign-In failed', e.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL('/');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl },
      });
      
      if (error) throw error;
      
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          // Supabase auto-handles the session from deep link in its own listener
          router.replace('/(owner)/home');
        }
      }
    } catch (e: any) {
      Alert.alert('Google Sign-In failed', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Animated.Text entering={FadeInDown.delay(100)} style={styles.tag}>
          WELCOME BACK
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
          Sign in to{'\n'}your memories
        </Animated.Text>

        <View style={styles.form}>
          <Animated.View entering={FadeInDown.delay(300)}>
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

          {!isMagicLinkMode && (
            <Animated.View entering={FadeInDown.delay(400)}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={colors.ash}
                secureTextEntry
              />
            </Animated.View>
          )}
        </View>

        <Animated.View entering={FadeInDown.delay(500)}>
          <Pressable
            style={[styles.cta, isSubmitting && styles.ctaDisabled]}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            <Text style={styles.ctaText}>
              {isSubmitting ? 'Sending...' : (isMagicLinkMode ? 'Send Magic Link' : 'Sign In')}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.toggleMode}>
          <Pressable onPress={() => setIsMagicLinkMode(!isMagicLinkMode)}>
            <Text style={styles.toggleText}>
              {isMagicLinkMode ? 'Sign in with password instead' : 'Use a magic link instead'}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.socialBtn} onPress={handleAppleSignIn}>
            <Text style={styles.socialText}>Continue with Apple</Text>
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={handleGoogleSignIn}>
            <Text style={styles.socialText}>Continue with Google</Text>
          </Pressable>
        </Animated.View>

        <Pressable onPress={() => router.push('/(auth)/sign-up')} style={styles.switchAuth}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
      <View style={styles.grain} pointerEvents="none" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.void },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  tag: { fontFamily: fonts.bodySemiBold, fontSize: 12, letterSpacing: 2.4, color: colors.amber, marginBottom: 12 },
  title: { fontFamily: fonts.display, fontSize: 38, lineHeight: 42, color: colors.cream, marginBottom: 36, letterSpacing: -0.76 },
  form: { gap: 20, marginBottom: 24 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 1.5, color: colors.parchment, marginBottom: 8 },
  input: { backgroundColor: colors.charcoal, borderWidth: 1, borderColor: colors.smoke, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, fontFamily: fonts.body, fontSize: 15, color: colors.cream },
  cta: { backgroundColor: colors.amber, height: 56, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { fontFamily: fonts.headingSemiBold, fontSize: 16, color: colors.void },
  toggleMode: { alignItems: 'center', marginTop: 16 },
  toggleText: { fontFamily: fonts.bodyMedium, color: colors.parchment, fontSize: 14 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: colors.smoke },
  orText: { color: colors.ash, fontFamily: fonts.bodySemiBold, paddingHorizontal: 16, fontSize: 12 },
  socialBtn: { backgroundColor: colors.charcoal, borderWidth: 1, borderColor: colors.smoke, height: 56, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  socialText: { fontFamily: fonts.headingSemiBold, fontSize: 15, color: colors.cream },
  switchAuth: { marginTop: 24, alignItems: 'center' },
  switchText: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment },
  switchLink: { color: colors.amber, fontFamily: fonts.bodyMedium },
  grain: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.filmGrain, zIndex: 10, pointerEvents: 'none' },
});
