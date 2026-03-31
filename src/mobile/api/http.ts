import axios, { AxiosError } from 'axios';
import { env } from '@/mobile/lib/env';
import { useShellStore } from '@/mobile/store/shellStore';

export const mobileTokenStorageKey = 'sport_mobile_access_token';

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(mobileTokenStorageKey);
  const initData = useShellStore.getState().runtime.initData;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }

  return config;
});

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const responseMessage =
      typeof error.response?.data?.message === 'string' ? error.response.data.message : null;

    if (responseMessage) {
      return responseMessage;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Сервер отвечает слишком долго.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Не удалось получить данные.';
};
