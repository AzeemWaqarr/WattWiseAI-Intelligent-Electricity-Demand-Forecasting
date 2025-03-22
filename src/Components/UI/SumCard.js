import React from 'react';

// Component for summary cards with hover effect
export const SummaryCard = ({ title, value, change, isPositive, color, darkMode }) => {
  const colorClasses = {
    blue: darkMode ? 'bg-blue-600' : 'bg-blue-500',
    green: darkMode ? 'bg-green-600' : 'bg-green-500',
    yellow: darkMode ? 'bg-yellow-600' : 'bg-yellow-500',
    purple: darkMode ? 'bg-purple-600' : 'bg-purple-500'
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} bg-opacity-90 rounded-lg shadow p-6 relative overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:scale-105`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${colorClasses[color]}`}></div>
      <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      <div className="flex items-center mt-2">
        {isPositive !== null && (
          <span className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '↓' : '↑'}
          </span>
        )}
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{change}</span>
      </div>
    </div>
  );
};