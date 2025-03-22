import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Components/LoginPage'; // Adjust path if needed
import Dashboard from './Components/Dashboard'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [userType, setUserType] = useState(null); // 'admin' or 'endUser'
  const userType = localStorage.getItem('userType') || 'endUser';

  // Function to handle successful login
  const handleLogin = (email, password, type) => {
    // Here you would typically make an API call to verify credentials
    // For now, we'll just simulate a successful login
    console.log('Login attempt:', { email, password, type });
    
    // Set logged in state and user type
    setIsLoggedIn(true);
    //setUserType(type);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    //setUserType(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          !isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />
        } />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard userType={userType} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;