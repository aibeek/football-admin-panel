export interface TournamentItem {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  numberOfMatches?: number;
  sportTypeId?: number;
  categoryId?: number;
  cityId?: number;
}

export type TournamentDetail = TournamentItem;
