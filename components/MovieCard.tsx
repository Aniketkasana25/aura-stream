import React from 'react';
import { ContentItem } from '../types';
import StarRating from './StarRating';

interface MovieCardProps {
  item: ContentItem;
  onPlay: (videoId?: string) => void;
  onShowDetails: (item: ContentItem) => void;
  watchlist: number[];
  toggleWatchlist: (itemId: number) => void;
}

const PlayCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const InfoCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);


const MovieCard: React.FC<MovieCardProps> = ({ item, onPlay, onShowDetails, watchlist, toggleWatchlist }) => {
  const isInWatchlist = watchlist.includes(item.id);

  return (
    <div 
      className="group relative flex-shrink-0 w-40 md:w-52 lg:w-60 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-brand-purple/20 hover:z-10"
    >
      <div className="aspect-[2/3]">
        <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end">
        <div className="p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="font-bold text-white text-sm">{item.title}</h4>
          <div className="text-xs text-gray-300 mt-1">
              <StarRating rating={item.communityRating} maxRating={5} />
          </div>
          <div className="mt-4 flex justify-start items-center space-x-2">
              {item.videoId && (
                <button onClick={() => onPlay(item.videoId)} title="Play" className="text-white hover:text-brand-purple transition-colors">
                  <PlayCircleIcon />
                </button>
              )}
              <button onClick={() => toggleWatchlist(item.id)} title={isInWatchlist ? "Remove from List" : "Add to List"} className="text-white hover:text-brand-purple transition-colors">
                {isInWatchlist ? <CheckCircleIcon /> : <PlusCircleIcon />}
              </button>
              <button onClick={() => onShowDetails(item)} title="More Info" className="text-white hover:text-brand-purple transition-colors">
                <InfoCircleIcon />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;