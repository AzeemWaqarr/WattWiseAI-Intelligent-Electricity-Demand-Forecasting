import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('admin'); // Default role
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        role,
      });

      setSuccessMessage(response.data.message || 'Login successful');
      setErrorMessage('');

      // Save userType to localStorage to pass to Dashboard
      localStorage.setItem('userType', role);

      // Optional: Pass user info to parent component
      if (onLogin) onLogin(response.data.user);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Login failed');
      setSuccessMessage('');
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
      <div className="hidden md:flex md:w-2/3 items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Zap className="w-4/5 h-4/5 text-gray-300" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6 tracking-wider">WattWiseAI</h1>
          <p className="text-2xl text-blue-100 max-w-2xl">
            Intelligent Power Consumption Prediction for a Sustainable Future
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/3 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-12 w-12 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-xs">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Login
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Select User Type</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full py-2 px-4 border ${role === 'admin' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm text-sm font-medium hover:bg-blue-50`}
                onClick={() => setRole('admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className={`w-full py-2 px-4 border ${role === 'endUser' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'} rounded-md shadow-sm text-sm font-medium hover:bg-blue-50`}
                onClick={() => setRole('endUser')}
              >
                End User
              </button>
            </div>

            {errorMessage && <p className="text-red-600 text-xs text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-xs text-center">{successMessage}</p>}

            <div className="text-center pt-2">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
