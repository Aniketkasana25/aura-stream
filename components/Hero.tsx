import React from 'react';
import { ContentItem } from '../types';

interface HeroProps {
  item: ContentItem;
  onPlay: (videoId?: string) => void;
  onShowDetails: (item: ContentItem) => void;
  watchlist: number[];
  toggleWatchlist: (itemId: number) => void;
}

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const Hero: React.FC<HeroProps> = ({ item, onPlay, onShowDetails, watchlist, toggleWatchlist }) => {
  const isInWatchlist = watchlist.includes(item.id);

  return (
    <div className="relative h-[50vh] md:h-[80vh] w-full">
      <div className="absolute inset-0 bg-gray-900">
        <img src={item.backdropUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/50 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full pb-10 md:pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white shadow-lg tracking-tight">
            {item.title}
          </h2>
          <div className="flex items-center mt-4 space-x-4 text-gray-300 text-sm">
            <span>{item.year}</span>
            <span className="border border-gray-400 px-1.5 py-0.5 rounded text-xs">{item.rating}</span>
            <span>{item.genres.join(', ')}</span>
          </div>
          <p className="mt-4 text-gray-200 line-clamp-3 md:line-clamp-none">
            {item.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => onPlay(item.videoId)}
              className="flex items-center justify-center px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-400"
              disabled={!item.videoId}
            >
              <PlayIcon />
              Play
            </button>
             <button 
              onClick={() => toggleWatchlist(item.id)}
              className="flex items-center justify-center px-6 py-3 bg-gray-600/70 text-white font-bold rounded-md hover:bg-gray-500/70 transition-colors"
            >
              {isInWatchlist ? <CheckIcon/> : <PlusIcon />}
              {isInWatchlist ? 'In My List' : 'Add to List'}
            </button>
            <button 
              onClick={() => onShowDetails(item)}
              className="flex items-center justify-center px-6 py-3 bg-gray-600/70 text-white font-bold rounded-md hover:bg-gray-500/70 transition-colors"
            >
              <InfoIcon />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;