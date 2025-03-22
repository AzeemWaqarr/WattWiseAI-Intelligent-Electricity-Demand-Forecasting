import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Cell, Bar } from 'recharts';
import { SummaryCard } from './UI/SumCard';
import { Brush } from 'recharts';
import { 
  Zap, 
  Home, 
  Calendar, 
  Clock, 
  Battery, 
  AlertTriangle, 
  BarChart2, 
  Settings, 
  LogOut, 
  User, 
  Users, 
  FileText, 
  Database,
  Moon,
  Sun,
  Search,
  Bell,
  Brain,
  BrainCircuit
} from 'lucide-react';

// Sample data for consumption charts
const sampleData = [
  { name: '00:00', consumption: 3.4, prediction: 3.2 },
  { name: '02:00', consumption: 2.8, prediction: 3.0 },
  { name: '04:00', consumption: 2.4, prediction: 2.5 },
  { name: '06:00', consumption: 3.8, prediction: 3.5 },
  { name: '08:00', consumption: 5.2, prediction: 5.0 },
  { name: '10:00', consumption: 4.8, prediction: 5.0 },
  { name: '12:00', consumption: 4.5, prediction: 4.3 },
  { name: '14:00', consumption: 4.9, prediction: 4.7 },
  { name: '16:00', consumption: 5.5, prediction: 5.3 },
  { name: '18:00', consumption: 6.2, prediction: 6.0 },
  { name: '20:00', consumption: 5.8, prediction: 5.7 },
  { name: '22:00', consumption: 4.2, prediction: 4.5 },
];
// Sample data for seasonal demand
const seasonalDemandData = [
  { season: 'Spring', demand: 275 },
  { season: 'Summer', demand: 345 },
  { season: 'Fall', demand: 290 },
  { season: 'Winter', demand: 310 }
];


// Sample data for holiday vs non-holiday demand
const holidayDemandData = [
  { type: 'Non-Holiday', demand: 310 },
  { type: 'Holiday', demand: 265 }
];
// Sample data for tolerance test
const toleranceTestData = [
  { tolerance: 0, accuracy: 8.2 },
  { tolerance: 2, accuracy: 15.4 },
  { tolerance: 4, accuracy: 24.7 },
  { tolerance: 6, accuracy: 35.1 },
  { tolerance: 8, accuracy: 43.8 },
  { tolerance: 10, accuracy: 50.2 },
  { tolerance: 12, accuracy: 58.6 },
  { tolerance: 14, accuracy: 64.9 },
  { tolerance: 16, accuracy: 70.3 },
  { tolerance: 18, accuracy: 75.8 },
  { tolerance: 20, accuracy: 80.5 },
  { tolerance: 22, accuracy: 84.2 },
  { tolerance: 24, accuracy: 87.1 },
  { tolerance: 26, accuracy: 89.5 },
  { tolerance: 28, accuracy: 91.2 },
  { tolerance: 30, accuracy: 92.8 },
  { tolerance: 32, accuracy: 94.3 },
  { tolerance: 34, accuracy: 95.7 },
  { tolerance: 36, accuracy: 96.8 },
  { tolerance: 38, accuracy: 97.9 },
  { tolerance: 40, accuracy: 98.7 }
];

// Sample data for weekday demand
const weekdayDemandData = [
  { day: 'Monday', demand: 305 },
  { day: 'Tuesday', demand: 310 },
  { day: 'Wednesday', demand: 315 },
  { day: 'Thursday', demand: 308 },
  { day: 'Friday', demand: 312 },
  { day: 'Saturday', demand: 270 },
  { day: 'Sunday', demand: 265 }
];

