export interface NewsListItem {
  id: number;
  title: string;
  summary: string;
  imageUrl?: string | null;
  tags: string[];
  category: string;
  viewCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt?: string;
  authorName?: string;
  slug?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  images?: string[];
  tags: string[];
  category: string;
  viewCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  publishedAt?: string;
  slug?: string;
  author?: {
    firstName: string;
    lastName: string;
  } | null;
}

export interface NewsFeedQuery {
  page?: number;
  size?: number;
  keyword?: string;
}

export type NewsPreview = NewsListItem | NewsArticle;
