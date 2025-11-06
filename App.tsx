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

const DB_KEY = 'aurastream_database';

interface ProfileData {
  watchlist: number[];
  ratings: Record<number, number>;
}

interface AppDatabase {
  auth: {
    isAuthenticated: boolean;
    currentProfileId: number | null;
  };
  profiles: Record<number, ProfileData>;
}

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
  
  const [contentData, setContentData] = useState<Map<number, ContentItem>>(new Map());
  
  const [featuredContentId, setFeaturedContentId] = useState(FEATURED_CONTENT.id);
  const [contentCategories, setContentCategories] = useState(CONTENT_CATEGORIES);

  // Load state from local "database" on initial render
  useEffect(() => {
    try {
      const initialContentData = new Map(ALL_CONTENT_ITEMS.map(item => [item.id, item]));
      let loadedUserRatings: Record<number, number> = {};

      const storedDb = localStorage.getItem(DB_KEY);
      if (storedDb) {
        const db: AppDatabase = JSON.parse(storedDb);
        setIsAuthenticated(db.auth.isAuthenticated);
        
        if (db.auth.isAuthenticated && db.auth.currentProfileId) {
          const profile = profiles.find(p => p.id === db.auth.currentProfileId);
          if (profile) {
            setCurrentProfile(profile);
            const profileData = db.profiles[profile.id];
            setWatchlist(profileData?.watchlist || []);
            loadedUserRatings = profileData?.ratings || {};
            setUserRatings(loadedUserRatings);
          }
        }
      }

      // Merge loaded ratings into the initial content data map
      for (const [itemIdStr, rating] of Object.entries(loadedUserRatings)) {
        const itemId = parseInt(itemIdStr, 10);
        const currentItem = initialContentData.get(itemId);
        if (currentItem) {
          initialContentData.set(itemId, { ...currentItem, userRating: rating });
        }
      }
      setContentData(initialContentData);

      const storedWatchTime = localStorage.getItem('aurastream_watchtime');
      if (storedWatchTime) {
        setWatchTimeInSeconds(parseInt(storedWatchTime, 10));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      // Fallback to default content on error
      setContentData(new Map(ALL_CONTENT_ITEMS.map(item => [item.id, item])));
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save state to local "database" whenever it changes
  useEffect(() => {
    try {
      const storedDb = localStorage.getItem(DB_KEY);
      const db: AppDatabase = storedDb ? JSON.parse(storedDb) : { auth: { isAuthenticated: false, currentProfileId: null }, profiles: {} };
      
      db.auth = {
        isAuthenticated,
        currentProfileId: currentProfile?.id || null,
      };

      if (currentProfile) {
        db.profiles[currentProfile.id] = {
          watchlist,
          ratings: userRatings,
        };
      }
      
      localStorage.setItem(DB_KEY, JSON.stringify(db));

    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [isAuthenticated, currentProfile, watchlist, userRatings]);


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
    const defaultProfile = profiles[0];
    setIsAuthenticated(true);
    setCurrentProfile(defaultProfile);
    setIsLoginModalOpen(false);

    // Load data for the default profile
    try {
      const storedDb = localStorage.getItem(DB_KEY);
      if (storedDb) {
        const db: AppDatabase = JSON.parse(storedDb);
        const profileData = db.profiles[defaultProfile.id];
        setWatchlist(profileData?.watchlist || []);
        setUserRatings(profileData?.ratings || {});
      } else {
        setWatchlist([]);
        setUserRatings({});
      }
    } catch (error) {
      console.error("Failed to load profile data on login", error);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentProfile(null);
    setWatchlist([]);
    setUserRatings({});
  };
  
  const handleProfileChange = (profile: UserProfile) => {
    setCurrentProfile(profile);
    // Load data for the selected profile
    try {
      const storedDb = localStorage.getItem(DB_KEY);
      if (storedDb) {
        const db: AppDatabase = JSON.parse(storedDb);
        const profileData = db.profiles[profile.id];
        setWatchlist(profileData?.watchlist || []);
        setUserRatings(profileData?.ratings || {});
      } else {
        // This case should be rare if a profile is being changed
        setWatchlist([]);
        setUserRatings({});
      }
    } catch (error) {
      console.error("Failed to load profile data on change", error);
    }
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
              {isAuthenticated && watchlistItems.length > 0 && (
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