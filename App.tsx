import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentCarousel from './components/ContentCarousel';
import Footer from './components/Footer';
import VideoPlayerModal from './components/VideoPlayerModal';
import NatureVideoModal from './components/NatureVideoModal';
import MovieDetailsModal from './components/MovieDetailsModal';
import { FEATURED_CONTENT, CONTENT_CATEGORIES, ALL_CONTENT_ITEMS } from './constants';
import { ContentItem } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [playingNatureVideoId, setPlayingNatureVideoId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  
  const [contentData, setContentData] = useState(() => {
    // Use a map for efficient lookups and updates
    return new Map(ALL_CONTENT_ITEMS.map(item => [item.id, item]));
  });

  // Load watchlist from localStorage on initial render
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('netprime_watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('netprime_watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error("Failed to save watchlist to localStorage", error);
    }
  }, [watchlist]);

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
    setContentData(prevData => {
      const currentItem = prevData.get(itemId);
      if (!currentItem) return prevData;

      const newData = new Map(prevData);
      
      let newTotalRating = currentItem.communityRating * currentItem.ratingCount;
      let newRatingCount = currentItem.ratingCount;

      if (currentItem.userRating) {
        // User is changing their rating
        newTotalRating = newTotalRating - currentItem.userRating + newRating;
      } else {
        // User is rating for the first time
        newTotalRating += newRating;
        newRatingCount += 1;
      }
      
      const newCommunityRating = newTotalRating / newRatingCount;

      const updatedItem: ContentItem = {
        ...currentItem,
        userRating: newRating,
        communityRating: parseFloat(newCommunityRating.toFixed(2)),
        ratingCount: newRatingCount,
      };
      
      newData.set(itemId, updatedItem);
      // Also update the selected item if it's the one being rated
      if (selectedItem?.id === itemId) {
        setSelectedItem(updatedItem);
      }

      return newData;
    });
  }, [selectedItem]);


  const handlePlay = (videoId?: string) => {
    if (videoId) {
      if (videoId.startsWith('nature:')) {
        setPlayingNatureVideoId(videoId.replace('nature:', ''));
      } else {
        setPlayingVideoId(videoId);
      }
    }
  };

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
    setPlayingNatureVideoId(null);
  };
  
  return (
    <div className="bg-brand-dark min-h-screen text-gray-100 font-sans">
      <Header onSearchChange={setSearchQuery} />
      <main>
        {!searchQuery && <Hero 
          item={contentData.get(FEATURED_CONTENT.id) || FEATURED_CONTENT} 
          onPlay={handlePlay}
          onShowDetails={() => handleShowDetails(contentData.get(FEATURED_CONTENT.id) || FEATURED_CONTENT)}
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
              {CONTENT_CATEGORIES.map((category) => (
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
      <Footer />
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
    </div>
  );
};

export default App;