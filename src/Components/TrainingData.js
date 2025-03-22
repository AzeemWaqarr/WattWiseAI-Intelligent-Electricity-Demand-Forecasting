import { AlertTriangle, BrainCircuit } from 'lucide-react';
import React, { useState } from 'react';
import { useEffect } from 'react';

const TrainModelScreen = ({ darkMode }) => {

  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);


  const fetchCities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cities');
      const cities = await res.json();
      setCityList(cities);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  useEffect(() => {  
      fetchCities();
    }, []);

    const handleStartTraining = async () => {
      setLoading(true);
      if (!selectedCity || !selectedModel) {
        alert('Please select both City and Model Type.');
        return;
      }
    
      try {
        // 1️⃣ First download the city's training file from backend
        const downloadRes = await fetch(`http://localhost:5000/api/download-training-file/${selectedCity}`);
        if (!downloadRes.ok) throw new Error('Failed to download training file');
        const blob = await downloadRes.blob();
    
        // Optional: Save locally if needed
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const base64Data = fileReader.result.split(',')[1];
    
          // 2️⃣ After download, call train-model API
          const trainRes = await fetch('http://localhost:5000/api/train-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ modelType: selectedModel, cityName: selectedCity }),
          });
          if(trainRes){
            setLoading(false);
          }
          const trainResult = await trainRes.json();
          alert(trainResult.message || 'Model Training Started');
        };
        fileReader.readAsDataURL(blob);
      } catch (error) {
        console.error('Training Error:', error);
        alert('❌ Training failed.');
      }
    };
    
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Train Prediction Model
        </h2>
        <div className={`px-4 py-2 ${darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'} rounded-lg flex items-center`}>
          <BrainCircuit className="w-5 h-5 mr-2" />
          <span>Machine Learning Control</span>
        </div>
      </div>
      
      {/* Model Status */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
              Current Model Status
            </h3>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-2 ${darkMode ? 'bg-green-500' : 'bg-green-500'}`}></div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Active and predicting
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className={`inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} text-sm mr-2`}>
              Version: 1.0.0
            </div>
            <div className={`inline-block px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
              Last trained: 1 minute ago
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelMetricCard
            title="Prediction Accuracy"
            value="92.01%"
            change="+1.2%"
            isPositive={true}
            darkMode={darkMode}
          />
          <ModelMetricCard
            title="Mean Absolute Error"
            value="0.35 kWh"
            change="-0.08 kWh"
            isPositive={true}
            darkMode={darkMode}
          />
          <ModelMetricCard
            title="MAPE"
            value="6.30%"
            change=".1%"
            isPositive={true}
            darkMode={darkMode}
          />
        </div>
      </div>
      
      {/* Training Controls */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
          Training Controls
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Configuration */}
          <div>
            {/* City Selection Dropdown */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                City Selection
              </label>
              <select
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select city...</option>
                {cityList.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            {/* Model Selection Dropdown */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Training Model Selection
              </label>
              <select 
                className={`w-full p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'} rounded-md border ${darkMode ? 'border-gray-600' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">Select model...</option>
                <option value="LightGBM">LightGBM</option>
                <option value="ANN">ANN</option>
              </select>
            </div>
            
            <div className="mb-4">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Model Parameters
            </label>
            <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              {selectedModel === 'LightGBM' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Learning Rate</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>0.001</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Boosting Type</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>gbdt</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Max Depth</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>8</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Num Leaves</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>31</div>
                  </div>
                </div>
              )}

              {selectedModel === 'ANN' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Learning Rate</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>0.01</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Epochs</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>200</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Batch Size</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>16</div>
                  </div>
                  <div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Validation Split</div>
                    <div className={darkMode ? 'text-white' : 'text-black'}>0.2</div>
                  </div>
                </div>
              )}

              {!selectedModel && (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                  Select a model to view its parameters.
                </p>
              )}

              <div className="mt-2">
                <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                  Advanced Settings
                </button>
              </div>
            </div>
          </div>
          </div>
          
          {/* Right column - Start Training */}
          <div className={`flex flex-col justify-between p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div>
              <h4 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Start New Training Job
              </h4>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Starting a new training job will use your current data and selected parameters to generate an improved prediction model.
              </p>
              
              <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
                <h5 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Expected Improvements
                </h5>
                <ul className={`list-disc list-inside ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  <li>Better accuracy for weekend predictions</li>
                  <li>Improved response to temperature changes</li>
                  <li>More precise peak usage forecasting</li>
                </ul>
              </div>
              
              <div className={`p-3 rounded-md ${darkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'} border ${darkMode ? 'border-yellow-800' : 'border-yellow-200'} mb-6`}>
                <div className="flex">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} flex-shrink-0`} />
                  <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Training a new model may take up to 15 minutes. Current predictions will continue to work during training.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
            <button
              disabled={loading}
              className={`px-8 py-3 text-lg font-medium text-white rounded-xl flex items-center justify-center ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
              onClick={handleStartTraining}
            >
              {loading ? (
                <span className="animate-spin mr-2">⏳</span>
              ) : (
                <BrainCircuit className="w-6 h-6 mr-2" />
              )}
              {loading ? 'Training...' : 'Start Training'}
            </button>
              
              <button className={`w-full py-2 px-4 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} font-medium transition-colors duration-200`}>
                Schedule for Later
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Training History */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
          Training History
        </h3>
        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Version</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data Points</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                <th className={`px-4 py-3 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <HistoryRow 
                version="2.4.1" 
                date="Mar 15, 2025" 
                accuracy="94.2%" 
                dataPoints="1,254" 
                status="Active" 
                darkMode={darkMode} 
              />
              <HistoryRow 
                version="2.3.8" 
                date="Mar 01, 2025" 
                accuracy="93.0%" 
                dataPoints="1,126" 
                status="Archived" 
                darkMode={darkMode} 
              />
              <HistoryRow 
                version="2.2.5" 
                date="Feb 15, 2025" 
                accuracy="92.5%" 
                dataPoints="1,052" 
                status="Archived" 
                darkMode={darkMode} 
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component for Model Metric Card
const ModelMetricCard = ({ title, value, change, isPositive, darkMode }) => (
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
      {title}
    </h4>
    <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
      {value}
    </p>
    <div className="flex items-center">
      <span className={`mr-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'}
      </span>
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
    </div>
  </div>
);

// Component for History Row
const HistoryRow = ({ version, date, accuracy, dataPoints, status, darkMode }) => (
  <tr className={`${darkMode ? 'hover:bg-gray-650' : 'hover:bg-gray-50'}`}>
    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{version}</td>
    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{date}</td>
    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{accuracy}</td>
    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{dataPoints}</td>
    <td className={`px-4 py-3 text-sm`}>
      <span className={`px-2 py-1 rounded-full text-xs ${
        status === 'Active' 
          ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
          : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
      }`}>
        {status}
      </span>
    </td>
    <td className={`px-4 py-3 text-sm`}>
      <div className="flex space-x-2">
        <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          {status === 'Active' ? 'View' : 'Restore'}
        </button>
        {status !== 'Active' && (
          <button className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
            Delete
          </button>
        )}
      </div>
    </td>
  </tr>
);

export default TrainModelScreen;