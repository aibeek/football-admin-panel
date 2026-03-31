export type RuntimePlatform = 'telegram' | 'browser';

export interface ShellRuntime {
  platform: RuntimePlatform;
  platformName: string;
  initData: string;
  colorScheme: 'light' | 'dark';
  user: TelegramWebAppUser | null;
}

export const defaultRuntime: ShellRuntime = {
  platform: 'browser',
  platformName: 'browser',
  initData: '',
  colorScheme: 'light',
  user: null,
};

export const initTelegramRuntime = (): ShellRuntime => {
  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return defaultRuntime;
  }

  webApp.ready();
  webApp.expand();
  webApp.disableVerticalSwipes?.();

  return {
    platform: 'telegram',
    platformName: webApp.platform || 'telegram',
    initData: webApp.initData || '',
    colorScheme: webApp.colorScheme === 'dark' ? 'dark' : 'light',
    user: webApp.initDataUnsafe?.user ?? null,
  };
};

export const getRuntimeLabel = (runtime: ShellRuntime) =>
  runtime.platform === 'telegram' ? 'Telegram Mini App' : 'Browser Preview';

export const getRuntimeUserName = (user: TelegramWebAppUser | null) => {
  if (!user) {
    return 'Гость';
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return name || user.username || `User #${user.id}`;
};
