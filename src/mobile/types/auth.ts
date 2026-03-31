export interface AuthSessionResponse {
  id: number;
  token: string;
  firstname: string;
  lastname?: string | null;
  phone?: string | null;
  role?: string[] | string | null;
  profilePictureUrl?: string | null;
  telegramId?: number | null;
  telegramUsername?: string | null;
  telegramLanguageCode?: string | null;
  telegramPhotoUrl?: string | null;
  telegramLinked?: boolean | null;
}

export interface CurrentUserResponse {
  id: number;
  firstname: string;
  lastname?: string | null;
  phone?: string | null;
  roles: string[];
  isActive: boolean;
  profilePictureUrl?: string | null;
  telegramId?: number | null;
  telegramUsername?: string | null;
  telegramLanguageCode?: string | null;
  telegramPhotoUrl?: string | null;
  telegramLinked: boolean;
}

export interface AuthenticatedUser {
  id: number;
  firstname: string;
  lastname?: string | null;
  phone?: string | null;
  roles: string[];
  isActive: boolean;
  profilePictureUrl?: string | null;
  telegramId?: number | null;
  telegramUsername?: string | null;
  telegramLanguageCode?: string | null;
  telegramPhotoUrl?: string | null;
  telegramLinked: boolean;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';
