/**
 * Digi — Onboarding Screen
 * 
 * 3 cinematic full-screen slides:
 * 1. Emotional hook — "Every Moment, Together"
 * 2. Shot counter mechanic — "24 Shots. Make Them Count."
 * 3. Reveal lock — "The Best Part? The Wait."
 */
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { colors, fonts, springs } from '@/theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    tag: 'COLLECTIVE MEMORY',
    title: 'Every Moment,\nTogether',
    subtitle: 'One event. One disposable camera. Everyone contributes to the same shared album — no filters, no retakes, just real memories.',
    accent: colors.amber,
  },
  {
    tag: 'SHOT COUNTER',
    title: '24 Shots.\nMake Them\nCount.',
    subtitle: 'Each guest gets a limited number of shots. Like a real disposable camera — every snap matters.',
    accent: colors.coral,
  },
  {
    tag: 'DELAYED REVEAL',
    title: 'The Best Part?\nThe Wait.',
    subtitle: 'Photos stay hidden until the event ends. Then, the magic happens — all memories revealed at once, like developing a roll of film.',
    accent: colors.amberSoft,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / width);
    setCurrentSlide(index);
  };

  const handleGetStarted = () => {
    router.push('/(auth)/account-type');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextIndex = currentSlide + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      handleGetStarted();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            {/* Decorative glow */}
            <View style={[styles.glow, { backgroundColor: slide.accent + '15' }]} />

            {/* Tag */}
            <Animated.Text
              entering={FadeInDown.delay(200).springify()}
              style={[styles.tag, { color: slide.accent }]}
            >
              {slide.tag}
            </Animated.Text>

            {/* Title */}
            <Animated.Text
              entering={FadeInDown.delay(400).springify()}
              style={styles.title}
            >
              {slide.title}
            </Animated.Text>

            {/* Subtitle */}
            <Animated.Text
              entering={FadeInDown.delay(600).springify()}
              style={styles.subtitle}
            >
              {slide.subtitle}
            </Animated.Text>

            {/* Shot counter visual on slide 2 */}
            {index === 1 && (
              <Animated.View
                entering={FadeIn.delay(800).springify()}
                style={styles.shotCounterDemo}
              >
                <Text style={styles.shotNumber}>24</Text>
                <Text style={styles.shotLabel}>shots remaining</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.dotActive,
                currentSlide === index && { backgroundColor: slides[currentSlide].accent },
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <Pressable
          style={[styles.cta, { backgroundColor: slides[currentSlide].accent }]}
          onPress={handleNext}
        >
          <Text style={styles.ctaText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>

        {/* Skip */}
        {currentSlide < slides.length - 1 && (
          <Pressable onPress={handleGetStarted} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Film grain */}
      <View style={styles.grain} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    top: height * 0.15,
    right: -100,
  },
  tag: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 2.4,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 46,
    lineHeight: 50,
    color: colors.cream,
    letterSpacing: -0.92,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.parchment,
    maxWidth: 320,
  },
  shotCounterDemo: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.coral,
    backgroundColor: colors.charcoal,
  },
  shotNumber: {
    fontFamily: fonts.mono,
    fontSize: 40,
    color: colors.coral,
    lineHeight: 44,
  },
  shotLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.parchment,
    marginTop: 2,
  },
  bottom: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ash,
  },
  dotActive: {
    width: 24,
    borderRadius: 12,
  },
  cta: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fonts.headingSemiBold,
    fontSize: 16,
    color: colors.void,
  },
  skipButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ash,
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.filmGrain,
    zIndex: 10,
    pointerEvents: 'none',
  },
});
