import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../profiles';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  onProfileChange: (profile: UserProfile) => void;
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

const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  isAuthenticated, 
  onLoginClick, 
  onLogoutClick,
  profiles,
  currentProfile,
  onProfileChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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

  const handleProfileSelect = (profile: UserProfile) => {
    onProfileChange(profile);
    setIsProfileDropdownOpen(false);
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
            {isAuthenticated && currentProfile ? (
              <>
                <button className="text-gray-300 hover:text-white transition-colors" aria-label="Notifications">
                  <BellIcon />
                </button>
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden cursor-pointer block"
                    onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                    aria-label="Open profile menu"
                  >
                      <img src={currentProfile.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-brand-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20">
                      {profiles.map(profile => (
                        <a
                          key={profile.id}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleProfileSelect(profile);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                        >
                          <img src={profile.avatarUrl} alt={profile.name} className="w-8 h-8 rounded-md mr-3" />
                          <span>{profile.name}</span>
                        </a>
                      ))}
                      <div className="border-t border-gray-700 my-1"></div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onLogoutClick();
                        }}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-center"
                      >
                        Sign Out
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-brand-purple text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;