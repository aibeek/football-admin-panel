import { http } from './http';
import type { MatchFeedQuery, MatchItem } from '@/mobile/types/matches';
import type { PageResponse } from '@/mobile/types/common';

export const matchesApi = {
  async getFeed(query: MatchFeedQuery = {}) {
    const params = new URLSearchParams();

    if (query.status && query.status !== 'ALL') {
      params.append('status', query.status);
    }

    if (query.page !== undefined) {
      params.append('page', String(query.page));
    }

    if (query.size !== undefined) {
      params.append('size', String(query.size));
    }

    if (query.date) {
      params.append('date', query.date);
    }

    const { data } = await http.get<PageResponse<MatchItem>>(`/matches/public/feed?${params.toString()}`);
    return data;
  },
};
