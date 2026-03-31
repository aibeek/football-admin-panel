import { create } from 'zustand';
import { getErrorMessage } from '@/mobile/api/http';
import { matchesApi } from '@/mobile/api/matches';
import type { MatchFeedQuery, MatchItem, MatchStatusFilter } from '@/mobile/types/matches';

const pageSize = 10;

interface MatchFeedState {
  items: MatchItem[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  status: MatchStatusFilter;
  date: string;
  loadInitial: (status?: MatchStatusFilter, date?: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const createQuery = (status: MatchStatusFilter, page: number, date?: string): MatchFeedQuery => ({
  status,
  page,
  size: pageSize,
  date,
});

export const useMatchFeedStore = create<MatchFeedState>((set, get) => ({
  items: [],
  page: 0,
  totalPages: 0,
  loading: false,
  error: null,
  status: 'ALL',
  date: '',

  loadInitial: async (status = 'ALL', date = '') => {
    set({ loading: true, error: null, status, date });

    try {
      const response = await matchesApi.getFeed(createQuery(status, 0, date || undefined));

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
      const response = await matchesApi.getFeed(createQuery(state.status, state.page + 1, state.date || undefined));

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
