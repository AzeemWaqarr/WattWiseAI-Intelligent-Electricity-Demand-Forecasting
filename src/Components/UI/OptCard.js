import React from 'react';
import { Zap } from 'lucide-react';

// Component for optimization suggestion cards with hover effect
export const OptimizationCard = ({ title, description, saving, darkMode }) => (
  <div className={`border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-white'} bg-opacity-90 rounded-lg p-4 flex transform transition-all duration-300 hover:shadow hover:scale-105 ${darkMode ? 'hover:border-green-800' : 'hover:border-green-200'}`}>
    <div className={`${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'} rounded-full h-10 w-10 flex items-center justify-center shrink-0`}>
      <Zap className="h-5 w-5" />
    </div>
    <div className="ml-4">
      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{description}</p>
      <div className={`mt-2 ${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-50 text-green-600'} text-sm inline-block px-2 py-1 rounded`}>
        Save {saving}
      </div>
    </div>
  </div>
);