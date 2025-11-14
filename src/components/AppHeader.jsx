import React from 'react';
import { SearchIcon, BellIcon, UserAvatar } from './Icons';

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-primary-blue rounded-md flex items-center justify-center text-white font-bold text-lg">
          B
        </div>
        <span className="font-semibold text-gray-950 hidden sm:inline">BMAD-EDI Suite</span>
      </div>
      <div className="flex-1 max-w-xs ml-4 sm:ml-8">
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ticket Queue (5)..."
            className="w-full h-10 pl-10 pr-4 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:bg-white"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-error-red text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
        </button>
        <UserAvatar />
      </div>
    </header>
  );
};

export default AppHeader;
