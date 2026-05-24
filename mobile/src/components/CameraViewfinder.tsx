import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useCameraStore } from '@/store/camera.store';
import { colors, fonts, radius, springs } from '@/theme';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get('window');

interface CameraViewfinderProps {
  eventId: string;
  participantId: string;
  shotLimit: number;
  initialShotsUsed: number;
  cameraStyle: string;
  cooldownSeconds?: number;
  allowFrontCamera?: boolean;
  allowFlash?: boolean;
}

export function CameraViewfinder({
  eventId,
  participantId,
  shotLimit,
  initialShotsUsed,
  cameraStyle,
  cooldownSeconds = 0,
  allowFrontCamera = true,
  allowFlash = true,
}: CameraViewfinderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('off');
  const [shotsUsed, setShotsUsed] = useState(initialShotsUsed);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [timerMode, setTimerMode] = useState<'off' | '3s' | '10s'>('off');
  const [timerCountdown, setTimerCountdown] = useState<number | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const addPhotoToQueue = useCameraStore((s) => s.addPhotoToQueue);
  const processQueue = useCameraStore((s) => s.processQueue);

  // Animations
  const shutterScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const counterScale = useSharedValue(1);

  // Auto-sync effect
  useEffect(() => {
    const interval = setInterval(() => {
      processQueue(eventId, participantId, cameraStyle);
    }, 5000); // Attempt sync every 5s if there are items in queue
    return () => clearInterval(interval);
  }, [eventId, participantId, cameraStyle]);

  useEffect(() => {
    if (!cooldownUntil) return;

    const tick = () => {
      const secondsLeft = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownLeft(secondsLeft);
      if (secondsLeft === 0) setCooldownUntil(null);
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  if (!permission) {
    return <View style={s.center}><Text style={s.text}>Loading camera...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={s.center}>
        <Text style={s.emoji}>📷</Text>
        <Text style={s.title}>Camera Access Required</Text>
        <Text style={s.desc}>We need camera access to capture memories.</Text>
        <Pressable style={s.btn} onPress={requestPermission}>
          <Text style={s.btnText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const executeCapture = async () => {
    if (!cameraRef.current) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    shutterScale.value = withSequence(
      withSpring(0.85, springs.snappy),
      withSpring(1, springs.bouncy)
    );
    
    if (flash === 'on') {
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 300 })
      );
    }

    counterScale.value = withSequence(
      withSpring(1.3, springs.bouncy),
      withSpring(1, springs.standard)
    );

    setShotsUsed((prev) => prev + 1);
    if (cooldownSeconds > 0) {
      setCooldownUntil(Date.now() + cooldownSeconds * 1000);
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (photo?.uri) {
        const id = uuidv4();
        addPhotoToQueue(id, photo.uri);
        processQueue(eventId, participantId, cameraStyle);
      }
    } catch (e) {
      console.error('Capture failed', e);
      setShotsUsed((prev) => prev - 1);
    }
  };

  const handleCapture = async () => {
    if (shotsUsed >= shotLimit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (cooldownLeft > 0 || timerCountdown !== null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (timerMode !== 'off') {
      let timeLeft = timerMode === '3s' ? 3 : 10;
      setTimerCountdown(timeLeft);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const interval = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft > 0) {
          setTimerCountdown(timeLeft);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          clearInterval(interval);
          setTimerCountdown(null);
          executeCapture();
        }
      }, 1000);
      return;
    }

    await executeCapture();
  };

  const toggleFacing = () => {
    if (!allowFrontCamera) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(f => f === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    if (!allowFlash) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlash(f => f === 'off' ? 'on' : f === 'on' ? 'auto' : 'off');
  };

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimerMode(t => t === 'off' ? '3s' : t === '3s' ? '10s' : 'off');
  };

  const shutterStyle = useAnimatedStyle(() => ({ transform: [{ scale: shutterScale.value }] }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));
  const counterStyle = useAnimatedStyle(() => ({ transform: [{ scale: counterScale.value }] }));
  const canCapture = shotsUsed < shotLimit && cooldownLeft === 0;

  return (
    <View style={s.root}>
      <CameraView 
        ref={cameraRef}
        style={s.camera} 
        facing={facing} 
        flash={flash}
      />

      {/* Screen flash effect */}
      <Animated.View style={[s.flashOverlay, flashStyle]} pointerEvents="none" />

      {/* Viewfinder frame overlay */}
      <View style={s.frameOverlay} pointerEvents="none">
        <View style={s.cornerTL} />
        <View style={s.cornerTR} />
        <View style={s.cornerBL} />
        <View style={s.cornerBR} />
      </View>

      {/* Top Bar */}
      <View style={s.topBar}>
        <View style={s.styleBadge}>
          <Text style={s.styleText}>{cameraStyle.replace('_', ' ').toUpperCase()}</Text>
        </View>
        
        <Pressable style={s.timerBtn} onPress={toggleTimer}>
          <Text style={s.timerBtnText}>{timerMode === 'off' ? '⏱️' : timerMode}</Text>
        </Pressable>

        <View style={s.counterStack}>
          {cooldownLeft > 0 && (
            <View style={s.cooldownBadge}>
              <Text style={s.cooldownText}>COOLDOWN {cooldownLeft}s</Text>
            </View>
          )}
          <Animated.View style={[s.counterWrap, counterStyle]}>
            <Text style={[s.counterNum, shotsUsed >= shotLimit && s.counterEmpty]}>
              {Math.max(0, shotLimit - shotsUsed)}
            </Text>
            <Text style={s.counterLabel}>left</Text>
          </Animated.View>
        </View>
      </View>

      {/* Controls */}
      {timerCountdown !== null && (
        <View style={s.bigTimer}>
          <Text style={s.bigTimerText}>{timerCountdown}</Text>
        </View>
      )}

      <View style={s.controls}>
        <View style={s.controlsSide}>
          {allowFlash ? (
            <Pressable style={s.iconBtn} onPress={toggleFlash}>
              <Text style={s.iconEmoji}>{flash === 'off' ? '📴' : flash === 'on' ? '⚡' : '✨'}</Text>
            </Pressable>
          ) : (
            <View style={s.iconSpacer} />
          )}
        </View>
        
        <Animated.View style={shutterStyle}>
          <Pressable 
            style={[s.shutter, !canCapture && s.shutterDisabled]} 
            onPress={handleCapture}
          >
            <View style={[s.shutterInner, !canCapture && s.shutterInnerDisabled]} />
          </Pressable>
        </Animated.View>

        <View style={s.controlsSide}>
          {allowFrontCamera ? (
            <Pressable style={s.iconBtn} onPress={toggleFacing}>
              <Text style={s.iconEmoji}>🔄</Text>
            </Pressable>
          ) : (
            <View style={s.iconSpacer} />
          )}
        </View>
      </View>

      <View style={s.grain} pointerEvents="none" />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.charcoal },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.void, padding: 24 },
  text: { fontFamily: fonts.body, color: colors.parchment },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontFamily: fonts.heading, fontSize: 24, color: colors.cream, marginBottom: 8 },
  desc: { fontFamily: fonts.body, fontSize: 14, color: colors.parchment, textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: colors.amber, paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.md },
  btnText: { fontFamily: fonts.headingSemiBold, fontSize: 15, color: colors.void },
  
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF', zIndex: 20 },
  
  frameOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 10, justifyContent: 'center', alignItems: 'center', padding: 40 },
  cornerTL: { position: 'absolute', top: 100, left: 24, width: 40, height: 40, borderTopWidth: 2, borderLeftWidth: 2, borderColor: colors.cream + '80' },
  cornerTR: { position: 'absolute', top: 100, right: 24, width: 40, height: 40, borderTopWidth: 2, borderRightWidth: 2, borderColor: colors.cream + '80' },
  cornerBL: { position: 'absolute', bottom: 180, left: 24, width: 40, height: 40, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: colors.cream + '80' },
  cornerBR: { position: 'absolute', bottom: 180, right: 24, width: 40, height: 40, borderBottomWidth: 2, borderRightWidth: 2, borderColor: colors.cream + '80' },

  topBar: { position: 'absolute', top: 60, left: 24, right: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 15 },
  styleBadge: { backgroundColor: colors.void + 'CC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  styleText: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 2, color: colors.amber },
  timerBtn: { backgroundColor: colors.void + 'CC', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  timerBtnText: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.cream },
  counterStack: { alignItems: 'flex-end', gap: 6 },
  cooldownBadge: { backgroundColor: colors.void + 'CC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.amber + '50' },
  cooldownText: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 1, color: colors.amber },
  counterWrap: { backgroundColor: colors.void + 'CC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.md, alignItems: 'center' },
  counterNum: { fontFamily: fonts.mono, fontSize: 28, color: colors.amber },
  counterEmpty: { color: colors.coral },
  counterLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.parchment },

  controls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, zIndex: 15 },
  controlsSide: { width: 56, alignItems: 'center' },
  iconBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.void + '80', justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 24 },
  iconSpacer: { width: 56, height: 56 },
  
  shutter: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: colors.cream, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  shutterDisabled: { borderColor: colors.ash },
  shutterInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.cream },
  shutterInnerDisabled: { backgroundColor: colors.ash },
  
  bigTimer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 30 },
  bigTimerText: { fontFamily: fonts.heading, fontSize: 120, color: colors.cream, textShadowColor: colors.void, textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 10 },

  grain: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.filmGrain, zIndex: 5, pointerEvents: 'none' },
});
