// store/workoutStore.ts
import { create } from "zustand";

type WorkoutState = {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  isRunning: false,
  setIsRunning: (value) => set({ isRunning: value }),
}));
