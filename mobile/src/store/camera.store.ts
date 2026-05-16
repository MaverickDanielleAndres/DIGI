import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UploadService } from '@/lib/uploadService';

interface LocalPhoto {
  id: string;
  uri: string;
  status: 'pending' | 'uploading' | 'complete' | 'failed';
  retryCount: number;
  lastError?: string | null;
  nextRetryAt?: number | null;
  createdAt: number;
  capturedAt: string;
}

interface CameraState {
  queue: LocalPhoto[];
  isProcessing: boolean;
  isHydrated: boolean;
  
  // Actions
  addPhotoToQueue: (id: string, uri: string) => void;
  processQueue: (eventId: string, participantId: string, cameraStyle: string) => Promise<void>;
  clearCompleted: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const MAX_RETRIES = 3;
const BASE_RETRY_MS = 5000;

const storage = createJSONStorage(() => {
  try {
    // Lazy require so web/metro doesn't break if module is unavailable.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({ id: 'digi' });
    return {
      getItem: (name: string) => mmkv.getString(name) ?? null,
      setItem: (name: string, value: string) => mmkv.set(name, value),
      removeItem: (name: string) => mmkv.delete(name),
    };
  } catch {
    return AsyncStorage;
  }
});

export const useCameraStore = create<CameraState>()(
  persist(
    (set, get) => ({
      queue: [],
      isProcessing: false,
      isHydrated: false,

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      addPhotoToQueue: (id, uri) => {
        const createdAt = Date.now();
        const capturedAt = new Date(createdAt).toISOString();
        set((s) => ({
          queue: [
            ...s.queue,
            {
              id,
              uri,
              status: 'pending',
              retryCount: 0,
              lastError: null,
              nextRetryAt: null,
              createdAt,
              capturedAt,
            },
          ],
        }));
      },

      processQueue: async (eventId, participantId, cameraStyle) => {
        if (get().isProcessing) return;
        set({ isProcessing: true });

        try {
          const { queue } = get();
          const now = Date.now();

          const pendingPhotos = queue.filter((p) => {
            if (p.status !== 'pending' && p.status !== 'failed') return false;
            if (p.retryCount >= MAX_RETRIES) return false;
            if (p.nextRetryAt && p.nextRetryAt > now) return false;
            return true;
          });

          for (const photo of pendingPhotos) {
            set((s) => ({
              queue: s.queue.map((p) =>
                p.id === photo.id ? { ...p, status: 'uploading' } : p
              ),
            }));

            const { error } = await UploadService.processUpload({
              id: photo.id,
              uri: photo.uri,
              eventId,
              participantId,
              cameraStyle,
              capturedAt: photo.capturedAt,
            });

            if (error) {
              const retryCount = photo.retryCount + 1;
              const delay = Math.min(BASE_RETRY_MS * 2 ** (retryCount - 1), 60000);
              set((s) => ({
                queue: s.queue.map((p) =>
                  p.id === photo.id
                    ? {
                        ...p,
                        status: 'failed',
                        retryCount,
                        lastError: error.message,
                        nextRetryAt: Date.now() + delay,
                      }
                    : p
                ),
              }));
            } else {
              set((s) => ({
                queue: s.queue.map((p) =>
                  p.id === photo.id
                    ? {
                        ...p,
                        status: 'complete',
                        lastError: null,
                        nextRetryAt: null,
                      }
                    : p
                ),
              }));
            }
          }
        } finally {
          set({ isProcessing: false });
        }
      },

      clearCompleted: () => {
        set((s) => ({
          queue: s.queue.filter((p) => p.status !== 'complete'),
        }));
      },
    }),
    {
      name: 'digi.camera.queue',
      storage,
      partialize: (state) => ({ queue: state.queue } as CameraState),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
