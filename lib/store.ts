import { create } from "zustand";

type AppState = {
  booted: boolean;
  setBooted: (v: boolean) => void;
  selectedPlanet: string | null;
  setSelectedPlanet: (id: string | null) => void;
  timeScale: number;
  setTimeScale: (v: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  booted: false,
  setBooted: (v) => set({ booted: v }),
  selectedPlanet: null,
  setSelectedPlanet: (id) => set({ selectedPlanet: id }),
  timeScale: 1,
  setTimeScale: (v) => set({ timeScale: v }),
}));
