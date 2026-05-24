import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '@/theme/colors';
import { textStyles, fonts } from '@/theme/typography';
import { radius, spacing } from '@/theme/spacing';

export interface MemoryNoteSheetProps {
  note: { text: string; author?: string };
  onClose: () => void;
}

export function MemoryNoteSheet({ note, onClose }: MemoryNoteSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['40%', '60%'];

  // Typewriter text reveal
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(note.text.slice(0, i));
      i++;
      if (i > note.text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [note.text]);

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.charcoal, borderRadius: radius.lg }}
      handleIndicatorStyle={{ backgroundColor: colors.smoke }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.header}>📝 Memory Note</Text>
        <Text style={[textStyles.note, styles.noteText]}>{displayedText}</Text>
        {note.author && (
          <Text style={[textStyles.small, styles.authorText]}>— {note.author}</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: spacing[6],
    alignItems: 'flex-start',
  },
  header: {
    ...textStyles.h3,
    color: colors.blush,
    marginBottom: spacing[4],
  },
  noteText: {
    color: colors.cream,
    fontSize: 22, // Slightly larger for readability
    lineHeight: 32,
  },
  authorText: {
    color: colors.parchment,
    marginTop: spacing[4],
    fontStyle: 'italic',
  }
});
