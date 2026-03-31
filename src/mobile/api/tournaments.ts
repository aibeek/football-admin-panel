import { http } from './http';
import type { PageResponse } from '@/mobile/types/common';
import type { TournamentDetail, TournamentItem } from '@/mobile/types/tournaments';

export const tournamentsApi = {
  async getPreview(limit = 4) {
    const { data } = await http.get<PageResponse<TournamentItem>>(`/tournaments/public?page=0&size=${limit}`);
    return data.content;
  },

  async getById(id: number) {
    const { data } = await http.get<TournamentDetail>(`/tournaments/public/${id}`);
    return data;
  },
};
