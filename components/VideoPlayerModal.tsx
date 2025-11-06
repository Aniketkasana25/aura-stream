import React, { useEffect } from 'react';

interface VideoPlayerModalProps {
  videoId: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ videoId, onClose }) => {
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

  if (!videoId) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative w-full max-w-4xl aspect-video mx-4" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute -top-2 -right-2 md:-top-4 md:-right-4 h-8 w-8 md:h-10 md:w-10 bg-brand-dark rounded-full flex items-center justify-center text-white text-2xl z-10"
          aria-label="Close video player"
        >
          &times;
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-2xl"
          title="YouTube video player"
        ></iframe>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayerModal;
