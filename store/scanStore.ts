import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult } from '@/types';

interface ScanState {
  history: ScanResult[];
  currentScan: ScanResult | null;
  isScanning: boolean;
  isAnalyzing: boolean;
  
  // Actions
  setCurrentScan: (scan: ScanResult | null) => void;
  addToHistory: (scan: ScanResult) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  setIsScanning: (isScanning: boolean) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      history: [],
      currentScan: null,
      isScanning: false,
      isAnalyzing: false,
      
      setCurrentScan: (scan) => set({ currentScan: scan }),
      addToHistory: (scan) => set((state) => ({ 
        history: [scan, ...state.history],
        currentScan: scan
      })),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter((scan) => scan.id !== id)
      })),
      clearHistory: () => set({ history: [] }),
      setIsScanning: (isScanning) => set({ isScanning }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
    }),
    {
      name: 'scan-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);