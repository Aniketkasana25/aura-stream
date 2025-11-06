import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentCarousel from './components/ContentCarousel';
import Footer from './components/Footer';
import VideoPlayerModal from './components/VideoPlayerModal';
import NatureVideoModal from './components/NatureVideoModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import LoadingSpinner from './components/LoadingSpinner';
import LoginModal from './components/LoginModal';
import { FEATURED_CONTENT, CONTENT_CATEGORIES, ALL_CONTENT_ITEMS } from './constants';
import { ContentItem } from './types';
import { UserProfile, USER_PROFILES } from './profiles';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [playingNatureVideoId, setPlayingNatureVideoId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [watchTimeInSeconds, setWatchTimeInSeconds] = useState(0);
  
  // Auth and Profile State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [profiles] = useState<UserProfile[]>(USER_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  
  const [contentData, setContentData] = useState(() => {
    return new Map(ALL_CONTENT_ITEMS.map(item => [item.id, item]));
  });
  
  const [featuredContentId, setFeaturedContentId] = useState(FEATURED_CONTENT.id);
  const [contentCategories, setContentCategories] = useState(CONTENT_CATEGORIES);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // A bit of a delay for a smoother perceived loading experience
    return () => clearTimeout(timer);
  }, []);

  // Load watchlist, ratings, and watch time from localStorage on initial render
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('aurastream_watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
      const storedRatings = localStorage.getItem('aurastream_user_ratings');
      if (storedRatings) {
        setUserRatings(JSON.parse(storedRatings));
      }
      const storedWatchTime = localStorage.getItem('aurastream_watchtime');
      if (storedWatchTime) {
        setWatchTimeInSeconds(parseInt(storedWatchTime, 10));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  // Set up watch time timer and persistence
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchTimeInSeconds(prev => prev + 1);
    }, 1000);

    const handleBeforeUnload = () => {
      localStorage.setItem('aurastream_watchtime', watchTimeInSeconds.toString());
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [watchTimeInSeconds]); // Re-bind event listener to get latest watchTime

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('aurastream_watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error("Failed to save watchlist to localStorage", error);
    }
  }, [watchlist]);

  // Save ratings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('aurastream_user_ratings', JSON.stringify(userRatings));
    } catch (error) {
      console.error("Failed to save user ratings to localStorage", error);
    }
  }, [userRatings]);

  // Merge loaded user ratings into the main content data
  useEffect(() => {
    if (Object.keys(userRatings).length > 0) {
      setContentData(prevData => {
        const newData = new Map(prevData);
        for (const [itemIdStr, rating] of Object.entries(userRatings)) {
          const itemId = parseInt(itemIdStr, 10);
          const currentItem = newData.get(itemId);
          if (currentItem) {
            newData.set(itemId, { ...currentItem, userRating: rating });
          }
        }
        return newData;
      });
    }
  }, [userRatings]);


  const allContent = useMemo(() => Array.from(contentData.values()), [contentData]);

  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return null;
    }
    return allContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allContent]);
  
  const handleShowDetails = useCallback((item: ContentItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleToggleWatchlist = useCallback((itemId: number) => {
    setWatchlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const watchlistItems = useMemo(() => {
    return watchlist
      .map(id => contentData.get(id))
      .filter((item): item is ContentItem => !!item);
  }, [watchlist, contentData]);

  const handleRateMovie = useCallback((itemId: number, newRating: number) => {
    // Persist the rating to its own state and localStorage
    setUserRatings(prev => ({ ...prev, [itemId]: newRating }));

    // Update the main content data for immediate UI reactivity
    setContentData(prevData => {
      const currentItem = prevData.get(itemId);
      if (!currentItem) return prevData;

      const newData = new Map(prevData);
      
      let newTotalRating = currentItem.communityRating * currentItem.ratingCount;
      let newRatingCount = currentItem.ratingCount;

      if (currentItem.userRating) {
        newTotalRating = newTotalRating - currentItem.userRating + newRating;
      } else {
        newTotalRating += newRating;
        newRatingCount += 1;
      }
      
      const newCommunityRating = newRatingCount > 0 ? newTotalRating / newRatingCount : 0;

      const updatedItem: ContentItem = {
        ...currentItem,
        userRating: newRating,
        communityRating: parseFloat(newCommunityRating.toFixed(2)),
        ratingCount: newRatingCount,
      };
      
      newData.set(itemId, updatedItem);
      
      if (selectedItem?.id === itemId) {
        setSelectedItem(updatedItem);
      }

      return newData;
    });
  }, [selectedItem]);


  const handlePlay = (videoId?: string) => {
    if (videoId) {
      setIsVideoLoading(true);
      setTimeout(() => {
        if (videoId.startsWith('nature:')) {
          setPlayingNatureVideoId(videoId.replace('nature:', ''));
        } else {
          setPlayingVideoId(videoId);
        }
        setIsVideoLoading(false);
      }, 1200);
    }
  };

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
    setPlayingNatureVideoId(null);
    setIsVideoLoading(false);
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentProfile(profiles[0]); // Set the default profile
    setIsLoginModalOpen(false);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentProfile(null);
  };
  
  const handleProfileChange = (profile: UserProfile) => {
    setCurrentProfile(profile);
  };

  const featuredItem = useMemo(() => contentData.get(featuredContentId) || FEATURED_CONTENT, [featuredContentId, contentData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-brand-dark min-h-screen text-gray-100 font-sans">
      {(isVideoLoading) && <LoadingSpinner />}
      <Header 
        onSearchChange={setSearchQuery} 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        profiles={profiles}
        currentProfile={currentProfile}
        onProfileChange={handleProfileChange}
      />
      <main>
        {!searchQuery && <Hero 
          item={featuredItem}
          onPlay={handlePlay}
          onShowDetails={() => handleShowDetails(featuredItem)}
          watchlist={watchlist}
          toggleWatchlist={handleToggleWatchlist}
        />}
        <div className="py-4 md:py-8 space-y-8 md:space-y-16">
          {searchResults ? (
             <ContentCarousel 
              title={`Results for "${searchQuery}"`}
              items={searchResults}
              onPlay={handlePlay}
              onShowDetails={handleShowDetails}
              watchlist={watchlist}
              toggleWatchlist={handleToggleWatchlist}
            />
          ) : (
            <>
              {watchlistItems.length > 0 && (
                 <ContentCarousel 
                  title="My List"
                  items={watchlistItems}
                  onPlay={handlePlay}
                  onShowDetails={handleShowDetails}
                  watchlist={watchlist}
                  toggleWatchlist={handleToggleWatchlist}
                />
              )}
              {contentCategories.map((category) => (
                <ContentCarousel 
                  key={category.id} 
                  title={category.title} 
                  items={category.items.map(item => contentData.get(item.id) || item)} 
                  onPlay={handlePlay}
                  onShowDetails={handleShowDetails}
                  watchlist={watchlist}
                  toggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </>
          )}
           {searchResults && searchResults.length === 0 && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>
      <Footer watchTimeInSeconds={watchTimeInSeconds} />
      {playingVideoId && (
        <VideoPlayerModal videoId={playingVideoId} onClose={handleClosePlayer} />
      )}
      {playingNatureVideoId && (
        <NatureVideoModal videoId={playingNatureVideoId} onClose={handleClosePlayer} />
      )}
       {selectedItem && (
        <MovieDetailsModal 
          item={selectedItem}
          onClose={handleCloseDetails}
          onRate={handleRateMovie}
          watchlist={watchlist}
          toggleWatchlist={handleToggleWatchlist}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

export default App;