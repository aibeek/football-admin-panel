export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebAppContext {
  isTelegram: boolean;
  initData: string;
  user: TelegramWebAppUser | null;
}

export const initTelegramMiniApp = (): TelegramWebAppContext => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    return {
      isTelegram: false,
      initData: '',
      user: null
    };
  }

  tg.ready();
  tg.expand();

  return {
    isTelegram: true,
    initData: tg.initData,
    user: (tg.initDataUnsafe?.user as TelegramWebAppUser | undefined) ?? null
  };
};
