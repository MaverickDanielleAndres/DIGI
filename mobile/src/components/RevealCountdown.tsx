import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { differenceInSeconds } from 'date-fns';
import { colors, fonts, radius } from '@/theme';

interface RevealCountdownProps {
  targetDate: string; // ISO string
  onComplete?: () => void;
}

export function RevealCountdown({ targetDate, onComplete }: RevealCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.floor((target - now) / 1000);
      
      if (diff <= 0) {
        setTimeLeft(0);
        onComplete?.();
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <View style={s.container}>
      <Text style={s.label}>MEMORIES UNLOCK IN</Text>
      
      <View style={s.timerRow}>
        {days > 0 && (
          <>
            <View style={s.block}>
              <Text style={s.number}>{pad(days)}</Text>
              <Text style={s.unit}>DAYS</Text>
            </View>
            <Text style={s.colon}>:</Text>
          </>
        )}
        <View style={s.block}>
          <Text style={s.number}>{pad(hours)}</Text>
          <Text style={s.unit}>HRS</Text>
        </View>
        <Text style={s.colon}>:</Text>
        <View style={s.block}>
          <Text style={s.number}>{pad(minutes)}</Text>
          <Text style={s.unit}>MIN</Text>
        </View>
        <Text style={s.colon}>:</Text>
        <View style={s.block}>
          <Text style={s.number}>{pad(seconds)}</Text>
          <Text style={s.unit}>SEC</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: colors.charcoal,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.smoke,
    marginVertical: 24,
    marginHorizontal: 16,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amber,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    alignItems: 'center',
    minWidth: 48,
  },
  number: {
    fontFamily: fonts.mono,
    fontSize: 32,
    color: colors.cream,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.ash,
    marginTop: 4,
  },
  colon: {
    fontFamily: fonts.mono,
    fontSize: 24,
    color: colors.smoke,
    marginHorizontal: 8,
    paddingBottom: 16,
  },
});
