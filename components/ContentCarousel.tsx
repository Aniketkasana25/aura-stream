import React, { useState, useEffect, useRef } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation only once when the element becomes visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Animate when 10% of the carousel is visible
      }
    );

    const currentRef = carouselRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div 
      ref={carouselRef}
      className={`space-y-4 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
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