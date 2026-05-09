import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, fonts, radius } from '@/theme';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  logo?: any;
}

export function QRCodeDisplay({ value, size = 200, logo }: QRCodeDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={size}
          color={colors.void}
          backgroundColor={colors.cream}
          logo={logo}
          logoSize={size * 0.25}
          logoBackgroundColor={colors.cream}
          logoBorderRadius={radius.sm}
        />
      </View>
      <Text style={styles.instruction}>Scan to join the event</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    shadowColor: colors.void,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  instruction: {
    marginTop: 16,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.parchment,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
