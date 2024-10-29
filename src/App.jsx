import React, { useState } from 'react';
import SignIn from './components/SignIn';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <SignIn onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div>Welcome to the NoteWise App!</div>
      )}
    </div>
  );
};

export default App;
