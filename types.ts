export interface ContentItem {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: string;
  year: number;
  genres: string[];
  videoId?: string;
  communityRating: number;
  ratingCount: number;
  userRating?: number;
}
