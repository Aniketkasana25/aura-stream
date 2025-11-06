import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentCarousel from './components/ContentCarousel';
import Footer from './components/Footer';
import MovieDetailsModal from './components/MovieDetailsModal';
import VideoPlayerModal from './components/VideoPlayerModal';
import LoginModal from './components/LoginModal';
import LoadingSpinner from './components/LoadingSpinner';
import MovieCard from './components/MovieCard';
import { ALL_CONTENT } from './constants';
import { ContentItem } from './types';
import { USER_PROFILES, UserProfile } from './profiles';

const App: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Auth & Profile
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  // User data
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [ratings, setRatings] = useState<{[key: number]: number}>({});
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setContent(ALL_CONTENT);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Watch time counter
  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> for the interval ID type to be environment-agnostic.
    let interval: ReturnType<typeof setInterval>;
    if (isAuthenticated) {
      interval = setInterval(() => {
        setWatchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentProfile(USER_PROFILES[0]);
    setIsLoginModalOpen(false);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentProfile(null);
  };

  const handleProfileChange = (profile: UserProfile) => {
    setCurrentProfile(profile);
  };

  const handleShowDetails = useCallback((item: ContentItem) => {
    setSelectedItem(item);
  }, []);
  
  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  const handlePlay = useCallback((videoId?: string) => {
    if (videoId) {
      setPlayingVideoId(videoId);
    }
  }, []);

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
  };

  const toggleWatchlist = useCallback((itemId: number) => {
    setWatchlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleRate = useCallback((itemId: number, rating: number) => {
    setRatings(prev => ({...prev, [itemId]: rating}));
    // Close modal after rating
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({...selectedItem, userRating: rating});
    }
  }, [selectedItem]);

  const filteredContent = content.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const heroItem = content[2]; // Use a specific item for the hero banner

  const carousels = [
    { title: 'Trending Now', items: filteredContent.slice(0, 8) },
    { title: 'New Releases', items: filteredContent.filter(c => c.year >= 2023) },
    { title: 'Sci-Fi Adventures', items: filteredContent.filter(c => c.genres.includes('Sci-Fi')) },
    { title: 'Thrilling Mysteries', items: filteredContent.filter(c => c.genres.includes('Thriller')) },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const enhancedSelectedItem = selectedItem ? { ...selectedItem, userRating: ratings[selectedItem.id] } : null;

  return (
    <div className="bg-brand-dark text-white min-h-screen">
      <Header
        onSearchChange={setSearchQuery}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        profiles={USER_PROFILES}
        currentProfile={currentProfile}
        onProfileChange={handleProfileChange}
      />
      
      <main>
        {heroItem && !searchQuery && (
          <Hero 
            item={heroItem} 
            onPlay={handlePlay}
            onShowDetails={handleShowDetails}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
          />
        )}

        <div className="py-8">
          {searchQuery ? (
            <div className="px-4 sm:px-6 lg:px-8 mt-20">
              <h2 className="text-2xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
              {filteredContent.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredContent.map(item => (
                    <MovieCard
                      key={item.id}
                      item={item}
                      onPlay={handlePlay}
                      onShowDetails={handleShowDetails}
                      watchlist={watchlist}
                      toggleWatchlist={toggleWatchlist}
                    />
                  ))}
                </div>
              ) : (
                <p>No results found.</p>
              )}
            </div>
          ) : (
            carousels.map(carousel => (
              <ContentCarousel
                key={carousel.title}
                title={carousel.title}
                items={carousel.items}
                onPlay={handlePlay}
                onShowDetails={handleShowDetails}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            ))
          )}
        </div>
      </main>

      <Footer watchTimeInSeconds={watchTime} />
      
      {enhancedSelectedItem && (
        <MovieDetailsModal 
          item={enhancedSelectedItem}
          onClose={handleCloseDetails}
          onRate={handleRate}
          watchlist={watchlist}
          toggleWatchlist={toggleWatchlist}
        />
      )}

      {playingVideoId && (
        <VideoPlayerModal videoId={playingVideoId} onClose={handleClosePlayer} />
      )}

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
      )}

    </div>
  );
};

export default App;