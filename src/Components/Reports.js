import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Printer, Share2, Mail, Clock, BarChart2, PieChart, TrendingUp, ChevronDown, Eye } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', consumption: 285, cost: 45.6, baseline: 310 },
  { month: 'Feb', consumption: 268, cost: 42.9, baseline: 300 },
  { month: 'Mar', consumption: 290, cost: 46.4, baseline: 295 },
  { month: 'Apr', consumption: 310, cost: 49.6, baseline: 305 },
  { month: 'May', consumption: 302, cost: 48.3, baseline: 298 },
  { month: 'Jun', consumption: 320, cost: 51.2, baseline: 315 },
];

const ReportsScreen = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [dateRange, setDateRange] = useState('lastMonth');
  
  const handleReportTypeChange = (type) => {
    setSelectedReport(type);
  };
  
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Reports
        </h2>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200 flex items-center`}>
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </button>
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium transition-colors duration-200 flex items-center`}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Report Configuration Controls */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-4 mb-6 transform transition-all duration-300 hover:shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Report Type
              </label>
              <div className="flex space-x-1">
                <ReportTypeButton 
                  label="Monthly" 
                  active={selectedReport === 'monthly'} 
                  onClick={() => handleReportTypeChange('monthly')} 
                  darkMode={darkMode} 
                />
                <ReportTypeButton 
                  label="Quarterly" 
                  active={selectedReport === 'quarterly'} 
                  onClick={() => handleReportTypeChange('quarterly')} 
                  darkMode={darkMode} 
                />
                <ReportTypeButton 
                  label="Annual" 
                  active={selectedReport === 'annual'} 
                  onClick={() => handleReportTypeChange('annual')} 
                  darkMode={darkMode} 
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Date Range
              </label>
              <div className="relative">
                <select 
                  className={`appearance-none pl-3 pr-8 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'} border text-sm focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                >
                  <option value="lastMonth">Last Month</option>
                  <option value="last3Months">Last 3 Months</option>
                  <option value="last6Months">Last 6 Months</option>
                  <option value="lastYear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
            </div>
            
            <div>
              <label className={`block text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Compare With
              </label>
              <div className="relative">
                <select 
                  className={`appearance-none pl-3 pr-8 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-200'} border text-sm focus:outline-none focus:ring-1 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                >
                  <option>Baseline</option>
                  <option>Previous Period</option>
                  <option>Same Period Last Year</option>
                  <option>None</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
              <Filter className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
              <Calendar className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
              <Printer className="h-5 w-5" />
            </button>
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
        <nav className="flex space-x-4">
          <TabButton 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<BarChart2 className="h-4 w-4" />}
            darkMode={darkMode}
          />
          <TabButton 
            label="Consumption Analysis" 
            active={activeTab === 'consumption'} 
            onClick={() => setActiveTab('consumption')} 
            icon={<TrendingUp className="h-4 w-4" />}
            darkMode={darkMode}
          />
          <TabButton 
            label="Cost Analysis" 
            active={activeTab === 'cost'} 
            onClick={() => setActiveTab('cost')} 
            icon={<PieChart className="h-4 w-4" />}
            darkMode={darkMode}
          />
        </nav>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <ReportMetricCard 
              title="Total Consumption" 
              value="1,775 kWh" 
              change="-3.2%" 
              isPositive={true}
              icon={<BarChart2 className="h-5 w-5" />}
              darkMode={darkMode}
            />
            <ReportMetricCard 
              title="Average Daily" 
              value="8.8 kWh" 
              change="-0.5 kWh" 
              isPositive={true}
              icon={<TrendingUp className="h-5 w-5" />}
              darkMode={darkMode}
            />
            <ReportMetricCard 
              title="Total Cost" 
              value="$283.20" 
              change="-$9.50" 
              isPositive={true}
              icon={<PieChart className="h-5 w-5" />}
              darkMode={darkMode}
            />
            <ReportMetricCard 
              title="Carbon Footprint" 
              value="862 kg CO₂" 
              change="-32 kg" 
              isPositive={true}
              icon={<TrendingUp className="h-5 w-5" />}
              darkMode={darkMode}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Consumption Trend Chart */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Consumption Trend
                </h3>
                <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {selectedReport === 'monthly' ? 'Monthly' : selectedReport === 'quarterly' ? 'Quarterly' : 'Annual'}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                  <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} />
                  <YAxis stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? '#F3F4F6' : '#1F2937'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={{ r: 3 }} 
                    name="Consumption (kWh)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke={darkMode ? "#6B7280" : "#9CA3AF"} 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={{ r: 3 }} 
                    name="Baseline (kWh)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Cost Breakdown Chart */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Cost Breakdown
                </h3>
                <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  Last 6 Months
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#384152" : "#f0f0f0"} />
                  <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} />
                  <YAxis stroke={darkMode ? "#9CA3AF" : "#9CA3AF"} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? '#F3F4F6' : '#1F2937'
                    }} 
                    formatter={(value) => [`$${value}`, 'Cost']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="cost" 
                    fill={darkMode ? "#8B5CF6" : "#8B5CF6"} 
                    name="Cost ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Summary Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Findings */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Key Findings
              </h3>
              
              <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FindingItem 
                  title="Energy Savings" 
                  description="Overall consumption reduced by 3.2% compared to baseline, resulting in $9.50 cost savings."
                  type="positive"
                  darkMode={darkMode}
                />
                <FindingItem 
                  title="Peak Usage Times" 
                  description="Energy consumption peaks between 6-8PM on weekdays, accounting for 22% of total usage."
                  type="neutral"
                  darkMode={darkMode}
                />
                <FindingItem 
                  title="HVAC Efficiency" 
                  description="HVAC energy usage is 12% higher than similar buildings during warm days."
                  type="negative"
                  darkMode={darkMode}
                />
                <FindingItem 
                  title="Weekend Consumption" 
                  description="Weekend power usage decreased by 8.5% after implementing standby power optimization."
                  type="positive"
                  darkMode={darkMode}
                />
              </div>
            </div>
            
            {/* Recommendations */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Recommendations
              </h3>
              
              <div className="space-y-4">
                <RecommendationItem
                  title="Optimize HVAC Schedule"
                  description="Adjust HVAC settings to reduce usage during peak hours (6-8PM)."
                  impact="Estimated 5% energy reduction"
                  darkMode={darkMode}
                />
                <RecommendationItem
                  title="Install Smart Thermostats"
                  description="Replace analog thermostats with AI-powered smart units."
                  impact="Estimated 8-12% energy reduction"
                  darkMode={darkMode}
                />
                <RecommendationItem
                  title="Lighting Automation"
                  description="Implement motion sensors in low-traffic areas."
                  impact="Estimated 3% energy reduction"
                  darkMode={darkMode}
                />
                <RecommendationItem
                  title="Energy Audit"
                  description="Conduct comprehensive energy audit to identify additional savings opportunities."
                  impact="Potential 10-15% total reduction"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Consumption Analysis Tab */}
      {activeTab === 'consumption' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            Detailed Consumption Analysis
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            The consumption analysis tab would contain more detailed breakdowns of energy usage patterns, including time-of-day analysis, device-specific consumption, and comparative metrics.
          </p>
        </div>
      )}
      
      {/* Cost Analysis Tab */}
      {activeTab === 'cost' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            Cost Analysis
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            The cost analysis tab would provide detailed breakdowns of energy costs, including rate analysis, cost predictions, and ROI calculations for efficiency improvements.
          </p>
        </div>
      )}
      
      {/* Available Reports Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Saved Reports
          </h3>
          <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            View All Reports
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SavedReportCard
            title="February 2025 Monthly Report"
            description="Standard monthly energy consumption and cost analysis"
            date="Mar 1, 2025"
            type="Monthly"
            darkMode={darkMode}
          />
          <SavedReportCard
            title="Q1 2025 Executive Summary"
            description="Quarterly overview for management review"
            date="Apr 1, 2025"
            type="Quarterly"
            darkMode={darkMode}
          />
          <SavedReportCard
            title="Annual Energy Audit 2024"
            description="Comprehensive annual energy usage patterns and recommendations"
            date="Jan 15, 2025"
            type="Annual"
            darkMode={darkMode}
          />
        </div>
      </div>
      
      {/* Scheduled Reports */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Scheduled Reports
          </h3>
          <button className={`px-4 py-1 rounded-md text-sm ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
            Schedule New
          </button>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow overflow-hidden`}>
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Report Name</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Frequency</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Next Run</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Recipients</th>
                <th className={`px-4 py-3 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              <ScheduledReportRow
                name="Monthly Energy Report"
                frequency="Monthly"
                nextRun="Apr 1, 2025"
                recipients={3}
                darkMode={darkMode}
              />
              <ScheduledReportRow
                name="Executive Dashboard"
                frequency="Weekly"
                nextRun="Mar 25, 2025"
                recipients={2}
                darkMode={darkMode}
              />
              <ScheduledReportRow
                name="Energy Cost Analysis"
                frequency="Quarterly"
                nextRun="Jul 1, 2025"
                recipients={5}
                darkMode={darkMode}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Component for report type button
const ReportTypeButton = ({ label, active, onClick, darkMode }) => (
  <button
    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
      active
        ? darkMode 
          ? 'bg-blue-900 text-blue-300 border border-blue-800' 
          : 'bg-blue-100 text-blue-700 border border-blue-200'
        : darkMode
          ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-650' 
          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Component for tab buttons
const TabButton = ({ label, active, onClick, icon, darkMode }) => (
  <button
    className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center ${
      active
        ? darkMode 
          ? 'border-blue-500 text-blue-400' 
          : 'border-blue-600 text-blue-600'
        : darkMode
          ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700' 
          : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
    } transition-colors duration-200`}
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

// Component for metric cards
const ReportMetricCard = ({ title, value, change, isPositive, icon, darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-5 transform transition-all duration-300 hover:shadow-lg`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
      </div>
      <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        {icon}
      </div>
    </div>
    <div className="mt-2 flex items-center">
      <span className={`${isPositive ? 'text-green-500' : 'text-red-500'} mr-1`}>
        {isPositive ? '↓' : '↑'} {change}
      </span>
      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        vs. previous period
      </span>
    </div>
  </div>
);

// Component for finding items
const FindingItem = ({ title, description, type, darkMode }) => {
  const typeColors = {
    positive: darkMode ? 'bg-green-900 bg-opacity-20 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
    negative: darkMode ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700',
    neutral: darkMode ? 'bg-blue-900 bg-opacity-20 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
  };
  
  return (
    <div className={`p-3 rounded-md border ${typeColors[type]}`}>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className={`text-sm ${darkMode ? `text-${type === 'positive' ? 'green' : type === 'negative' ? 'red' : 'blue'}-300` : `text-${type === 'positive' ? 'green' : type === 'negative' ? 'red' : 'blue'}-600`}`}>
        {description}
      </p>
    </div>
  );
};

// Component for recommendation items
const RecommendationItem = ({ title, description, impact, darkMode }) => (
  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{title}</h4>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{description}</p>
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-100 text-green-700'}`}>
      {impact}
    </div>
  </div>
);

// Component for saved report cards
const SavedReportCard = ({ title, description, date, type, darkMode }) => {
  const typeColors = {
    'Monthly': darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    'Quarterly': darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700',
    'Annual': darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-lg`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[type]}`}>{type}</span>
        </div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{date}</span>
        </div>
      </div>
      <div className={`flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button className={`flex-1 px-4 py-2 text-sm font-medium ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200 flex items-center justify-center`}>
          <Eye className="h-4 w-4 mr-1.5" />
          View
        </button>
        <button className={`flex-1 px-4 py-2 text-sm font-medium ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200 flex items-center justify-center`}>
          <Download className="h-4 w-4 mr-1.5" />
          Download
        </button>
        <button className={`flex-1 px-4 py-2 text-sm font-medium ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200 flex items-center justify-center`}>
          <Mail className="h-4 w-4 mr-1.5" />
          Send
        </button>
      </div>
    </div>
  );
};

// Component for scheduled report rows
const ScheduledReportRow = ({ name, frequency, nextRun, recipients, darkMode }) => {
  const frequencyColors = {
    'Weekly': darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
    'Monthly': darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    'Quarterly': darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700',
  };
  
  return (
    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center">
          <FileText className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span>{name}</span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${frequencyColors[frequency]}`}>
          {frequency}
        </span>
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          {nextRun}
        </div>
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="flex items-center">
          <Mail className={`h-4 w-4 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          {recipients} recipients
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            Edit
          </button>
          <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            Run Now
          </button>
          <button className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReportsScreen;