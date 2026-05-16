import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { UploadStatus } from '@/types';

interface UploadTask {
  id: string;
  uri: string;
  eventId: string;
  participantId: string;
  cameraStyle: string;
  latitude?: number;
  longitude?: number;
  capturedAt?: string;
}

/**
 * Handles the background uploading of captured photos to Supabase.
 * It decodes the local file to base64 and uploads it.
 */
export const UploadService = {
  async processUpload(task: UploadTask): Promise<{ photoId: string | null; error: Error | null }> {
    try {
      const { id, uri, eventId, participantId, cameraStyle, latitude, longitude, capturedAt } = task;

      // 1. Compress + convert to WebP before upload
      const compressed = await manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.82, format: SaveFormat.WEBP }
      );

      const fileInfo = await FileSystem.getInfoAsync(compressed.uri);
      const fileSizeBytes = fileInfo.exists ? fileInfo.size : null;
      const mimeType = 'image/webp';

      // 2. Request a signed upload URL from Edge Function
      const { data: signedData, error: signedError } = await supabase.functions.invoke(
        'generate-upload-url',
        {
          body: {
            eventId,
            participantId,
            fileSizeBytes,
            mimeType,
            fileNameHint: `${id}.webp`,
          },
        }
      );

      if (signedError || !signedData?.signedUrl || !signedData?.path) {
        throw signedError || new Error('Failed to get signed upload URL');
      }

      // 3. Upload to signed URL
      const uploadResult = await FileSystem.uploadAsync(signedData.signedUrl, compressed.uri, {
        httpMethod: 'PUT',
        headers: {
          'Content-Type': mimeType,
        },
      });

      if (uploadResult.status < 200 || uploadResult.status >= 300) {
        throw new Error(`Signed upload failed (${uploadResult.status})`);
      }

      // 4. Finalize upload + create DB record server-side
      const { data: finalizeData, error: finalizeError } = await supabase.functions.invoke(
        'finalize-upload',
        {
          body: {
            eventId,
            participantId,
            storagePath: signedData.path,
            cameraStyle,
            width: compressed.width,
            height: compressed.height,
            fileSizeBytes,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            capturedAt: capturedAt ?? new Date().toISOString(),
          },
        }
      );

      if (finalizeError || !finalizeData?.photoId) {
        throw finalizeError || new Error('Finalize upload failed');
      }

      return { photoId: finalizeData.photoId as string, error: null };
    } catch (error) {
      console.error('Upload failed:', error);
      return { photoId: null, error: error as Error };
    }
  },
};
