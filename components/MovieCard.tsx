import React, { useState } from 'react';
import { ContentItem } from '../types';

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


interface MovieCardProps {
  item: ContentItem;
  onPlay: (videoId?: string) => void;
  onShowDetails: (item: ContentItem) => void;
  watchlist: number[];
  toggleWatchlist: (itemId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ item, onPlay, onShowDetails, watchlist, toggleWatchlist }) => {
  const isInWatchlist = watchlist.includes(item.id);

  return (
    <div
      className="group relative flex-shrink-0 w-40 md:w-48 lg:w-56 rounded-md overflow-hidden shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:z-10 cursor-pointer"
      onClick={() => onShowDetails(item)}
    >
      <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        <div className="flex-grow flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(item.videoId)
              }}
              className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!item.videoId}
              aria-label={`Play ${item.title}`}
            >
              <PlayIcon />
            </button>
        </div>
        
        <div className="relative z-10">
          <h4 className="text-white text-sm font-bold truncate">{item.title}</h4>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
             <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(item.id);
                  }}
                  className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-gray-400 hover:border-white transition-colors bg-black/50"
                  aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  {isInWatchlist ? <CheckIcon /> : <PlusIcon />}
                </button>
                 <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onShowDetails(item);
                  }}
                  className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-gray-400 hover:border-white transition-colors bg-black/50"
                  aria-label="More info"
                >
                  <ChevronDownIcon />
                </button>
            </div>
            <span className="font-semibold text-green-400">{item.communityRating.toFixed(1)}</span>
          </div>
          <p className="text-gray-400 text-xs mt-1 truncate">{item.genres.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
