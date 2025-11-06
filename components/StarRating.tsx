import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Star: React.FC<{
  filled: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
  className?: string;
}> = ({ filled, onMouseEnter, onClick, className }) => (
  <svg
    className={`w-full h-full transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-500'} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);


const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, onRate, size = 'sm' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const isInteractive = !!onRate;

  return (
    <div
      className={`flex items-center space-x-1 ${isInteractive ? 'cursor-pointer' : ''}`}
      onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const displayRating = isInteractive ? hoverRating || rating : rating;
        const filled = starValue <= displayRating;

        return (
          <div key={i} className={sizeClasses[size]}>
            <Star
              filled={filled}
              onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
              onClick={isInteractive ? () => onRate(starValue) : undefined}
              className={isInteractive ? 'hover:text-yellow-300' : ''}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
