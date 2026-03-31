import { create } from 'zustand';
import { defaultRuntime, initTelegramRuntime, type ShellRuntime } from '@/mobile/lib/telegram';

interface ShellState {
  initialized: boolean;
  runtime: ShellRuntime;
  initialize: () => void;
}

export const useShellStore = create<ShellState>((set) => ({
  initialized: false,
  runtime: defaultRuntime,
  initialize: () => {
    set({
      initialized: true,
      runtime: initTelegramRuntime(),
    });
  },
}));
