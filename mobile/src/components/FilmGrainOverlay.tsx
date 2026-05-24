import React from 'react';
import { View, StyleSheet } from 'react-native';

export function FilmGrainOverlay() {
  // Use a static noise fill for now.
  // In a full implementation, you can animate a noise texture or use an SVG filter.
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { 
          opacity: 0.04, 
          pointerEvents: 'none',
          backgroundColor: '#000', // Mocking the grain overlay
        }
      ]}
    />
  );
}
