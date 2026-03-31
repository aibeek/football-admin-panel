import { http } from './http';
import type { AuthSessionResponse, CurrentUserResponse } from '@/mobile/types/auth';

export const authApi = {
  async loginWithTelegram(initData: string) {
    const { data } = await http.post<AuthSessionResponse>('/auth/telegram', { initData });
    return data;
  },

  async getMe() {
    const { data } = await http.get<CurrentUserResponse>('/auth/me');
    return data;
  },
};
