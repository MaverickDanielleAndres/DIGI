import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { colors, fonts, radius, textStyles, springs } from '@/theme';
import { useAuthStore } from '@/store/auth.store';
import { Camera, Film, Crown, Check, X } from 'lucide-react-native';

const REVENUECAT_API_KEY = '__FILL_IN_REVENUECAT_KEY__';

export default function PaywallScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Stub implementation for RevenueCat
    // In production, you would configure this in _layout.tsx
    // Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    
    // Simulate fetching packages
    setTimeout(() => {
      setPackages([
        {
          identifier: 'digi_creator_monthly',
          packageType: 'MONTHLY',
          product: {
            identifier: 'digi_creator_monthly',
            description: 'Unlock unlimited events and premium themes',
            title: 'Creator Plan (Monthly)',
            price: 4.99,
            priceString: '$4.99',
            currencyCode: 'USD',
          }
        } as any,
        {
          identifier: 'digi_creator_annual',
          packageType: 'ANNUAL',
          product: {
            identifier: 'digi_creator_annual',
            description: 'Unlock unlimited events and premium themes',
            title: 'Creator Plan (Annual)',
            price: 39.99,
            priceString: '$39.99',
            currencyCode: 'USD',
          }
        } as any
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setIsPurchasing(true);
    try {
      // Stub: In reality -> await Purchases.purchasePackage(pkg);
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert("Success!", "You are now on the Creator Plan.");
      router.back();
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Error purchasing", e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View style={s.container}>
      <LinearGradient
        colors={[colors.void, 'rgba(244, 165, 53, 0.05)', colors.void]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.closeButton}>
          <X color={colors.ash} size={24} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scrollContent}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(20)}>
          <Crown color={colors.amber} size={48} style={s.icon} />
          <Text style={s.title}>Upgrade to Creator</Text>
          <Text style={s.subtitle}>
            Unlock the full potential of your events with unlimited shots and premium cinematic themes.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify().damping(20)} style={s.featuresContainer}>
          {[
            'Unlimited events per month',
            'Remove shot limits per guest',
            'Access to Wedding & Y2K Themes',
            'High-definition photo exports',
            'Priority AI recap processing'
          ].map((feature, i) => (
            <View key={i} style={s.featureRow}>
              <View style={s.checkCircle}>
                <Check color={colors.void} size={14} />
              </View>
              <Text style={s.featureText}>{feature}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify().damping(20)} style={s.packagesContainer}>
          {isLoading ? (
            <ActivityIndicator color={colors.amber} style={{ padding: 40 }} />
          ) : (
            packages.map((pkg, i) => (
              <Pressable
                key={pkg.identifier}
                style={s.packageCard}
                onPress={() => handlePurchase(pkg)}
                disabled={isPurchasing}
              >
                <View style={s.packageInfo}>
                  <Text style={s.packageTitle}>
                    {pkg.packageType === 'ANNUAL' ? 'Yearly' : 'Monthly'}
                  </Text>
                  <Text style={s.packagePrice}>{pkg.product.priceString}</Text>
                </View>
                {pkg.packageType === 'ANNUAL' && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>SAVE 33%</Text>
                  </View>
                )}
              </Pressable>
            ))
          )}
        </Animated.View>
      </ScrollView>

      {isPurchasing && (
        <Animated.View entering={FadeIn} style={s.loadingOverlay}>
          <ActivityIndicator color={colors.amber} size="large" />
          <Text style={s.loadingText}>Processing...</Text>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.void },
  header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'flex-end' },
  closeButton: { padding: 8, marginRight: -8 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  icon: { alignSelf: 'center', marginBottom: 24 },
  title: { ...textStyles.display, color: colors.cream, textAlign: 'center', marginBottom: 12 },
  subtitle: { ...textStyles.body, color: colors.parchment, textAlign: 'center', paddingHorizontal: 12, marginBottom: 40 },
  featuresContainer: { backgroundColor: colors.charcoal, borderRadius: radius.xl, padding: 24, gap: 16, marginBottom: 40, borderWidth: 1, borderColor: colors.smoke },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center' },
  featureText: { ...textStyles.body, color: colors.cream, flex: 1 },
  packagesContainer: { gap: 16 },
  packageCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.graphite, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.smoke },
  packageInfo: { gap: 4 },
  packageTitle: { ...textStyles.h3, color: colors.cream },
  packagePrice: { ...textStyles.body, color: colors.parchment },
  badge: { backgroundColor: 'rgba(244, 165, 53, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  badgeText: { ...textStyles.micro, color: colors.amber },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 8, 6, 0.8)', alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...textStyles.body, color: colors.cream, marginTop: 16 }
});
