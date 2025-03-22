import React, { useState } from 'react';
import { useEffect } from 'react';
import { User, Users, Zap, Clock, Settings, Search } from 'lucide-react';




const UserManagementScreen = ({ darkMode }) => {

  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('endUser');
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('');


  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          alert('✅ User deleted!');
          fetchUsers();
          fetchUserStats();
        } else {
          alert(`❌ Failed: ${data.error}`);
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('❌ Failed to delete user');
      }
    }
  };
  

  const fetchUserStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/user-stats');
      const data = await res.json();
      setUserStats(data);
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);
  return (
    
    <div className="transform transition-all duration-500 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          User Management
        </h2>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition-colors duration-200 flex items-center`}
          onClick={() => setShowAddUserModal(true)}>
            <User className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium transition-colors duration-200 flex items-center`}>
            <Settings className="h-4 w-4 mr-2" />
            User Policies
          </button>
        </div>
      </div>
      
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Users" 
          value={userStats?.totalUsers || '...'} 
          change="1" 
          timePeriod="this month" 
          icon={<Users className="h-5 w-5" />}
          color="blue"
          darkMode={darkMode}
        />
        <StatsCard 
          title="Admins" 
          value={userStats?.adminCount || '...'} 
          change="1" 
          timePeriod="this month" 
          icon={<User className="h-5 w-5" />}
          color="purple"
          darkMode={darkMode}
        />
        <StatsCard 
          title="Active Users" 
          value="1" 
          change="2" 
          timePeriod="last 7 days" 
          icon={<Zap className="h-5 w-5" />}
          color="green"
          darkMode={darkMode}
        />
        <StatsCard 
          title="Pending Invites" 
          value={userStats?.pendingInvites || '...'} 
          change="0" 
          timePeriod="unchanged" 
          icon={<Clock className="h-5 w-5" />}
          color="yellow"
          darkMode={darkMode}
        />
      </div>
      
      {/* User Management Table */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow overflow-hidden transform transition-all duration-300 hover:shadow-lg mb-6`}>
        <div className="p-4 flex justify-between items-center">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            System Users
          </h3>
          
          <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md px-3 py-2 flex items-center transition-colors duration-300 w-64`}>
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className={`bg-transparent border-none outline-none text-sm w-full ${darkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>User</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Email</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Role</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Last Active</th>
                <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
                <th className={`px-4 py-3 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wider`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
            {users.map((user, idx) => (
              <UserRow
                key={idx}
                id={user._id}
                name={user.email.split('@')[0]}
                email={user.email}
                role={user.role}
                lastActive="N/A"
                status="Active"
                darkMode={darkMode}
                onDelete={handleDeleteUser}
                onEdit={(id, email, role) => {
                  setEditUserId(id);
                  setEditUserEmail(email);
                  setEditUserRole(role);
                  setShowEditUserModal(true);
                }}
              />
            ))}
            </tbody>
          </table>
        </div>
        
        
        {/* Pagination */}
        <div className={`px-4 py-3 flex items-center justify-between ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing 1-5 of 32 users
          </div>
          <div className="flex space-x-1">
            <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} text-sm`}>
              Previous
            </button>
            <button className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'} text-sm`}>
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
      
      {/* User Activity & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            Recent User Activity
          </h3>
          <div className={`space-y-4 max-h-96 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
            <ActivityItem
              user="Jane Smith"
              action="updated system settings"
              time="2 hours ago"
              darkMode={darkMode}
            />
            <ActivityItem
              user="John Davis"
              action="viewed consumption dashboard"
              time="2 hours ago"
              darkMode={darkMode}
            />
            <ActivityItem
              user="Sarah Johnson"
              action="added new user Emily Wilson"
              time="1 day ago"
              darkMode={darkMode}
            />
            <ActivityItem
              user="Jane Smith"
              action="generated monthly report"
              time="1 day ago"
              darkMode={darkMode}
            />
            <ActivityItem
              user="Michael Brown"
              action="updated profile information"
              time="3 days ago"
              darkMode={darkMode}
            />
          </div>
        </div>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>

              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full mb-3 p-2 rounded border"
              />

              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full mb-3 p-2 rounded border"
              />

              <label className="block text-sm mb-1">Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full mb-4 p-2 rounded border"
              >
                <option>admin</option>
                <option>endUser</option>
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:5000/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: newUserEmail,
                          password: newUserPassword,
                          role: newUserRole
                        })
                      });

                      const data = await res.json();
                      if (res.ok) {
                        alert('✅ User added successfully!');
                        setShowAddUserModal(false);
                        setNewUserEmail('');
                        setNewUserPassword('');
                        setNewUserRole('endUser');
                        fetchUserStats(); // refresh stats
                        fetchUsers();     // refresh user list
                      } else {
                        alert(`❌ Failed: ${data.error}`);
                      }
                    } catch (err) {
                      console.error(err);
                      alert('❌ Failed to add user');
                    }
                  }}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'}`}>
              <h3 className="text-lg font-semibold mb-4">Edit User</h3>

              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                className="w-full mb-3 p-2 rounded border"
              />

              <label className="block text-sm mb-1">Role</label>
              <select
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value)}
                className="w-full mb-4 p-2 rounded border"
              >
                <option>admin</option>
                <option>endUser</option>
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditUserModal(false)}
                  className="px-3 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`http://localhost:5000/api/users/${editUserId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: editUserEmail, role: editUserRole })
                      });

                      const data = await res.json();
                      if (res.ok) {
                        alert('✅ User updated successfully!');
                        setShowEditUserModal(false);
                        fetchUsers(); // Refresh list
                        fetchUserStats();
                      } else {
                        alert(`❌ Failed: ${data.error}`);
                      }
                    } catch (err) {
                      console.error(err);
                      alert('❌ Failed to update user');
                    }
                  }}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        
        {/* User Roles & Permissions */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg`}>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
            User Roles & Permissions
          </h3>
          <div className={`space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Administrator</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  5 users
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Full system access, user management, configuration, training models
              </p>
              <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                Edit Permissions
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">endUser</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  27 users
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                View dashboards, analyze consumption, personal settings
              </p>
              <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                Edit Permissions
              </button>
            </div>
            
            <div className="mt-4">
              <button className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium transition-colors duration-200`}>
                Create New Role
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for Stats Card
const StatsCard = ({ title, value, change, timePeriod, icon, color, darkMode }) => {
  const colorClasses = {
    blue: darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600',
    green: darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600',
    yellow: darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600',
    purple: darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600',
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} bg-opacity-90 rounded-lg shadow p-5 transform transition-all duration-300 hover:shadow-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
          <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center">
        <span className={`${parseInt(change) > 0 ? 'text-green-500' : parseInt(change) < 0 ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-600'} mr-1 text-sm`}>
          {parseInt(change) > 0 ? '+' : ''}{change}
        </span>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {timePeriod}
        </span>
      </div>
    </div>
  );
};

// Component for User Row
// Component for User Row
const UserRow = ({ id, name, email, role, lastActive, status, darkMode, onDelete, onEdit }) => {
  const statusColors = {
    Active: darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700',
    Inactive: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
    Pending: darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700',
  };

  return (
    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="ml-3">
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{name}</div>
          </div>
        </div>
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{email}</td>
      <td className={`px-4 py-3 whitespace-nowrap`}>
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
          role === 'admin'
            ? darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
            : darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
        }`}>
          {role}
        </span>
      </td>
      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lastActive}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${statusColors[status]}`}>{status}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          onClick={() => onEdit(id, email, role)}>
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};


// Component for Activity Item
const ActivityItem = ({ user, action, time, darkMode }) => (
  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-150`}>
    <div className="flex items-center">
      <div className="mr-3">
        <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {user.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>
      <div>
        <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{user}</div>
        <div className="flex items-center">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{action}</span>
          <span className={`mx-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{time}</span>
        </div>
      </div>
    </div>
  </div>
);

export default UserManagementScreen;