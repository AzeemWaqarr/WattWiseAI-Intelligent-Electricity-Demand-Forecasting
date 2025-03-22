import React, { useState } from 'react';
import { useEffect } from 'react';
import { BarChart2, AlertTriangle, Brain, BrainCircuit, CloudRain, Thermometer, Wind, Calendar, MapPin, Zap, ChevronRight, ArrowRight, ArrowLeft, CheckCircle, BarChart, FileText, Table, List } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



// CSV Viewer Component to be added below the chart placeholder
const CSVViewer = ({ darkMode, filePath }) => {
  const [viewMode, setViewMode] = useState('table');
  const [csvData, setCsvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCsvFile = async () => {
      if (!filePath) {
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load CSV file: ${response.statusText}`);
        }
  
        const content = await response.text();
        const rows = content.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim() || '';
            return obj;
          }, {});
        });
  
        setCsvData({
          headers: headers.map(h => h.trim()),
          rows: data.filter(row => Object.values(row).some(val => val))
        });
      } catch (err) {
        console.error('Error loading CSV file:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    // ✅ Call the actual loader
    loadCsvFile();
  }, [filePath]);

  if (loading) {
    return (
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6 flex flex-col items-center justify-center min-h-52`}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-500 mb-2"></div>
        <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading consumption data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6 flex flex-col items-center justify-center min-h-52`}>
        <AlertTriangle className={`w-12 h-12 ${darkMode ? 'text-red-400' : 'text-red-500'} mb-3`} />
        <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Error loading data: {error}
        </div>
      </div>
    );
  }

  if (!csvData) {
    return (
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6 flex flex-col items-center justify-center min-h-52`}>
        <FileText className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3`} />
        <div className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No consumption data available
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Consumption Data
        </h4>
        
        {/* View mode toggle */}
        <div className={`flex rounded-md overflow-hidden border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              viewMode === 'table' 
                ? darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Table className="w-4 h-4 inline mr-1" /> Table
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
                : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <List className="w-4 h-4 inline mr-1" /> List
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-h-64`}>
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} sticky top-0`}>
              <tr>
                {csvData.headers.map((header, index) => (
                  <th key={index} className={`px-4 py-2 text-left text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
              {csvData.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  {csvData.headers.map((header, cellIndex) => (
                    <td key={cellIndex} className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {row[header] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3`}>
          {csvData.rows.map((row, index) => (
            <div key={index} className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-md shadow-sm`}>
              {csvData.headers.map((header, headerIndex) => (
                <div key={headerIndex} className="mb-1 flex">
                  <span className={`text-sm font-medium w-1/3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {header}:
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {row[header] || '-'}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Download Button */}
      <div className="mt-4 flex justify-end">
        <a
          href={filePath}
          download="SpecificResult.csv"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            darkMode
              ? 'bg-blue-700 text-white hover:bg-blue-800'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition duration-300 shadow-md`}
        >
          ⬇ Download CSV
        </a>
      </div>
    </div>
  );
};




const AnalysisScreen = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('prediction');
  const [city, setCity] = useState('EL PASO');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-03-01' });
  const [modelType, setModelType] = useState('hybrid');
  const [completedTabs, setCompletedTabs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [predictionResult, setPredictionResult] = useState({
    expectedUsage: 270.5,
    percentChange: -3.2,
    confidence: 92,
    peakDay: "March 25, 2025",
    peakHour: "18:00-19:00"
  });

  const fetchCities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cities');
      const cities = await res.json();
      console.log('Fetched Cities:', cities); // <-- Check this in browser console
      setCityList(cities);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };
  useEffect(() => {  
        fetchCities();
      }, []);
  
  // Navigate to next tab
  const handleNext = (currentTab) => {
    let nextTab;
     if (currentTab === 'prediction') {
      nextTab = 'model';
      if (!completedTabs.includes('prediction')) {
        setCompletedTabs([...completedTabs, 'prediction']);
      }
    }
    
    if (nextTab) {
      setActiveTab(nextTab);
    }
  };
  
  // Navigate to previous tab
  const handleBack = (currentTab) => {
    let prevTab;
    if (currentTab === 'model') {
      prevTab = 'prediction';
    }
    
    if (prevTab) {
      setActiveTab(prevTab);
    }
  };
  
  // Handle generate prediction
  const handleGeneratePrediction = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: city,
          startDate: dateRange.start,
          endDate: dateRange.end,
          modelType: modelType
        })
      });
  
      const result = await response.json();
      console.log('Prediction response:', result);
  
      // 🔽 Fetch summary data from MongoDB model_specs
      const summaryRes = await fetch(`http://localhost:5000/api/model-specs/${city}`);
      const summary = await summaryRes.json();
  
      if (summary && summary.expectedUsage) {
        setPredictionResult({
          expectedUsage: summary.expectedUsage,
          percentChange: summary.percentChange,
          confidence: summary.confidence,
          peakDay: summary.peakDay,
          peakHour: summary.peakHour
        });
      }
  
      setShowResults(true);
    // Fetch CSV result data for chart
      const chartRes = await fetch(`http://localhost:5000/api/prediction-result/${city}`);
      const chartJson = await chartRes.json(); // backend should return array of { DATE, Predicted Demand }
      console.log("Raw chartJson:", chartJson);
      if (Array.isArray(chartJson)) {
        const parsedData = chartJson
          .filter(row => row['Ensemble_Predicted_Demand'] && !isNaN(parseFloat(row['Ensemble_Predicted_Demand'])))
          .map(row => ({
            date: row.DATE.split('T')[0],
            demand: parseFloat(row['Ensemble_Predicted_Demand']),
          }));
        setChartData(parsedData);
      }
    } catch (err) {
      console.error('Prediction error:', err);
    }
    finally {
      setLoading(false);
    }
  };
  
  
  
  // Reset the prediction process
  const handleNewPrediction = () => {
    setShowResults(false);
    setActiveTab('prediction');
  };
  
  // Get tab status class - for visual indicators only, no click functionality
  const getTabStatusClass = (tab) => {
    if (activeTab === tab) {
      return darkMode ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'bg-blue-50 text-blue-600 border-b-2 border-blue-500';
    } else if (completedTabs.includes(tab)) {
      return darkMode ? 'text-green-400' : 'text-green-600';
    } else {
      return darkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };
  
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Consumption Predictions
        </h2>
        <div className={`px-4 py-2 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-lg flex items-center`}>
          <BrainCircuit className="w-5 h-5 mr-2" />
          <span>AI-Powered Insights</span>
        </div>
      </div>
      
      {/* Results View - Only shown after generating predictions */}
      {showResults ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow mb-6 overflow-hidden`}>
          <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-600'} py-6 px-8 text-white`}>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Prediction Results
              </h3>
              <div className="text-sm bg-white bg-opacity-20 rounded-full px-3 py-1">
                {city} • {modelType === 'fast' ? 'Fast Model' : 'Hybrid Model'}
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Main Prediction Result */}
              <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-xl p-6 flex flex-col items-center justify-center text-center`}>
                <div className={`text-sm uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-blue-800'} mb-2`}>
                  Expected Consumption
                </div>
                <div className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-blue-800'} flex items-baseline`}>
                  {predictionResult.expectedUsage}
                  <span className="text-2xl ml-1">kWh</span>
                </div>
                <div className={`mt-3 ${predictionResult.percentChange < 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {predictionResult.percentChange < 0 ? '↓' : '↑'} {Math.abs(predictionResult.percentChange)}% vs previous period
                </div>
              </div>
              
              {/* Confidence Level */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Confidence Level</div>
                <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{predictionResult.confidence}%</div>
                <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden mt-auto">
                  <div className={`h-full bg-green-500`} style={{ width: `${predictionResult.confidence}%` }}></div>
                </div>
              </div>
              
              {/* Peak Prediction */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col`}>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Peak Consumption</div>
                <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{predictionResult.peakDay}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>at {predictionResult.peakHour}</div>
              </div>
            </div>
            
            {/* Prediction Trend Chart */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
                <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Daily Predicted Consumption Trend
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
                    <XAxis dataKey="date" stroke={darkMode ? '#ccc' : '#333'} />
                    <YAxis stroke={darkMode ? '#ccc' : '#333'} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', borderRadius: '8px', borderColor: '#ccc' }}
                      formatter={(value, name) => [`${value.toFixed(2)} kWh`, 'Demand']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line type="monotone" dataKey="demand" stroke={darkMode ? '#60a5fa' : '#3b82f6'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            {/* CSV Viewer - Replaces Chart Placeholder */}
            <CSVViewer darkMode={darkMode} filePath="http://localhost:5000/api/specific-result-csv" />
            
            {/* Recommendations */}
            <div className={`${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} rounded-xl p-5 mb-6`}>
              <h4 className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-2 flex items-center`}>
                <BrainCircuit className="w-5 h-5 mr-2" />
                Energy-Saving Recommendations
              </h4>
              <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                <li>Consider shifting high-energy activities away from the predicted peak hours (6-8PM)</li>
                <li>Lower thermostat settings by 2°F during unoccupied hours to reduce HVAC consumption</li>
                <li>Enable sleep mode on electronics during nighttime hours</li>
              </ul>
            </div>
            
            {/* New Prediction Button */}
            <div className="flex justify-center mt-8">
              <button 
                className={`px-6 py-3 text-white rounded-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md`}
                onClick={handleNewPrediction}
              >
                Create New Prediction
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow mb-6`}>
          {/* Tab Navigation - Visual indicators only */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <div className={`px-3 py-2 flex items-center text-sm font-medium ${getTabStatusClass('prediction')}`}>
              <MapPin className="w-4 h-4 mr-1" />
              Location & Time
            </div>
            <div className={`px-3 py-2 flex items-center text-sm font-medium ${getTabStatusClass('model')}`}>
              <Brain className="w-4 h-4 mr-1" />
              Model Selection
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Prediction Parameters Tab */}
            {activeTab === 'prediction' && (
              <div className="animate-fadeIn">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                  Location & Time Period
                </h3>
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    City/Region
                  </label>
                  <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <select 
                      className={`block w-full pl-10 pr-10 py-3 appearance-none bg-transparent rounded-lg border ${
                        darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Select City...</option>
                      {cityList.map((cityName, index) => (
                        <option key={index} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <input 
                        type="date" 
                        className={`block w-full pl-10 py-3 bg-transparent rounded-lg border ${
                          darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      />
                    </div>
                    <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                      <input 
                        type="date" 
                        className={`block w-full pl-10 py-3 bg-transparent rounded-lg border ${
                          darkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button 
                    className={`px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 flex items-center transition-colors duration-300`}
                    onClick={() => handleNext('prediction')}
                  >
                    Proceed
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Model Selection Tab */}
            {activeTab === 'model' && (
              <div className="animate-fadeIn">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                  Prediction Model
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    className={`${darkMode ? 'bg-gray-700' : 'bg-white'} border rounded-xl p-5 cursor-pointer transition-all 
                    ${modelType === 'fast' 
                      ? `transform scale-105 shadow-lg ${darkMode ? 'border-blue-500 bg-blue-900 bg-opacity-25' : 'border-blue-500 bg-blue-50'}` 
                      : `${darkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-50'}`}`}
                    onClick={() => setModelType('fast')}
                  >
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-3 ${modelType === 'fast' 
                      ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}` 
                      : `${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'}`}`}
                    >
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Fast</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Quick predictions with reasonable accuracy. Best for immediate insights.
                    </p>
                    <div className={`mt-3 text-sm ${modelType === 'fast' 
                      ? `${darkMode ? 'text-blue-300' : 'text-blue-600'}` 
                      : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                      Processing time: ~2 minutes
                    </div>
                  </div>
                  
                  <div 
                    className={`${darkMode ? 'bg-gray-700' : 'bg-white'} border rounded-xl p-5 cursor-pointer transition-all 
                    ${modelType === 'hybrid' 
                      ? `transform scale-105 shadow-lg ${darkMode ? 'border-blue-500 bg-blue-900 bg-opacity-25' : 'border-blue-500 bg-blue-50'}` 
                      : `${darkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-50'}`}`}
                    onClick={() => setModelType('hybrid')}
                  >
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-3 ${modelType === 'hybrid' 
                      ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}` 
                      : `${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-500'}`}`}
                    >
                      <Brain className="w-6 h-6" />
                    </div>
                    <h4 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Hybrid</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Balanced speed and accuracy. The recommended option for most use cases.
                    </p>
                    <div className={`mt-3 text-sm ${modelType === 'hybrid' 
                      ? `${darkMode ? 'text-blue-300' : 'text-blue-600'}` 
                      : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`}`}
                    >
                      Processing time: ~5 minutes
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} flex items-center transition-colors duration-300`}
                    onClick={() => handleBack('model')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </button>
                  
                  {/* Generate Prediction Button */}
                  <button
                    disabled={loading}
                    className={`px-8 py-3 text-lg font-medium text-white rounded-xl flex items-center justify-center ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                    onClick={handleGeneratePrediction}
                  >
                    {loading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : (
                      <BrainCircuit className="w-6 h-6 mr-2" />
                    )}
                    {loading ? 'Processing...' : 'Generate Prediction'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisScreen;