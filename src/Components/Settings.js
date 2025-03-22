import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Sliders, 
  Eye, 
  EyeOff, 
  Save, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Monitor, 
  Moon, 
  Sun,
  Globe,
  HelpCircle,
  Mail,
  MessageSquare
} from 'lucide-react';

const SettingsScreen = ({ darkMode, toggleDarkMode }) => {
  const [activeTab, setActiveTab] = useState('account');
  
  // Form state (simplified for demo)
  const [showPassword, setShowPassword] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  return (
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Settings
        </h2>
        <div>
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200 flex items-center`}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-4`}>
          <nav>
            <SettingsNavItem 
              icon={<User className="h-5 w-5" />}
              label="Account"
              active={activeTab === 'account'}
              onClick={() => setActiveTab('account')}
              darkMode={darkMode}
            />
            <SettingsNavItem 
              icon={<Lock className="h-5 w-5" />}
              label="Security"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
              darkMode={darkMode}
            />
            <SettingsNavItem 
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
              darkMode={darkMode}
            />
            <SettingsNavItem 
              icon={<Monitor className="h-5 w-5" />}
              label="Appearance"
              active={activeTab === 'appearance'}
              onClick={() => setActiveTab('appearance')}
              darkMode={darkMode}
            />
            <SettingsNavItem 
              icon={<Sliders className="h-5 w-5" />}
              label="Preferences"
              active={activeTab === 'preferences'}
              onClick={() => setActiveTab('preferences')}
              darkMode={darkMode}
            />
            <SettingsNavItem 
              icon={<HelpCircle className="h-5 w-5" />}
              label="Help & Support"
              active={activeTab === 'help'}
              onClick={() => setActiveTab('help')}
              darkMode={darkMode}
            />
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="md:col-span-3">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Account Settings
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <div className="mb-4 md:mb-0">
                    <div className={`h-24 w-24 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-2xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      JD
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                          First Name
                        </label>
                        <input
                          type="text"
                          className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                          defaultValue="John"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                          defaultValue="Davis"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                          Email
                        </label>
                        <input
                          type="email"
                          className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                          defaultValue="john.davis@example.com"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                          defaultValue="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Job Title
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                        defaultValue="Energy Manager"
                      />
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Type</div>
                      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>End User</div>
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</div>
                      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>January 15, 2025</div>
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Login</div>
                      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Today, 10:42 AM</div>
                    </div>
                    <div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                      <div className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'} flex items-center`}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} text-white font-medium transition-colors duration-200`}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Security Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Change Password
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`w-full p-2 pr-10 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                          placeholder="••••••••"
                        />
                        <button 
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          ) : (
                            <Eye className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        New Password
                      </label>
                      <input
                        type="password"
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Shield className="h-5 w-5 mr-2" />
                    Two-Factor Authentication
                  </h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-3 flex items-center justify-between`}>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</div>
                      <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'} flex items-center`}>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Not Enabled
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
                      Enable
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Session Management
                  </h4>
                  <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Session</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Chrome on macOS • 192.168.1.105
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        Active Now
                      </div>
                    </div>
                    <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Log Out All Other Sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Notification Settings
                </h3>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All Notifications
                  </span>
                  <ToggleSwitch 
                    enabled={notificationsEnabled} 
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    darkMode={darkMode}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Mail className="h-5 w-5 mr-2" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3">
                    <NotificationItem
                      label="Energy Consumption Alerts"
                      description="Receive notifications when consumption exceeds normal patterns"
                      enabled={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      darkMode={darkMode}
                    />
                    <NotificationItem
                      label="System Reports"
                      description="Weekly and monthly usage reports"
                      enabled={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      darkMode={darkMode}
                    />
                    <NotificationItem
                      label="Optimization Suggestions"
                      description="Tips to improve energy efficiency"
                      enabled={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                    <Bell className="h-5 w-5 mr-2" />
                    Push Notifications
                  </h4>
                  <div className="space-y-3">
                    <NotificationItem
                      label="Real-time Alerts"
                      description="Important alerts that require immediate attention"
                      enabled={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      darkMode={darkMode}
                    />
                    <NotificationItem
                      label="Energy Usage Insights"
                      description="AI-generated insights about your energy consumption"
                      enabled={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      darkMode={darkMode}
                    />
                    <NotificationItem
                      label="System Updates"
                      description="Notifications about system maintenance and updates"
                      enabled={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    In-App Notifications
                  </h4>
                  <div className="space-y-3">
                    <NotificationItem
                      label="Dashboard Alerts"
                      description="Show alerts directly in your dashboard"
                      enabled={true}
                      onChange={() => {}}
                      darkMode={darkMode}
                    />
                    <NotificationItem
                      label="Task Reminders"
                      description="Reminders about scheduled tasks and actions"
                      enabled={true}
                      onChange={() => {}}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Appearance Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Theme
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ThemeOption
                      icon={<Sun className="h-5 w-5" />}
                      label="Light Mode"
                      active={!darkMode}
                      onClick={() => toggleDarkMode(false)}
                      darkMode={darkMode}
                    />
                    <ThemeOption
                      icon={<Moon className="h-5 w-5" />}
                      label="Dark Mode"
                      active={darkMode}
                      onClick={() => toggleDarkMode(true)}
                      darkMode={darkMode}
                    />
                    <ThemeOption
                      icon={<Monitor className="h-5 w-5" />}
                      label="System Default"
                      active={false}
                      onClick={() => {}}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Dashboard Layout
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LayoutOption
                      label="Compact"
                      description="Display more information in a condensed layout"
                      active={true}
                      darkMode={darkMode}
                    />
                    <LayoutOption
                      label="Comfortable"
                      description="More spacing between elements for readability"
                      active={false}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Accent Color
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <ColorOption color="bg-blue-500" active={true} darkMode={darkMode} />
                    <ColorOption color="bg-purple-500" active={false} darkMode={darkMode} />
                    <ColorOption color="bg-green-500" active={false} darkMode={darkMode} />
                    <ColorOption color="bg-red-500" active={false} darkMode={darkMode} />
                    <ColorOption color="bg-yellow-500" active={false} darkMode={darkMode} />
                    <ColorOption color="bg-indigo-500" active={false} darkMode={darkMode} />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Font Size
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>A</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      defaultValue="3"
                      className={`w-full h-2 rounded-lg appearance-none ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} focus:outline-none`}
                    />
                    <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>A</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Preferences Settings */}
          {activeTab === 'preferences' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Preferences
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Language
                  </h4>
                  <div className="flex items-center">
                    <Globe className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <select className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border`}>
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese (Simplified)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Units
                  </h4>
                  <div className="space-y-3">
                    <PreferenceItem
                      label="Energy Units"
                      options={["kWh", "MWh", "BTU"]}
                      defaultValue="kWh"
                      darkMode={darkMode}
                    />
                    <PreferenceItem
                      label="Temperature"
                      options={["Celsius (°C)", "Fahrenheit (°F)"]}
                      defaultValue="Celsius (°C)"
                      darkMode={darkMode}
                    />
                    <PreferenceItem
                      label="Currency"
                      options={["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)"]}
                      defaultValue="USD ($)"
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Date & Time
                  </h4>
                  <div className="space-y-3">
                    <PreferenceItem
                      label="Date Format"
                      options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]}
                      defaultValue="MM/DD/YYYY"
                      darkMode={darkMode}
                    />
                    <PreferenceItem
                      label="Time Format"
                      options={["12-hour (AM/PM)", "24-hour"]}
                      defaultValue="12-hour (AM/PM)"
                      darkMode={darkMode}
                    />
                    <PreferenceItem
                      label="Time Zone"
                      options={["Eastern Time (EST/EDT)", "Central Time (CST/CDT)", "Pacific Time (PST/PDT)", "UTC", "Custom"]}
                      defaultValue="Eastern Time (EST/EDT)"
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Dashboard Preferences
                  </h4>
                  <div className="space-y-3">
                    <SwitchItem
                      label="Show welcome message on login"
                      enabled={true}
                      darkMode={darkMode}
                    />
                    <SwitchItem
                      label="Auto-refresh dashboard data"
                      enabled={true}
                      darkMode={darkMode}
                    />
                    <SwitchItem
                      label="Show energy-saving tips"
                      enabled={true}
                      darkMode={darkMode}
                    />
                    <SwitchItem
                      label="Analytics cookies"
                      enabled={false}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Help & Support */}
          {activeTab === 'help' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6`}>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                Help & Support
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Documentation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SupportCard
                      title="User Guide"
                      description="Learn how to use all the features of WattWiseAI"
                      link="#"
                      darkMode={darkMode}
                    />
                    <SupportCard
                      title="API Documentation"
                      description="Developer resources for integrating with our platform"
                      link="#"
                      darkMode={darkMode}
                    />
                    <SupportCard
                      title="FAQ"
                      description="Answers to common questions about the platform"
                      link="#"
                      darkMode={darkMode}
                    />
                    <SupportCard
                      title="Video Tutorials"
                      description="Step-by-step visual guides to get the most out of WattWiseAI"
                      link="#"
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Contact Support
                  </h4>
                  <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Subject
                      </label>
                      <select className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-white border-gray-300 text-gray-800'} border`}>
                        <option>Technical Issue</option>
                        <option>Billing Question</option>
                        <option>Feature Request</option>
                        <option>Account Support</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'} mb-1`}>
                        Message
                      </label>
                      <textarea 
                        rows="4"
                        className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-300' : 'bg-white border-gray-300 text-gray-800'} border`}
                        placeholder="Describe your issue or question..."
                      ></textarea>
                    </div>
                    <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
                      Submit Ticket
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-md ${darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-3`}>
                        <MessageSquare className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h5 className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-1`}>
                          Live Chat Support
                        </h5>
                        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'} mb-2`}>
                          Our support team is available Monday-Friday, 9AM-5PM EST.
                        </p>
                        <button className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200`}>
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for settings navigation items
const SettingsNavItem = ({ icon, label, active, onClick, darkMode }) => (
  <button
    className={`w-full flex items-center p-3 rounded-md mb-1 transition-colors duration-200 ${
      active
        ? darkMode 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-100 text-gray-900'
        : darkMode
          ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
    onClick={onClick}
  >
    <div className="mr-3">{icon}</div>
    <span className="font-medium">{label}</span>
    {active && (
      <ChevronRight className="ml-auto h-5 w-5" />
    )}
  </button>
);

// Component for toggle switch
const ToggleSwitch = ({ enabled, onChange, darkMode }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled
        ? darkMode ? 'bg-blue-600' : 'bg-blue-600'
        : darkMode ? 'bg-gray-600' : 'bg-gray-300'
    }`}
    onClick={onChange}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// Component for notification items
const NotificationItem = ({ label, description, enabled, onChange, darkMode }) => (
  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
    <div>
      <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</div>
      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</div>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} darkMode={darkMode} />
  </div>
);

// Component for theme option
const ThemeOption = ({ icon, label, active, onClick, darkMode }) => (
  <button
    className={`p-4 rounded-lg border ${
      active
        ? darkMode 
          ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
          : 'border-blue-500 bg-blue-50'
        : darkMode
          ? 'border-gray-700 bg-gray-750 hover:border-gray-600' 
          : 'border-gray-200 bg-white hover:border-gray-300'
    } flex flex-col items-center space-y-2 transition-colors duration-200`}
    onClick={onClick}
  >
    <div className={`p-2 rounded-full ${
      active
        ? darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
        : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
    }`}>
      {icon}
    </div>
    <span className={`text-sm font-medium ${
      active
        ? darkMode ? 'text-blue-400' : 'text-blue-600'
        : darkMode ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </span>
  </button>
);

// Component for layout options
const LayoutOption = ({ label, description, active, darkMode }) => (
  <button
    className={`p-4 rounded-lg border ${
      active
        ? darkMode 
          ? 'border-blue-500 bg-blue-900 bg-opacity-20' 
          : 'border-blue-500 bg-blue-50'
        : darkMode
          ? 'border-gray-700 bg-gray-750 hover:border-gray-600' 
          : 'border-gray-200 bg-white hover:border-gray-300'
    } flex flex-col items-start text-left transition-colors duration-200`}
  >
    <span className={`font-medium mb-1 ${
      active
        ? darkMode ? 'text-blue-400' : 'text-blue-600'
        : darkMode ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </span>
    <span className={`text-sm ${
      active
        ? darkMode ? 'text-blue-300' : 'text-blue-500'
        : darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {description}
    </span>
    {active && (
      <div className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
        <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
    )}
  </button>
);

// Component for color options
const ColorOption = ({ color, active, darkMode }) => (
  <button
    className={`h-8 w-8 rounded-full ${color} flex items-center justify-center ${
      active ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''
    }`}
  >
    {active && <CheckCircle className="h-5 w-5 text-white" />}
  </button>
);

// Component for preference items
const PreferenceItem = ({ label, options, defaultValue, darkMode }) => (
  <div className="flex justify-between items-center">
    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
    <select className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-800'} border text-sm`} defaultValue={defaultValue}>
      {options.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  </div>
);

// Component for switch items
const SwitchItem = ({ label, enabled, darkMode }) => (
  <div className="flex justify-between items-center">
    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
    <ToggleSwitch enabled={enabled} onChange={() => {}} darkMode={darkMode} />
  </div>
);

// Component for support cards
const SupportCard = ({ title, description, link, darkMode }) => (
  <a
    href={link}
    className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} flex items-start transition-colors duration-200`}
  >
    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-3`}>
      <HelpCircle className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
    </div>
    <div>
      <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>{title}</h5>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  </a>
);

export default SettingsScreen;