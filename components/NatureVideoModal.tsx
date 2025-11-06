import React, { useEffect } from 'react';

interface NatureVideoModalProps {
  videoId: string;
  onClose: () => void;
}

const NatureVideoModal: React.FC<NatureVideoModalProps> = ({ videoId, onClose }) => {
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
      className="fixed inset-0 bg-black flex justify-center items-center z-[100] animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 h-10 w-10 bg-black/50 rounded-full flex items-center justify-center text-white text-2xl z-20 hover:bg-black/80 transition-colors"
          aria-label="Close video player"
        >
          &times;
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&controls=0&loop=1&playlist=${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          title="Nature video player"
        ></iframe>
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

export default NatureVideoModal;
