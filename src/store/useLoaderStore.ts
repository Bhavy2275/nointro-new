import { create } from 'zustand';

interface LoaderState {
  loadedCount: number;
  targetVideos: number;
  isLoaderFinished: boolean;
  incrementLoaded: () => void;
  setLoaderFinished: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  loadedCount: 0,
  targetVideos: 3, // Wait for the first 3 videos to load
  isLoaderFinished: false,
  
  incrementLoaded: () => set((state) => ({ 
    loadedCount: Math.min(state.loadedCount + 1, state.targetVideos) 
  })),
  
  setLoaderFinished: () => set({ isLoaderFinished: true }),
}));
