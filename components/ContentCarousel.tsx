import React, { useRef } from 'react';
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

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);


const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items, onPlay, onShowDetails, watchlist, toggleWatchlist }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="my-8 md:my-12">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 sm:px-6 lg:px-8">{title}</h3>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60 disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon />
        </button>
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide px-4 sm:px-6 lg:px-8"
        >
          {items.map(item => (
            <MovieCard 
              key={item.id} 
              item={item} 
              onPlay={onPlay} 
              onShowDetails={onShowDetails}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
            />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/60"
          aria-label="Scroll right"
        >
          <ChevronRightIcon />
        </button>
      </div>
       <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ContentCarousel;
