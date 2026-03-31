import { http } from './http';
import type { PageResponse } from '@/mobile/types/common';
import type { NewsFeedQuery, NewsListItem } from '@/mobile/types/news';

export const newsApi = {
  async getRecent(limit = 6) {
    const { data } = await http.get<NewsListItem[]>(`/news/public/recent?limit=${limit}`);
    return data;
  },

  async getFeed(query: NewsFeedQuery = {}) {
    const params = new URLSearchParams();

    if (query.keyword) {
      params.append('keyword', query.keyword);
    }

    if (query.page !== undefined) {
      params.append('page', String(query.page));
    }

    if (query.size !== undefined) {
      params.append('size', String(query.size));
    }

    params.append('sort', 'publishedAt,desc');

    const { data } = await http.get<PageResponse<NewsListItem>>(`/news/public/feed?${params.toString()}`);
    return data;
  },
};
