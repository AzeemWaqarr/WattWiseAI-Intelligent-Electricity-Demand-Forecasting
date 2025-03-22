import React from 'react';

// Component for sidebar items with animation support
export const SidebarItem = ({ icon, title, active, onClick, expanded, darkMode }) => (
  <button 
    className={`w-full flex items-center py-3 px-4 ${
      active 
        ? darkMode ? 'bg-gray-700 text-white' : 'bg-blue-800 text-white' 
        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-blue-100 hover:bg-blue-800'
    } transition-all duration-200 transform hover:translate-x-1`}
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-8">
      {icon}
    </div>
    <span className={`transition-all duration-300 ease-in-out ${
      expanded 
        ? 'opacity-100 translate-x-0 ml-2' 
        : 'opacity-0 -translate-x-4 absolute'
    }`}>
      {title}
    </span>
  </button>
);