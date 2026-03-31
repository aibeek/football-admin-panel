import { create } from 'zustand';
import { newsApi } from '@/mobile/api/news';
import { getErrorMessage } from '@/mobile/api/http';
import type { NewsListItem } from '@/mobile/types/news';

const pageSize = 8;

interface NewsFeedState {
  items: NewsListItem[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  query: string;
  loadInitial: (query?: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useNewsFeedStore = create<NewsFeedState>((set, get) => ({
  items: [],
  page: 0,
  totalPages: 0,
  loading: false,
  error: null,
  query: '',

  loadInitial: async (query = '') => {
    set({ loading: true, error: null, query });

    try {
      const response = await newsApi.getFeed({
        keyword: query || undefined,
        page: 0,
        size: pageSize,
      });

      set({
        items: response.content,
        page: response.number,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      set({
        items: [],
        loading: false,
        error: getErrorMessage(error),
      });
    }
  },

  loadMore: async () => {
    const state = get();

    if (state.loading || state.page + 1 >= state.totalPages) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await newsApi.getFeed({
        keyword: state.query || undefined,
        page: state.page + 1,
        size: pageSize,
      });

      set({
        items: [...state.items, ...response.content],
        page: response.number,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: getErrorMessage(error),
      });
    }
  },
}));
