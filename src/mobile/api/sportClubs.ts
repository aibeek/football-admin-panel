import { http } from './http';
import type { PageResponse } from '@/mobile/types/common';
import type { SportClubDetail, SportClubItem } from '@/mobile/types/sportClubs';

export const sportClubsApi = {
  async getPreview(limit = 4) {
    const { data } = await http.get<PageResponse<SportClubItem>>(
      `/sport-clubs/public?page=0&size=${limit}&active=true`,
    );
    return data.content;
  },

  async getById(id: number) {
    const { data } = await http.get<SportClubDetail>(`/sport-clubs/public/${id}`);
    return data;
  },
};
