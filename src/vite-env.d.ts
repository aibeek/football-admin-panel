/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface TelegramWebApp {
	initData: string;
	initDataUnsafe?: {
		user?: {
			id: number;
			first_name?: string;
			last_name?: string;
			username?: string;
			language_code?: string;
			photo_url?: string;
		};
	};
	platform?: string;
	colorScheme?: 'light' | 'dark';
	themeParams?: Record<string, string>;
	ready: () => void;
	expand: () => void;
	disableVerticalSwipes?: () => void;
	close?: () => void;
	HapticFeedback?: {
		impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
	};
}

interface Window {
	Telegram?: {
		WebApp?: TelegramWebApp;
	};
}
