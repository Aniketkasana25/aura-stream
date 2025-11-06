import React, { useEffect } from 'react';
import { ContentItem } from '../types';
import StarRating from './StarRating';

interface MovieDetailsModalProps {
  item: ContentItem;
  onClose: () => void;
  onRate: (itemId: number, rating: number) => void;
  watchlist: number[];
  toggleWatchlist: (itemId: number) => void;
}

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

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ item, onClose, onRate, watchlist, toggleWatchlist }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!item) return null;

  const isInWatchlist = watchlist.includes(item.id);

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] backdrop-blur-sm animate-fade-in px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-brand-dark w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
            <img src={item.backdropUrl} alt={item.title} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent"></div>
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl z-10"
                aria-label="Close details view"
            >
                &times;
            </button>
            <div className="absolute bottom-0 left-0 p-4 md:p-8">
                 <h2 className="text-2xl md:text-4xl font-extrabold text-white shadow-lg tracking-tight">
                    {item.title}
                </h2>
            </div>
        </div>
        
        <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-56.25%)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                        <span>{item.year}</span>
                        <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs">{item.rating}</span>
                        <span>{item.genres.join(', ')}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                     <div className="mt-6">
                      <button 
                        onClick={() => toggleWatchlist(item.id)}
                        className="flex items-center justify-center px-5 py-2.5 bg-gray-700/60 text-white font-bold rounded-md hover:bg-gray-600/70 transition-colors w-full sm:w-auto"
                      >
                        {isInWatchlist ? <CheckIcon/> : <PlusIcon />}
                        {isInWatchlist ? 'Added to List' : 'Add to My List'}
                      </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Community Rating</h4>
                        <div className="flex items-center space-x-2">
                           <StarRating rating={item.communityRating} size="md" />
                           <span className="text-white font-bold text-lg">{item.communityRating.toFixed(1)}</span>
                           <span className="text-gray-400 text-sm">({item.ratingCount.toLocaleString()} ratings)</span>
                        </div>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">
                          {item.userRating ? 'Your Rating' : 'Rate this movie'}
                        </h4>
                        <StarRating 
                          rating={item.userRating || 0} 
                          onRate={(newRating) => onRate(item.id, newRating)} 
                          size="lg"
                        />
                    </div>
                </div>
            </div>
        </div>

      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MovieDetailsModal;