const ConsumptionScreen = ({ darkMode }) => {
const [loading, setLoading] = useState(true);
const [toleranceData, setToleranceData] = useState([]);
const [chartData, setChartData] = useState([]);
const [seasonalDemandData, setSeasonalDemandData] = useState([]);
const [seasonalLoading, setSeasonalLoading] = useState(true);
const [holidayDemandData, setHolidayDemandData] = useState([]);
const [weekdayDemandData, setWeekdayDemandData] = useState([]);
const [summaryStats, setSummaryStats] = useState({
  totalConsumption: 0,
  averageDaily: 0,
  estimatedCost: 0,
});


  useEffect(() => {
      fetchActualVsPredicted(); // Only once on mount
      fetchToleranceTestData();
      fetchSeasonalTrends();
      fetchHolidayDemand();
      fetchWeekdayDemand();
      fetchConsumptionSummary();
    }, []);

  const fetchWeekdayDemand = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/weekday-demand/EL PASO');
      const data = await res.json();
      setWeekdayDemandData(data);
    } catch (err) {
      console.error("Fetch Weekday Demand Error:", err);
    }
  };

  const fetchConsumptionSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/consumption-summary/EL PASO');
      const data = await res.json();
      setSummaryStats(data);
    } catch (err) {
      console.error('Consumption Summary Fetch Error:', err);
    }
  };
  const fetchHolidayDemand = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/holiday-demand/EL PASO');
      const data = await res.json();
      setHolidayDemandData(data);
    } catch (err) {
      console.error("Holiday Demand Fetch Error:", err);
    }
  };
  
  const fetchSeasonalTrends = async () => {
    try {
      setSeasonalLoading(true);
      const res = await fetch('http://localhost:5000/api/seasonal-trends/EL_PASO');
      const data = await res.json();
      setSeasonalDemandData(data);
    } catch (err) {
      console.error('Seasonal Trends Fetch Error:', err);
    } finally {
      setSeasonalLoading(false);
    }
  };
  const fetchToleranceTestData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tolerance-test/EL PASO');
      const data = await res.json();
      setToleranceData(data);
    } catch (err) {
      console.error("Tolerance Chart Error:", err);
    }
  };

  const fetchActualVsPredicted = async () => {
    try {
      setLoading(true); // Show loader
      const res = await fetch('http://localhost:5000/api/actual-vs-predicted/EL PASO'); // Adjust to use variable if needed
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error("Chart Fetch Error:", err);
    }
    finally {
      setLoading(false); // Hide loader
    }
  };
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      {/* Time Period Selector */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Consumption Analysis
        </h2>
        {/* <div className="flex space-x-2">
          <button className={`px-3 py-1 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
            Today
          </button>
          <button className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
            This Week
          </button>
          <button className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
            This Month
          </button>
          <button className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
            Custom
          </button>
        </div> */}
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <SummaryCard 
      title="Total Consumption" 
      value={`${summaryStats.totalConsumption} kWh`} 
      change="-5% vs prev period" 
      isPositive={true} 
      color="blue"
      darkMode={darkMode}
    />
    <SummaryCard 
      title="Average Daily" 
      value={`${summaryStats.averageDaily} kWh`} 
      change="-10%" 
      isPositive={true}
      color="green"
      darkMode={darkMode}
    />
    <SummaryCard 
      title="Estimated Cost" 
      value={`$${summaryStats.estimatedCost}`} 
      change="-$21567.75" 
      isPositive={true}
      color="purple"
      darkMode={darkMode}
    />
      </div>
      
      {/* Detailed Consumption Chart */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
          Predicted Vs Actual Consumption
        </h3>
        {loading ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                <XAxis 
                  dataKey="time" 
                  stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} 
                  label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: darkMode ? '#d1d5db' : '#4b5563' }} 
                />
                <YAxis 
                  stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} 
                  label={{ value: 'Demand (kWh)', angle: -90, position: 'insideLeft', fill: darkMode ? '#d1d5db' : '#4b5563' }} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                  formatter={(value, name) => [`${value} kWh`, name === "actual" ? "Actual Consumption" : "Predicted Consumption"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend wrapperStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }} />
                <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Actual Consumption" />
                <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted Consumption" />
                {/* ✅ Slider/Scroll Brush Component */}
                <Brush 
                  
                  dataKey="time"
                  height={30}
                  stroke="#3B82F6"
                  travellerWidth={10}
                  startIndex={Math.max(0, chartData.length - 250)} // show latest 25 points initially
                  endIndex={Math.max(0, chartData.length - 100)} // show latest 25 points initially
                />
              </LineChart>
            </ResponsiveContainer>
          )}
     </div>
      
      {/* Seasonal and Holiday Comparison (Side by Side) */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Seasonal & Holiday Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Average Energy Demand by Season
                  </h4>
                  {seasonalLoading ? (
                    <div className="flex justify-center items-center h-[250px]">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart 
                        data={seasonalDemandData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                        <XAxis dataKey="season" stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} tickLine={false} />
                        <YAxis
                          stroke={darkMode ? "#9CA3AF" : "#9CA3AF"}
                          label={{
                            value: 'Average Demand (MW)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 5,
                            style: { fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: '12px' }
                          }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                            color: darkMode ? '#F3F4F6' : '#1F2937'
                          }}
                          formatter={(value) => [`${value} MW`, 'Average Demand']}
                        />
                        <Bar
                          dataKey="demand"
                          name="Average Demand"
                          radius={[4, 4, 0, 0]}
                        >
                          {seasonalDemandData.map((entry, index) => {
                            const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                </div>
                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    Holiday vs Non-Holiday Demand
                  </h4>
                  {seasonalLoading ? (
                    <div className="flex justify-center items-center h-[250px]">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart 
                        data={holidayDemandData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                        <XAxis dataKey="type" stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} tickLine={false} />
                        <YAxis
                          stroke={darkMode ? "#9CA3AF" : "#9CA3AF"}
                          label={{
                            value: 'Average Demand (MW)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 5,
                            style: { fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: '12px' }
                          }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                            color: darkMode ? '#F3F4F6' : '#1F2937'
                          }}
                          formatter={(value) => [`${value} MW`, 'Average Demand']}
                        />
                        <Bar
                          dataKey="demand"
                          name="Average Demand"
                          radius={[4, 4, 0, 0]}
                        >
                          {seasonalDemandData.map((entry, index) => {
                            const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  <p className={`mt-2 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Energy demand is approximately 15% lower on holidays
                  </p>
                </div>
              </div>
            </div>
      
            {/* Tolerance Test Graph */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Tolerance Test: Accuracy vs Tolerance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={toleranceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                <XAxis 
                  dataKey="tolerance" 
                  stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} 
                  label={{ value: 'Tolerance (%)', position: 'insideBottom', offset: -5, fill: darkMode ? '#d1d5db' : '#4b5563' }} 
                />
                <YAxis 
                  stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} 
                  label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft', fill: darkMode ? '#d1d5db' : '#4b5563' }} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                    color: darkMode ? '#F3F4F6' : '#1F2937'
                  }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                  labelFormatter={(value) => `Tolerance: ${value}%`}
                />
                <Legend wrapperStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }} />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  name="Accuracy"
                  animationDuration={1500}
                />
              </LineChart>
              </ResponsiveContainer>
            </div>
      
            {/* Weekday Demand Analysis */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Average Energy Demand by Day of Week
              </h3>
              {seasonalLoading ? (
                    <div className="flex justify-center items-center h-[250px]">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart 
                        data={weekdayDemandData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                        <XAxis dataKey="day" stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} tickLine={false} />
                        <YAxis
                          stroke={darkMode ? "#9CA3AF" : "#9CA3AF"}
                          label={{
                            value: 'Average Demand (MW)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 5,
                            style: { fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: '12px' }
                          }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                            borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                            color: darkMode ? '#F3F4F6' : '#1F2937'
                          }}
                          formatter={(value) => [`${value} MW`, 'Average Demand']}
                        />
                        <Bar
                          dataKey="demand"
                          name="Average Demand"
                          radius={[4, 4, 0, 0]}
                        >
                          {seasonalDemandData.map((entry, index) => {
                            const colors = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
            </div>
    </div>
  );
};

// Component for Time of Day cards
const TimeOfDayCard = ({ time, percentage, consumption, darkMode, color }) => {
  const colorClasses = {
    blue: darkMode ? 'bg-blue-900' : 'bg-blue-100',
    green: darkMode ? 'bg-green-900' : 'bg-green-100',
    yellow: darkMode ? 'bg-yellow-900' : 'bg-yellow-100',
    orange: darkMode ? 'bg-orange-900' : 'bg-orange-100',
    purple: darkMode ? 'bg-purple-900' : 'bg-purple-100'
  };
  
  const textColorClasses = {
    blue: darkMode ? 'text-blue-300' : 'text-blue-800',
    green: darkMode ? 'text-green-300' : 'text-green-800',
    yellow: darkMode ? 'text-yellow-300' : 'text-yellow-800',
    orange: darkMode ? 'text-orange-300' : 'text-orange-800',
    purple: darkMode ? 'text-purple-300' : 'text-purple-800'
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
      <h4 className={`text-base font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
        {time}
      </h4>
      <div className="flex items-end justify-between mb-2">
        <span className={`text-2xl font-bold ${textColorClasses[color]}`}>
          {percentage}%
        </span>
        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {consumption} kWh
        </span>
      </div>
      <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
        <div className={`h-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ConsumptionScreen;