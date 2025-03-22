import React, { useState } from 'react';
import { useEffect } from 'react';

import { 
  Database, 
  Upload, 
  HardDrive, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Filter, 
  Clock, 
  Calendar, 
  ChevronRight,
  ChevronDown,
  Trash2,
  Download,
  BrainCircuit,
  Eye
} from 'lucide-react';

const SystemDataScreen = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [expandedDataset, setExpandedDataset] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [datasetCategory, setDatasetCategory] = useState('Training Data');
  const [datasets, setDatasets] = useState([]);
  const [storageSize, setStorageSize] = useState('Loading...');
  const [dbPing, setDbPing] = useState('...');
  const [recentActivity, setRecentActivity] = useState([]);
  const [perfMetrics, setPerfMetrics] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [dbStats, setDbStats] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
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

  const fetchPerfMetrics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/performance-metrics');
      const data = await res.json();
      setPerfMetrics(data);
    } catch (err) {
      console.error('Failed to fetch performance metrics', err);
    }
  };
  
  const fetchDbStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/db-stats');
      const data = await response.json();
      setDbStats(data);
    } catch (error) {
      console.error('Failed to fetch DB stats:', error);
    }
  };

  const fetchDatasetsAndPing = async () => {
    try {
      const [datasetsRes, pingRes, activityRes] = await Promise.all([
        fetch('http://localhost:5000/api/datasets'),
        fetch('http://localhost:5000/api/db-ping'),
        fetch('http://localhost:5000/api/recent-activity')
      ]);
  
      const datasetsData = await datasetsRes.json();
      const pingData = await pingRes.json();
      const activityData = await activityRes.json();
  
      setDatasets(datasetsData);
      setDbPing(pingData.ping || 'Unavailable');
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch datasets or ping or activity:', error);
      setDbPing('Unavailable');
    }
  
    fetchStorageSize();
    fetchDbStats();
    fetchPerfMetrics();
    fetchCities();
  };
  
  const fetchStorageSize = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/storage-size');
      const data = await response.json();
      setStorageSize(data.totalSize);
    } catch (error) {
      console.error('Failed to fetch storage size:', error);
      setStorageSize('Error');
    }
  };

  useEffect(() => {  
    fetchDatasetsAndPing();
    fetchStorageSize();
    fetchDbStats();
    fetchPerfMetrics();
    fetchCities();
  }, []);

  const toggleDatasetExpansion = (id) => {
    if (expandedDataset === id) {
      setExpandedDataset(null);
    } else {
      setExpandedDataset(id);
    }
  };
  const handleClear = async () => {
    if (selectedFile) {
      setSelectedFile(null);
      return;
  }
};

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleExportReport = () => {
    window.open('http://localhost:5000/api/export-report', '_blank');
  };


  const handleUpload = async () => {
  if (!selectedFile) {
    setUploadStatus('❌ Please select a file first.');
    return;
  }
  

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('category', datasetCategory.toLowerCase().replace(/\s/g, ''));

  try {
    const response = await fetch('http://localhost:5000/api/upload-csv', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      setUploadStatus('✅ Upload Successful!');
      alert('✅ Upload Successful!');
      fetchDatasetsAndPing();
      setSelectedFile(null); // optional: clear selected file
    } else {
      setUploadStatus(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    setUploadStatus('❌ Upload failed. Check backend server.');
  }
};


const handleProcess = async () => {
  if (!selectedCity) {
    alert('❌ Please select a city before processing.');
    return;
  }

  try {
    setLoading(true);
    //alert("Processing Started");
    const response = await fetch('http://localhost:5000/api/process-city', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: selectedCity }),
    });

    const result = await response.json();

    if (response.ok) {
      //alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.error('Process request failed:', error);
    alert('❌ Failed to trigger processing. Check server.');
  }
  finally {
    setLoading(false);
  }
};




const handlePreview = async (filename, category) => {
  try {
    //alert(`http://localhost:5000/api/preview/${category}/${filename}`);
    const response = await fetch(`http://localhost:5000/api/preview/${filename}?category=${category}`);

    if (!response.ok) {
      throw new Error('File not found');
    }
    const result = await response.text(); // CSV text
    alert("Preview Loaded: \n" + result.slice(0, 500)); // preview first 500 characters
  } catch (error) {
    console.error('Preview failed:', error);
    alert('❌ Failed to preview dataset');
  }
};

const handleDownload = async (filename, category) => {
  try {
    const response = await fetch(`http://localhost:5000/api/download/${filename}?category=${category}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error('Download error:', err);
    alert('❌ Download failed');
  }
};

const handleDelete = async (filename, category) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete "${filename}"?`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/delete/${filename}?category=${category}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (res.ok) {
      alert(`✅ ${filename} deleted successfully.`);
      fetchDatasetsAndPing(); // Refresh list
    } else {
      alert(`❌ Delete failed: ${data.error}`);
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('❌ Delete request failed');
  }
};
  
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          System Data Management
        </h2>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200 flex items-center`}
          onClick={fetchDatasetsAndPing}>
            <RefreshCw className="h-4 w-4 mr-2" /
            >
            Refresh
          </button>
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium transition-colors duration-200 flex items-center`}
          onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatusCard 
          title="Database Connection" 
          status="Connected" 
          statusType="success" 
          details={`Last ping: ${dbPing}`} 
          icon={<Database className="h-5 w-5" />}
          darkMode={darkMode}
        />
        <StatusCard 
          title="Storage Capacity" 
          status={`${storageSize}`} 
          statusType="success" 
          details="Dynamic DB Size" 
          icon={<HardDrive className="h-5 w-5" />} 
          darkMode={darkMode}
        />
        {!loading &&(
        <StatusCard 
          title="Data Processing" 
          status="Ready" 
          statusType="success" 
          details="0 jobs in queue" 
          icon={<RefreshCw className="h-5 w-5" />}
          darkMode={darkMode} 
        
        />
      )}
      {loading &&(
        <StatusCard 
          title="Data Processing" 
          status="Processing" 
          statusType="success" 
          details="1 jobs in queue" 
          icon={<RefreshCw className="h-5 w-5" />}
          darkMode={darkMode} 
        
        />
      )}
      </div>
      
      {/* Tab Navigation */}
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
        <nav className="flex space-x-4">
          <TabButton 
            label="Upload Data" 
            active={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')} 
            icon={<Upload className="h-4 w-4" />}
            darkMode={darkMode}
          />
          <TabButton 
            label="Manage Datasets" 
            active={activeTab === 'manage'} 
            onClick={() => setActiveTab('manage')} 
            icon={<FileText className="h-4 w-4" />}
            darkMode={darkMode}
          />
          <TabButton 
            label="Database Stats" 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
            icon={<Database className="h-4 w-4" />}
            darkMode={darkMode}
          />
        </nav>
      </div>
      
      {/* Upload Data Tab */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="md:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 flex items-center`}>
                <Upload className="h-5 w-5 mr-2" />
                Upload New Dataset
              </h3>
              
              <div className={`border-2 border-dashed rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'} p-8 text-center`}>
                  <Upload className={`h-10 w-10 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Drag and drop your data files here
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                    Supports CSV, JSON, Excel, and SQLite formats
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept=".csv"
                    id="csvFileInput"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />

                  {/* Browse Files Button */}
                  <label htmlFor="csvFileInput">
                    <span className={`inline-block px-4 py-2 rounded-md cursor-pointer ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'} text-white font-medium transition-colors duration-200`}>
                      Browse Files
                    </span>
                  </label>

                  {/* Show selected file name */}
                  {selectedFile && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Selected File: {selectedFile.name}
                    </p>
                  )}
                </div>
                
                {/* Configuration Options */}
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Data Processing Options
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                      Select City
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
                    
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Dataset Category
                      </label>
                      <select
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                        value={datasetCategory}
                        onChange={(e) => setDatasetCategory(e.target.value)}
                      >
                        <option>Training Data</option>
                        <option>Testing Data</option>
                        <option>Validation Data</option>
                        <option>Historical Data</option>
                        <option>cities</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                        Preprocessing Steps
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <PreprocessingOption label="Handle Missing Values" checked={true} darkMode={darkMode} />
                        <PreprocessingOption label="Normalize Data" checked={true} darkMode={darkMode} />
                        <PreprocessingOption label="Remove Commas" checked={true} darkMode={darkMode} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} font-medium transition-colors duration-200`}
                  onClick = {handleClear}>
                    
                    Clear
                  </button>
                  
                  <button
                    onClick={handleUpload}
                    className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}
                  >
                    Upload
                  </button>

                  <button
                    disabled={loading}
                    className={`px-8 py-3 text-lg font-medium text-white rounded-xl flex items-center justify-center ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                    onClick={handleProcess}
                  >
                    {loading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : (
                      <BrainCircuit className="w-6 h-6 mr-2" />
                    )}
                    {loading ? 'Processing...' : 'Process'}
                  </button>
                  {/* {uploadStatus && (
                      <p className={`mt-2 text-sm ${uploadStatus.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
                        {uploadStatus}
                      </p>
                    )} */}
                </div>
              </div>
            </div>
        
          
          {/* Upload Guidelines */}
          <div>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Upload Guidelines
              </h3>
              
              <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Supported Formats
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>CSV (.csv)</li>
                    <li>JSON (.json)</li>
                    <li>Excel (.xlsx, .xls)</li>
                    <li>SQLite (.db, .sqlite)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Required Columns
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>timestamp (date/time)</li>
                    <li>energy_consumption (numeric)</li>
                    <li>device_id (string)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Size Limits
                  </h4>
                  <p>Maximum file size: 1GB per upload</p>
                  <p>Recommended row count: &lt; 1 million</p>
                </div>
                
                <div className={`p-3 rounded-md ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                  <h4 className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-1`}>
                    Pro Tip
                  </h4>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    For large datasets, consider splitting into smaller chunks for better processing performance.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <button className={`w-full px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium transition-colors duration-200 text-sm`}>
                  Download Sample Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Manage Datasets Tab */}
      {activeTab === 'manage' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Manage Datasets
            </h3>
            <div className="flex space-x-2">
              <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md px-3 py-2 flex items-center transition-colors duration-300`}>
                <input 
                  type="text" 
                  placeholder="Search datasets..." 
                  className={`bg-transparent border-none outline-none text-sm w-64 ${darkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
                />
              </div>
              <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}>
                <Filter className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}></th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Name</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Category</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Size</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Uploaded</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {datasets.map((ds, idx) => (
                  <DatasetRow
                    key={idx}
                    id={idx.toString()}
                    name={ds.name}
                    category={ds.category}
                    size={ds.size}
                    uploaded={new Date(ds.uploaded).toLocaleDateString()}
                    status={ds.status}
                    expanded={expandedDataset === idx.toString()}
                    toggleExpand={() => toggleDatasetExpansion(idx.toString())}
                    darkMode={darkMode}
                    handlePreview={handlePreview}
                    handleDownload={handleDownload}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing 5 of 24 datasets
            </div>
            <div className="flex space-x-1">
              <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
                Previous
              </button>
              <button className={`px-3 py-1 rounded ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'} text-sm`}>
                1
              </button>
              <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
                2
              </button>
              <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
                3
              </button>
              <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Database Stats Tab */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              Database Overview
            </h3>
            <div className="space-y-4">
              <StatsItem 
                label="Total Datasets"
                value={`${dbStats?.totalDatasets || 0}`}
                change={`+${dbStats?.thisMonthCount || 0} this month`}
                isPositive={true}
                darkMode={darkMode}
              />
              <StatsItem 
                label="Total Size"
                value={`${dbStats?.totalSizeMB || 0} MB`}
                change={`+${dbStats?.thisMonthSize || 0} MB this month`}
                isPositive={true}
                darkMode={darkMode}
              />
              <StatsItem 
                label="Total Records"
                value={`${dbStats?.totalRecords?.toLocaleString?.() || 0}`}
                change={`+${dbStats?.thisMonthCount || 0} this month`}
                isPositive={true}
                darkMode={darkMode}
              />
              <StatsItem 
                label="Average Query Time"
                value="8 ms"
                change="-12 ms since last month"
                isPositive={true}
                darkMode={darkMode}
              />
            </div>
            
            <div className="mt-6">
              <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                Data Distribution by Type
              </h4>
              <div className="h-8 w-full rounded-full overflow-hidden bg-gray-300">
                <div className="flex h-full">
                {dbStats?.distribution.map((item, index) => (
                  <div
                    key={index}
                    className={`h-full ${
                      item.category === 'trainingdata' ? 'bg-blue-500' :
                      item.category === 'testingdata' ? 'bg-green-500' :
                      item.category === 'validationdata' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  >
                  </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                {dbStats?.distribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-1 ${
                    item.category === 'trainingdata' ? 'bg-blue-500' :
                    item.category === 'testingdata' ? 'bg-green-500' :
                    item.category === 'validationdata' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {item.category.replace('data', '').replace(/^\w/, c => c.toUpperCase())} ({item.percentage}%)
                  </span>
                </div>
              ))}
              </div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
              Recent Database Activity
            </h3>
            
            <div className={`space-y-4 max-h-72 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
            {recentActivity.length > 0 ? recentActivity.map((act, index) => (
                <ActivityItem
                  key={index}
                  action={act.action}
                  details={act.details}
                  time={act.time}
                  user={act.user}
                  darkMode={darkMode}
                />
              )) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No activity found</p>
              )}
            </div>
            
            <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
          <div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Read Time</div>
                  <div className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {perfMetrics?.readTime || '...'}
                  </div>
                </div>
                <div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Write Time</div>
                  <div className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {perfMetrics?.writeTime || '...'}
                  </div>
                </div>
                <div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
                  <div className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {perfMetrics?.uptime || '...'}
                  </div>
                </div>
                <div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cache Hit Rate</div>
                  <div className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {perfMetrics?.cacheHitRate || '...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Database Maintenance
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MaintenanceCard
                  title="Scheduled Backup"
                  status="Next run in 8 hours"
                  description="Daily incremental backup to encrypted cloud storage."
                  buttonText="Run Now"
                  darkMode={darkMode}
                />
                <MaintenanceCard
                  title="Data Cleanup"
                  status="Next run in 3 days"
                  description="Remove temporary data and optimize storage."
                  buttonText="Run Now"
                  darkMode={darkMode}
                />
                <MaintenanceCard
                  title="Performance Tuning"
                  status="Next run in 6 days"
                  description="Analyze and optimize query performance."
                  buttonText="Run Now"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component for system status card
const StatusCard = ({ title, status, statusType, details, icon, darkMode }) => {
  const statusColors = {
    success: darkMode ? 'text-green-400 bg-green-900 bg-opacity-20 border-green-800' : 'text-green-700 bg-green-50 border-green-200',
    warning: darkMode ? 'text-yellow-400 bg-yellow-900 bg-opacity-20 border-yellow-800' : 'text-yellow-700 bg-yellow-50 border-yellow-200',
    error: darkMode ? 'text-red-400 bg-red-900 bg-opacity-20 border-red-800' : 'text-red-700 bg-red-50 border-red-200'
  };
  
  const iconColors = {
    success: darkMode ? 'text-green-400' : 'text-green-600',
    warning: darkMode ? 'text-yellow-400' : 'text-yellow-600',
    error: darkMode ? 'text-red-400' : 'text-red-600'
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-base font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{title}</h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border ${statusColors[statusType]}`}>
            {status}
          </div>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{details}</p>
        </div>
        <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className={iconColors[statusType]}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

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

// Component for preprocessing option checkboxes
const PreprocessingOption = ({ label, checked, darkMode }) => (
  <label className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
    <input 
      type="checkbox" 
      defaultChecked={checked} 
      className={`h-4 w-4 rounded ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'}`} 
    />
    <span className="text-sm">{label}</span>
  </label>
);

// Component for dataset row with expandable details
const DatasetRow = ({ id, name, category, size, uploaded, status, expanded, toggleExpand, darkMode, handlePreview, handleDownload, handleDelete }) => {
  const statusColors = {
    'Processed': darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
    'Processing': darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    'Error': darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700',
    'Pending': darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
  };
  
  return (
    <>
      <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
        <td className="px-4 py-3">
          <button onClick={toggleExpand} className="focus:outline-none">
            {expanded ? (
              <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </button>
        </td>
        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div className="flex items-center">
            <FileText className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>{name}</span>
          </div>
        </td>
        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category}</td>
        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{size}</td>
        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{uploaded}</td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusColors[status]}`}>
            {status}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            onClick={() => handlePreview(name, category)}>
              <Eye className="h-4 w-4" />
            </button>
            <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            onClick={() => handleDownload(name, category)}>
              <Download className="h-4 w-4" />
            </button>
            <button className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
            onClick={() => handleDelete(name, category)}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className={darkMode ? 'bg-gray-750' : 'bg-gray-50'}>
          <td colSpan="7" className="px-4 py-3">
            <div className="pl-8 pr-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Dataset Details
                  </h4>
                  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} text-sm`}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Rows:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>4.2 million</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Columns:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>24</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Missing Values:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>0.02%</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Data Range:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Jan 2025 - Mar 2025</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Format:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>CSV</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Processing Information
                  </h4>
                  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} text-sm`}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Processed On:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Mar 15, 2025 (14:32)</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Processing Time:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>3m 42s</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Preprocessing:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Missing values, Normalization</div>
                      
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Used in Models:</div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>v2.4.1, v2.3.8</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} font-medium transition-colors duration-200`}>
                  View Full Details
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Component for database stats items
const StatsItem = ({ label, value, change, isPositive, darkMode }) => (
  <div className="flex justify-between items-center">
    <div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
      <div className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</div>
    </div>
    <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
      {change}
    </div>
  </div>
);

// Component for database activity items
const ActivityItem = ({ action, details, time, user, darkMode }) => (
  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
    <div className="flex justify-between">
      <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{action}</div>
      <div className="flex items-center">
        <Clock className={`h-3.5 w-3.5 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{time}</span>
      </div>
    </div>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{details}</p>
    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>by {user}</div>
  </div>
);

// Component for maintenance cards
const MaintenanceCard = ({ title, status, description, buttonText, darkMode }) => (
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{title}</h4>
    <div className="flex items-center mb-2">
      <Clock className={`h-4 w-4 mr-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      <span className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{status}</span>
    </div>
    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{description}</p>
    <button className={`w-full py-1.5 px-3 rounded-md text-sm ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
      {buttonText}
    </button>
  </div>
);

export default SystemDataScreen;