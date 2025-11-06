import React from 'react';
import { ContentItem } from '../types';
import MovieCard from './MovieCard';

interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
  onPlay: (videoId?: string) => void;
  onShowDetails: (item: ContentItem) => void;
  watchlist: number[];
  toggleWatchlist: (itemId: number) => void;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, onPlay, onShowDetails, watchlist, toggleWatchlist }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl md:text-2xl font-bold text-white container mx-auto px-4 sm:px-6 lg:px-8">
        {title}
      </h3>
      <div className="relative">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex space-x-4 px-4 sm:px-6 lg:px-8">
            {items.map((item) => (
              <MovieCard 
                key={item.id} 
                item={item} 
                onPlay={onPlay}
                onShowDetails={onShowDetails}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            ))}
            <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;