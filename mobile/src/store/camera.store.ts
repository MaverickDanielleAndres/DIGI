import { create } from 'zustand';
import { UploadService } from '@/lib/uploadService';

interface LocalPhoto {
  id: string;
  uri: string;
  status: 'pending' | 'uploading' | 'complete' | 'failed';
}

interface CameraState {
  queue: LocalPhoto[];
  
  // Actions
  addPhotoToQueue: (id: string, uri: string) => void;
  processQueue: (eventId: string, participantId: string, cameraStyle: string) => Promise<void>;
  clearCompleted: () => void;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  queue: [],

  addPhotoToQueue: (id, uri) => {
    set((s) => ({
      queue: [...s.queue, { id, uri, status: 'pending' }],
    }));
  },

  processQueue: async (eventId, participantId, cameraStyle) => {
    const { queue } = get();
    
    // Find all pending photos
    const pendingPhotos = queue.filter(p => p.status === 'pending' || p.status === 'failed');
    
    for (const photo of pendingPhotos) {
      // Mark as uploading
      set((s) => ({
        queue: s.queue.map(p => p.id === photo.id ? { ...p, status: 'uploading' } : p)
      }));

      // Upload via service
      const { error } = await UploadService.processUpload({
        id: photo.id,
        uri: photo.uri,
        eventId,
        participantId,
        cameraStyle,
      });

      // Update status
      set((s) => ({
        queue: s.queue.map(p => 
          p.id === photo.id 
            ? { ...p, status: error ? 'failed' : 'complete' } 
            : p
        )
      }));
    }
  },

  clearCompleted: () => {
    set((s) => ({
      queue: s.queue.filter(p => p.status !== 'complete')
    }));
  }
}));
