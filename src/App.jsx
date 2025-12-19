import React, { useState } from 'react';
import Login from './screen/Login';
import Dashboard from './screen/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cek apakah user sudah login (biasanya cek token di localStorage)
  // Di sini kita gunakan state sederhana
  
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