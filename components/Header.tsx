import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onSearchChange: (query: string) => void;
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    onSearchChange(searchValue);
  }, [searchValue, onSearchChange]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);
  
  const handleSearchClick = () => {
    setIsSearchOpen(prev => !prev);
    if (isSearchOpen) {
      setSearchValue('');
    }
  };


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-brand-dark' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-purple tracking-wider">
              AURA STREAM
            </h1>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">TV Shows</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Movies</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">New & Popular</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Titles, people, genres"
                className={`bg-transparent border border-gray-500 rounded-md px-3 py-1 text-sm text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-purple ${isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}
              />
              <button 
                onClick={handleSearchClick}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>
            <button className="text-gray-300 hover:text-white transition-colors" aria-label="Notifications">
              <BellIcon />
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden">
              <img src="https://picsum.photos/seed/avatar/80/80" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;