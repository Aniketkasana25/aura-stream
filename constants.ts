import { ContentItem } from './types';

// Helper function to generate mock content
const generateContent = (id: number, title: string, genres: string[], videoId?: string): ContentItem => ({
  id,
  title,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  posterUrl: `https://picsum.photos/seed/${id}/400/600`,
  backdropUrl: `https://picsum.photos/seed/${id}/1280/720`,
  rating: 'G',
  year: 2023,
  genres,
  videoId,
  communityRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5 and 5.0
  ratingCount: Math.floor(Math.random() * 2000) + 500,
});

export const FEATURED_CONTENT: ContentItem = {
    id: 100,
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://picsum.photos/seed/dune2/400/600',
    backdropUrl: 'https://picsum.photos/seed/dune2/1920/1080',
    rating: 'PG-13',
    year: 2024,
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    videoId: '1di4DWNIUuw',
    communityRating: 4.8,
    ratingCount: 12500,
};

const trendingItems: ContentItem[] = [
  generateContent(1, 'Cyber City', ['Sci-Fi', 'Action'], 'U_qZg_d7k_E'),
  generateContent(2, 'The Last Stand', ['Action', 'Thriller']),
  generateContent(3, 'Ocean\'s Depths', ['Documentary', 'Nature']),
  generateContent(4, 'Forgotten Kingdom', ['Fantasy', 'Adventure']),
  generateContent(5, 'Echoes of Time', ['Mystery', 'Drama']),
  generateContent(6, 'Zero Gravity', ['Sci-Fi', 'Thriller']),
  generateContent(7, 'The Baker\'s Dozen', ['Comedy', 'Family']),
  generateContent(8, 'Crimson Peak', ['Horror', 'Mystery']),
];

const natureVideos: ContentItem[] = [
    {
        id: 34,
        title: 'Whispering Woods',
        description: 'A calming journey through a lush, green forest, showcasing the serene beauty of nature.',
        posterUrl: `https://picsum.photos/seed/plants_video/400/600`,
        backdropUrl: `https://picsum.photos/seed/plants_video/1280/720`,
        rating: 'G',
        year: 2024,
        genres: ['Nature', 'Relaxation'],
        videoId: 'nature:yLz5_12k3_g', // Special ID for the nature video
        communityRating: 4.9,
        ratingCount: 5600,
    },
     generateContent(35, 'Coral Dreams', ['Nature', 'Documentary']),
     generateContent(36, 'Mountain Majesty', ['Nature', 'Travel']),
];


const actionMovies: ContentItem[] = [
  generateContent(9, 'Rogue Agent', ['Action', 'Spy']),
  generateContent(10, 'Final Pursuit', ['Action', 'Crime']),
  generateContent(11, 'Desert Fury', ['Action', 'War']),
  generateContent(12, 'Steel Fortress', ['Action', 'Sci-Fi']),
  generateContent(13, 'Crossfire', ['Action', 'Thriller']),
  generateContent(14, 'Vengeance Trail', ['Action', 'Western']),
  generateContent(15, 'Tidal Wave', ['Action', 'Disaster']),
  generateContent(16, 'Shadow Strike', ['Action', 'Stealth']),
];

const comedies: ContentItem[] = [
  generateContent(17, 'Just Kidding', ['Comedy']),
  generateContent(18, 'Family Reunion', ['Comedy', 'Family']),
  generateContent(19, 'Mishap Island', ['Comedy', 'Adventure']),
  generateContent(20, 'The Wrong Switch', ['Comedy', 'Romance']),
  generateContent(21, 'Professor Goofball', ['Comedy', 'Slapstick']),
  generateContent(22, 'Weekend Warriors', ['Comedy', 'Buddy']),
  generateContent(23, 'Holiday Hijinks', ['Comedy', 'Holiday']),
  generateContent(24, 'Office Pranks', ['Comedy', 'Workplace']),
];

const sciFi: ContentItem[] = [
  generateContent(25, 'Galaxy Quest 2', ['Sci-Fi', 'Comedy']),
  generateContent(26, 'Starfall', ['Sci-Fi', 'Adventure']),
  generateContent(27, 'The Void', ['Sci-Fi', 'Horror']),
  generateContent(28, 'Chrono Shift', ['Sci-Fi', 'Time Travel'], 'aWtcWut46dE'),
  generateContent(29, 'Android Dreams', ['Sci-Fi', 'Drama']),
  generateContent(30, 'Planet X', ['Sci-Fi', 'Exploration']),
  generateContent(31, 'The Grid', ['Sci-Fi', 'Cyberpunk']),
  generateContent(32, 'Alien Code', ['Sci-Fi', 'Mystery']),
  {
    id: 33,
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    posterUrl: `https://picsum.photos/seed/strangerthings/400/600`,
    backdropUrl: `https://picsum.photos/seed/strangerthings/1280/720`,
    rating: 'TV-14',
    year: 2016,
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    videoId: 'b9EkMc79ZSU',
    communityRating: 4.7,
    ratingCount: 25000,
  },
];

export const CONTENT_CATEGORIES = [
  { id: 'trending', title: 'Trending Now', items: trendingItems },
  { id: 'nature', title: "Nature's Serenity", items: natureVideos },
  { id: 'action', title: 'Action Packed', items: actionMovies },
  { id: 'comedy', title: 'Top Comedies', items: comedies },
  { id: 'scifi', title: 'Sci-Fi Worlds', items: sciFi },
];

export const ALL_CONTENT_ITEMS = CONTENT_CATEGORIES.flatMap(cat => cat.items).concat(FEATURED_CONTENT);