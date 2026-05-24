import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors as themeColors, fonts, radius } from '@/theme';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  logo?: any;
  fgColor?: string;
  bgColor?: string;
}

export const QRCodeDisplay = forwardRef<any, QRCodeDisplayProps>(({ 
  value, 
  size = 200, 
  logo,
  fgColor = themeColors.void,
  bgColor = themeColors.cream
}, ref) => {
  return (
    <View style={styles.container}>
      <View style={[styles.qrWrapper, { backgroundColor: bgColor }]}>
        <QRCode
          getRef={(c) => { if (typeof ref === 'function') ref(c); else if (ref) ref.current = c; }}
          value={value}
          size={size}
          color={fgColor}
          backgroundColor={bgColor}
          logo={logo}
          logoSize={size * 0.25}
          logoBackgroundColor={bgColor}
          logoBorderRadius={radius.sm}
        />
      </View>
      <Text style={styles.instruction}>Scan to join the event</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWrapper: {
    padding: 16,
    borderRadius: radius.lg,
    shadowColor: themeColors.void,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  instruction: {
    marginTop: 16,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: themeColors.parchment,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
