import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
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
}

/**
 * Handles the background uploading of captured photos to Supabase.
 * It decodes the local file to base64 and uploads it.
 */
export const UploadService = {
  async processUpload(task: UploadTask): Promise<{ photoId: string | null; error: Error | null }> {
    try {
      const { id, uri, eventId, participantId, cameraStyle, latitude, longitude } = task;

      // 1. Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });

      // 2. Generate storage path: {eventId}/{participantId}/{uuid}.jpg
      const storagePath = `${eventId}/${participantId}/${id}.jpg`;

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(storagePath, decode(base64Data), {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Create the photo record
      const { data: photoRecord, error: recordError } = await supabase
        .from('photos')
        .insert({
          id, // use the same UUID for the photo record
          event_id: eventId,
          uploader_id: participantId,
          storage_path: storagePath,
          upload_status: 'complete',
          camera_style_used: cameraStyle,
          latitude: latitude || null,
          longitude: longitude || null,
          is_approved: true, // Defaulting to true, assuming no strict moderation for now
          is_revealed: false,
        } as any)
        .select()
        .single();

      if (recordError) throw recordError;

      // 5. Decrement shot safely via RPC
      const { error: rpcError } = await supabase.rpc('decrement_shot_and_return' as any, {
        p_participant_id: participantId,
        p_event_id: eventId,
      } as any);

      if (rpcError) throw rpcError;

      // 6. Log shot usage
      await supabase.from('shot_usage').insert({
        participant_id: participantId,
        event_id: eventId,
        photo_id: id,
        action: 'captured',
      } as any);

      return { photoId: id, error: null };
    } catch (error) {
      console.error('Upload failed:', error);
      return { photoId: null, error: error as Error };
    }
  },
};
