export type MatchStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MatchStatusFilter = MatchStatus | 'ALL';

export interface MatchTournament {
  id: number;
  name: string;
}

export interface MatchParticipant {
  id: number;
  teamId: number;
  teamName: string;
  score: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
}

export interface MatchPlayground {
  id: number;
  name: string;
  address?: string;
  maxCapacity?: number;
}

export interface MatchReservation {
  id: number;
  startTime?: string;
  endTime?: string;
  playground?: MatchPlayground;
}

export interface MatchItem {
  id: number;
  startTime?: string;
  endTime?: string;
  tournament?: MatchTournament | null;
  participants: MatchParticipant[];
  status: MatchStatus;
  reservation?: MatchReservation | null;
  description?: string;
}

export interface MatchFeedQuery {
  status?: MatchStatusFilter;
  page?: number;
  size?: number;
  date?: string;
}
