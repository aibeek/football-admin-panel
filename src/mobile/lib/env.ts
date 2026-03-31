const fallbackApiBaseUrl = 'https://sport-empire.kz/api/v1';

export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, ''),
};
