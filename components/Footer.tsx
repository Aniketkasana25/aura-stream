import React from 'react';

interface FooterProps {
  watchTimeInSeconds: number;
}

const Footer: React.FC<FooterProps> = ({ watchTimeInSeconds }) => {
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <footer className="py-12 mt-16 text-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div className="space-y-3">
            <a href="#" className="block hover:text-white">FAQ</a>
            <a href="#" className="block hover:text-white">Investor Relations</a>
            <a href="#" className="block hover:text-white">Privacy</a>
            <a href="#" className="block hover:text-white">Speed Test</a>
          </div>
          <div className="space-y-3">
            <a href="#" className="block hover:text-white">Help Center</a>
            <a href="#" className="block hover:text-white">Jobs</a>
            <a href="#" className="block hover:text-white">Cookie Preferences</a>
            <a href="#" className="block hover:text-white">Legal Notices</a>
          </div>
          <div className="space-y-3">
            <a href="#" className="block hover:text-white">Account</a>
            <a href="#" className="block hover:text-white">Ways to Watch</a>
            <a href="#" className="block hover:text-white">Corporate Information</a>
            <a href="#" className="block hover:text-white">Only on Aura Stream</a>
          </div>
          <div className="space-y-3">
            <a href="#" className="block hover:text-white">Media Center</a>
            <a href="#" className="block hover:text-white">Terms of Use</a>
            <a href="#" className="block hover:text-white">Contact Us</a>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm">Total Watch Time: <span className="font-semibold text-white">{formatTime(watchTimeInSeconds)}</span></p>
            <p className="mt-4 text-xs">&copy; 2024 Aura Stream, Inc.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;