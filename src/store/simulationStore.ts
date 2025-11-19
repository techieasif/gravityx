import { create } from 'zustand';

interface SimulationState {
    speed: number;
    gravityConstant: number;
    resetKey: number;
    setSpeed: (speed: number) => void;
    setGravityConstant: (g: number) => void;
    reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    speed: 1,
    gravityConstant: 0.1,
    resetKey: 0,
    setSpeed: (speed) => set({ speed }),
    setGravityConstant: (gravityConstant) => set({ gravityConstant }),
    reset: () => set((state) => ({ resetKey: state.resetKey + 1 })),
}));
