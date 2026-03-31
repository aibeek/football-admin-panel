import type { MatchItem } from '@/mobile/types/matches';

export interface MatchGroup {
  key: string;
  title: string;
  subtitle: string;
  items: MatchItem[];
}

export const groupMatchesByTournament = (items: MatchItem[]) => {
  const groups = new Map<string, MatchGroup>();

  items.forEach((item) => {
    const title = item.tournament?.name || 'Sport Empire Open Matches';
    const subtitle = item.reservation?.playground?.name || 'Football';
    const key = `${title}:${subtitle}`;
    const existing = groups.get(key);

    if (existing) {
      existing.items.push(item);
      return;
    }

    groups.set(key, {
      key,
      title,
      subtitle,
      items: [item],
    });
  });

  return Array.from(groups.values());
}
