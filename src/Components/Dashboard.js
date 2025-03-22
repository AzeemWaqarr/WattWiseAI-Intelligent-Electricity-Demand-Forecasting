import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
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

// Import screens
import ConsumptionScreen from './Consumption';
import AnalysisScreen from './Analysis';
import TrainModelScreen from './TrainingData';
import UserManagementScreen from './UserManagment';
import SettingsScreen from './Settings';
import ReportsScreen from './Reports';
import SystemDataScreen from './SystemData';


// Import reusable components
import { SidebarItem } from './UI/Sidebar';
import { SummaryCard } from './UI/SumCard';
import { OptimizationCard } from './UI/OptCard';

// Sample data - would be replaced with actual data from your prediction model
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

const usageByApplianceData = [
  { name: 'HVAC', usage: 45 },
  { name: 'Lighting', usage: 15 },
  { name: 'Kitchen', usage: 20 },
  { name: 'Electronics', usage: 12 },
  { name: 'Others', usage: 8 },
];

const Dashboard = ({ userType, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [dashboardTab, setDashboardTab] = useState('overview'); // Add a state for dashboard tabs
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seasonalDemandData, setSeasonalDemandData] = useState([]);
  const [seasonalLoading, setSeasonalLoading] = useState(true);
  const [consumptionSummary, setConsumptionSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [summaryStats, setSummaryStats] = useState({
    totalConsumption: 0,
    averageDaily: 0,
    estimatedCost: 0,
  });

  
  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Animation for theme change
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 1000);
  };
  
  useEffect(() => {
    fetchActualVsPredicted(); // Only once on mount
    fetchSeasonalTrends();
    fetchConsumptionSummary();
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    //fetchChartData();
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Determine if user is admin
  const isAdmin = userType === 'admin';
  
  // Notification animation
  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const fetchConsumptionSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await fetch('http://localhost:5000/api/consumption-summary_dashboard/EL PASO');
      const data = await res.json();
      setConsumptionSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };
  const fetchChartData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chartdata/NewYork`);
      const json = await res.json();
      setChartData(json);
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
    }
  };
  const fetchSeasonalTrends = async () => {
    try {
      setSeasonalLoading(true);
      const res = await fetch('http://localhost:5000/api/seasonal-trends_dashboard/EL_PASO');
      const data = await res.json();
      setSeasonalDemandData(data);
    } catch (err) {
      console.error('Seasonal Trends Fetch Error:', err);
    } finally {
      setSeasonalLoading(false);
    }
  };

  const fetchActualVsPredicted = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/actual-vs-predicted_dashboard/EL PASO');
      const data = await res.json();
      if (Array.isArray(data)) {
        setChartData(data);
      } else {
        console.error("Invalid chart response format");
        setChartData([]); // fallback
      }
    } catch (err) {
      console.error("Chart Fetch Error:", err);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`flex h-screen overflow-hidden relative transition-colors duration-300 ease-in-out ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      {/* Large Background Lightning Logo - fixed position behind content */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute right-0 flex items-center justify-center opacity-15">
          <Zap className={`w-4/5 h-4/5 ${darkMode ? 'text-blue-800' : 'text-blue-500'}`} />
        </div>
      </div>
      
      {/* Sidebar - changes width on hover with smooth transition */}
      <div 
        className={`h-full ${darkMode ? 'bg-gray-800' : 'bg-blue-900'} text-white transition-all duration-300 ease-in-out ${sidebarExpanded ? 'w-64' : 'w-16'} z-20 flex flex-col`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="p-4 flex items-center justify-center">
          <Zap className="h-8 w-8 text-yellow-300 flex-shrink-0" />
          <span className={`ml-2 text-xl font-bold transition-all duration-300 ease-in-out ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
            WattWiseAI
          </span>
        </div>
        
        {/* User Info display */}
        <div className={`flex items-center px-4 py-2 mb-4 ${darkMode ? 'border-gray-700' : 'border-blue-800'} border-b ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className="flex items-center justify-center w-8 h-8">
            <User className="h-5 w-5 text-blue-200 flex-shrink-0" />
          </div>
          <span className={`ml-2 text-sm text-blue-200 transition-all duration-300 ease-in-out ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
            {isAdmin ? 'Administrator' : 'End User'}
          </span>
        </div>
        
        <nav className="flex-grow">
          {/* Common navigation items for both user types */}
          <SidebarItem 
            icon={<Home className="h-5 w-5" />} 
            title="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => {
              setActiveView('dashboard');
              setDashboardTab('overview');
            }} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
          <SidebarItem 
            icon={<BarChart2 className="h-5 w-5" />} 
            title="Predictions" 
            active={activeView === 'dashboard' && dashboardTab === 'predictions'} 
            onClick={() => {
              setActiveView('dashboard');
              setDashboardTab('predictions');
            }} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
          <SidebarItem 
            icon={<Battery className="h-5 w-5" />} 
            title="Consumption" 
            active={activeView === 'consumption'} 
            onClick={() => setActiveView('consumption')} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
          
          <SidebarItem 
            icon={<FileText className="h-5 w-5" />} 
            title="Reports" 
            active={activeView === 'reports'} 
            onClick={() => setActiveView('reports')} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
          
          {/* Train Model - only visible for admin */}
          {isAdmin && (
            <SidebarItem 
              icon={<Brain className="h-5 w-5" />} 
              title="Train Model" 
              active={activeView === 'train'} 
              onClick={() => setActiveView('train')} 
              expanded={sidebarExpanded}
              darkMode={darkMode}
            />
          )}
          
          {/* Admin-only navigation items */}
          {isAdmin && (
            <>
              <SidebarItem 
                icon={<Users className="h-5 w-5" />} 
                title="Manage Users" 
                active={activeView === 'users'} 
                onClick={() => setActiveView('users')} 
                expanded={sidebarExpanded}
                darkMode={darkMode}
              />
              <SidebarItem 
                icon={<Database className="h-5 w-5" />} 
                title="System Data" 
                active={activeView === 'system'} 
                onClick={() => setActiveView('system')} 
                expanded={sidebarExpanded}
                darkMode={darkMode}
              />
            </>
          )}
          
          {/* Settings for all users */}
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            title="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
        </nav>

        {/* Logout button at the bottom of the nav menu */}
        <div className="mt-auto mb-4">
          <SidebarItem 
            icon={<LogOut className="h-5 w-5" />} 
            title="Logout" 
            active={false} 
            onClick={onLogout} 
            expanded={sidebarExpanded}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <header className={`${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'} shadow-sm sticky top-0 z-10 transition-colors duration-300`}>
          <div className="mx-6 py-4 flex items-center justify-between">
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {activeView === 'dashboard' && dashboardTab === 'overview' && 'Power Consumption Dashboard'}
              {activeView === 'dashboard' && dashboardTab === 'predictions' && 'Consumption Predictions'}
              {activeView === 'consumption' && 'Consumption Analysis'}
              {activeView === 'alerts' && 'System Alerts'}
              {activeView === 'train' && 'Model Training'}
              {activeView === 'users' && 'User Management'}
              {activeView === 'system' && 'System Data'}
              {activeView === 'reports' && 'Reports'}
              {activeView === 'settings' && 'Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-3 py-1 hidden md:flex items-center transition-colors duration-300`}>
                <Search className="w-4 h-4 mr-2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className={`bg-transparent border-none outline-none text-sm w-32 ${darkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
                />
              </div>
              
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={triggerNotification}
                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}
                >
                  <Bell className="w-5 h-5" />
                </button>
                {showNotification && (
                  <div className="absolute top-full right-0 mt-2 w-72 p-3 rounded-lg shadow-lg bg-white dark:bg-gray-800 animate-slideInDown">
                    <p className="text-sm">New power consumption alert available</p>
                  </div>
                )}
              </div>
              
              {/* Time Indicator */}
              <div className={`${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-full px-4 py-1 flex items-center transition-colors duration-300`}>
                <Clock className="w-4 h-4 mr-2" />
                <span>Real-time</span>
              </div>
              
              {/* Date Indicator */}
              <div className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-full px-4 py-1 flex items-center transition-colors duration-300`}>
                <Calendar className="w-4 h-4 mr-2" />
                <span>Today</span>
              </div>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-blue-100 text-blue-800'} transition-all duration-300 transform hover:scale-110`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 relative">
          {/* Dashboard Content */}
          {activeView === 'dashboard' && dashboardTab === 'overview' && (
            <div className="transform transition-all duration-500 animate-fadeIn">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <SummaryCard 
                title="Current Usage" 
                value={summaryLoading ? 'Loading...' : `${(parseFloat(consumptionSummary?.averageDaily) / 24).toFixed(2)} kW`} 
                change="+0.5 kW"
                isPositive={true}
                color="blue"
                darkMode={darkMode}
              />

              <SummaryCard 
                title="Today's Total" 
                value={summaryLoading ? 'Loading...' : `${consumptionSummary?.totalConsumption || '0.00'} kWh`} 
                change="-2.1 kWh"
                isPositive={true}
                color="green"
                darkMode={darkMode}
              />

              <SummaryCard 
                title="Estimated Cost" 
                value={summaryLoading ? 'Loading...' : `$${consumptionSummary?.estimatedCost || '0.00'}`} 
                change="+$1.20"
                isPositive={true}
                color="purple"
                darkMode={darkMode}
              />
                <SummaryCard 
                  title="Efficiency Score" 
                  value="92%" 
                  change="-2%" 
                  isPositive={true}
                  color="purple"
                  darkMode={darkMode}
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Consumption Chart */}
                <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
                  <div className="flex justify-between items-center mb-4">
                    
                    <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Power Consumption vs Prediction
                    </h2>
                    {/* <div className="flex space-x-2">
                      <button className={`px-3 py-1 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
                        Hourly
                      </button>
                      <button className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
                        Daily
                      </button>
                      <button className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-sm transition-all duration-200 transform hover:scale-105`}>
                        Weekly
                      </button>
                    </div> */}
                  </div>
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
                      angle={0}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                        color: darkMode ? '#F3F4F6' : '#1F2937'
                      }}
                    />
                    <Legend wrapperStyle={{ color: darkMode ? "#e5e7eb" : "#374151" }} />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      name="Actual Consumption"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                      dot={{ r: 3 }} 
                      name="Predicted Consumption"
                    />

                    {/* ✅ Slider/Scroll Brush Component */}
                    <Brush 
                      dataKey="time"
                      height={30}
                      stroke="#3B82F6"
                      travellerWidth={10}
                      startIndex={Math.max(0, chartData.length - 1000)} // show latest 25 points initially
                      endIndex={Math.max(0, chartData.length - 800)} // show latest 25 points initially
                    />
                  </LineChart>
                  </ResponsiveContainer>
          )}
                </div>

                {/* Seasonal Usage */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
                  <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                    Seasonal Usage
                  </h2>
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
              </div>

              {/* Optimization Section */}
              <div className={`mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
                <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                  Energy Optimization Suggestions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <OptimizationCard 
                    title="Shift HVAC usage" 
                    description="Moving heavy HVAC usage from 6-8PM to 2-4PM could save 1.2kWh daily."
                    saving="1.2 kWh/day"
                    darkMode={darkMode}
                  />
                  <OptimizationCard 
                    title="Optimize standby power" 
                    description="Reducing standby power could lower your base consumption by 8%."
                    saving="0.8 kWh/day"
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Predictions Screen (formerly Analysis) */}
          {activeView === 'dashboard' && dashboardTab === 'predictions' && <AnalysisScreen darkMode={darkMode} />}

          {/* Consumption Screen */}
          {activeView === 'consumption' && <ConsumptionScreen darkMode={darkMode} />}

          {/* Train Model Screen - Admin Only */}
          {isAdmin && activeView === 'train' && <TrainModelScreen darkMode={darkMode} />}

          {/* User Management Screen - Admin Only */}
          {isAdmin && activeView === 'users' && <UserManagementScreen darkMode={darkMode} />}

          {/* System Data Screen - Admin Only */}
          {isAdmin && activeView === 'system' && <SystemDataScreen darkMode={darkMode} />}

          {/* Reports Screen */}
          {activeView === 'reports' && <ReportsScreen darkMode={darkMode} />}

          {/* Settings Screen */}
          {activeView === 'settings' && <SettingsScreen darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;