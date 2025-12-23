import React, { useEffect, useState } from 'react';
import Login from './screen/Login';
import Dashboard from './screen/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = localStorage.getItem('accessTokens');
      if (!user) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  
  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
}

// Dashboard
// Fleet
// Trips
// Telemetry
// Fuel
// Lakehouse Sync
// Settings

export default App;