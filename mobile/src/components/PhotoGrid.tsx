import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius } from '@/theme';
import type { Photo } from '@/types';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 2;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

interface PhotoGridProps {
  photos: Photo[];
  isRevealed: boolean;
  onPhotoPress: (photo: Photo, index: number) => void;
}

export function PhotoGrid({ photos, isRevealed, onPhotoPress }: PhotoGridProps) {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let isActive = true;
    
    const loadUrls = async () => {
      // Filter out photos that are already in signedUrls or are mystery placeholders
      const pathsToFetch = photos
        .filter(p => (isRevealed || p.is_revealed) && !signedUrls[p.storage_path])
        .map(p => p.storage_path);
        
      if (pathsToFetch.length === 0) return;

      const { data, error } = await supabase.storage
        .from('photos')
        .createSignedUrls(pathsToFetch, 60 * 60); // 1 hour expiry

      if (isActive && !error && data) {
        setSignedUrls(prev => {
          const next = { ...prev };
          data.forEach(item => {
            if (item.path && item.signedUrl) next[item.path as string] = item.signedUrl;
          });
          return next;
        });
      }
    };

    loadUrls();
    return () => { isActive = false; };
  }, [photos, isRevealed]);

  const renderItem = ({ item, index }: { item: Photo; index: number }) => {
    // Mystery placeholder if not revealed
    if (!isRevealed && !item.is_revealed) {
      return (
        <View style={[s.itemContainer, s.mysteryContainer]}>
          <Text style={s.mysteryEmoji}>⏳</Text>
        </View>
      );
    }

    const uri = signedUrls[item.storage_path];

    return (
      <Pressable style={s.itemContainer} onPress={() => onPhotoPress(item, index)}>
        {uri ? (
          <Image
            source={{ uri }}
            style={s.image}
            contentFit="cover"
            transition={200}
            cachePolicy="disk"
          />
        ) : (
          <View style={[s.itemContainer, s.mysteryContainer]} />
        )}
      </Pressable>
    );
  };

  if (photos.length === 0) {
    return (
      <View style={s.emptyContainer}>
        <Text style={s.emptyEmoji}>📸</Text>
        <Text style={s.emptyText}>No photos yet</Text>
      </View>
    );
  }

  return (
    <FlashList
      {...({
        data: photos,
        renderItem,
        keyExtractor: (item: Photo) => item.id,
        numColumns: COLUMN_COUNT,
        estimatedItemSize: ITEM_SIZE,
        contentContainerStyle: s.listContent
      } as any)}
    />
  );
}

const s = StyleSheet.create({
  listContent: { paddingBottom: 120 },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.2, // Slightly taller than square for vintage look
    marginBottom: SPACING,
    marginRight: SPACING,
    backgroundColor: colors.smoke,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mysteryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.smoke,
  },
  mysteryEmoji: {
    fontSize: 24,
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ash,
  },
});
