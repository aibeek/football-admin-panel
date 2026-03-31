import { http } from './http';
import type { PageResponse } from '@/mobile/types/common';
import type { PlaygroundDetail, PlaygroundItem } from '@/mobile/types/playgrounds';

export const playgroundsApi = {
  async getPreview(limit = 4) {
    const { data } = await http.get<PageResponse<PlaygroundItem>>(`/playgrounds/public?page=0&size=${limit}`);
    return data.content;
  },

  async getById(id: number) {
    const { data } = await http.get<PlaygroundDetail>(`/playgrounds/public/${id}/with-facilities`);
    return data;
  },
};
