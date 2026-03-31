import { create } from 'zustand';
import { authApi } from '@/mobile/api/auth';
import { getErrorMessage, mobileTokenStorageKey } from '@/mobile/api/http';
import { useShellStore } from './shellStore';
import type {
  AuthSessionResponse,
  AuthStatus,
  AuthenticatedUser,
  CurrentUserResponse,
} from '@/mobile/types/auth';

interface AuthState {
  status: AuthStatus;
  user: AuthenticatedUser | null;
  error: string | null;
  bootstrapped: boolean;
  bootstrap: () => Promise<void>;
  loginWithTelegram: () => Promise<void>;
  loadProfile: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const normalizeRoles = (roles?: string[] | string | null) => {
  if (!roles) {
    return [];
  }

  return Array.isArray(roles) ? roles : [roles];
};

const mapSessionUser = (payload: AuthSessionResponse): AuthenticatedUser => ({
  id: payload.id,
  firstname: payload.firstname,
  lastname: payload.lastname,
  phone: payload.phone,
  roles: normalizeRoles(payload.role),
  isActive: true,
  profilePictureUrl: payload.profilePictureUrl,
  telegramId: payload.telegramId,
  telegramUsername: payload.telegramUsername,
  telegramLanguageCode: payload.telegramLanguageCode,
  telegramPhotoUrl: payload.telegramPhotoUrl,
  telegramLinked: Boolean(payload.telegramLinked ?? payload.telegramId),
});

const mapCurrentUser = (payload: CurrentUserResponse): AuthenticatedUser => ({
  id: payload.id,
  firstname: payload.firstname,
  lastname: payload.lastname,
  phone: payload.phone,
  roles: payload.roles || [],
  isActive: payload.isActive,
  profilePictureUrl: payload.profilePictureUrl,
  telegramId: payload.telegramId,
  telegramUsername: payload.telegramUsername,
  telegramLanguageCode: payload.telegramLanguageCode,
  telegramPhotoUrl: payload.telegramPhotoUrl,
  telegramLinked: payload.telegramLinked,
});

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  error: null,
  bootstrapped: false,

  bootstrap: async () => {
    const state = get();
    if (state.bootstrapped || state.status === 'loading') {
      return;
    }

    set({ status: 'loading', error: null });

    const storedToken = localStorage.getItem(mobileTokenStorageKey);
    if (storedToken) {
      try {
        const currentUser = await authApi.getMe();
        set({
          status: 'authenticated',
          user: mapCurrentUser(currentUser),
          bootstrapped: true,
        });
        return;
      } catch {
        localStorage.removeItem(mobileTokenStorageKey);
      }
    }

    const runtime = useShellStore.getState().runtime;
    if (runtime.initData) {
      await get().loginWithTelegram();
      return;
    }

    set({
      status: 'anonymous',
      user: null,
      error: null,
      bootstrapped: true,
    });
  },

  loginWithTelegram: async () => {
    const runtime = useShellStore.getState().runtime;

    if (!runtime.initData) {
      set({
        status: 'anonymous',
        error: 'Telegram initData недоступен. Этот вход работает только внутри Telegram Mini App.',
        bootstrapped: true,
      });
      return;
    }

    set({ status: 'loading', error: null });

    try {
      const session = await authApi.loginWithTelegram(runtime.initData);
      localStorage.setItem(mobileTokenStorageKey, session.token);

      set({
        status: 'authenticated',
        user: mapSessionUser(session),
        error: null,
        bootstrapped: true,
      });
    } catch (error) {
      localStorage.removeItem(mobileTokenStorageKey);
      set({
        status: 'anonymous',
        user: null,
        error: getErrorMessage(error),
        bootstrapped: true,
      });
    }
  },

  loadProfile: async () => {
    if (!localStorage.getItem(mobileTokenStorageKey)) {
      return;
    }

    set({ status: 'loading', error: null });

    try {
      const currentUser = await authApi.getMe();
      set({
        status: 'authenticated',
        user: mapCurrentUser(currentUser),
        error: null,
        bootstrapped: true,
      });
    } catch (error) {
      localStorage.removeItem(mobileTokenStorageKey);
      set({
        status: 'anonymous',
        user: null,
        error: getErrorMessage(error),
        bootstrapped: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem(mobileTokenStorageKey);
    set({
      status: 'anonymous',
      user: null,
      error: null,
      bootstrapped: true,
    });
  },

  clearError: () => set({ error: null }),
}));
