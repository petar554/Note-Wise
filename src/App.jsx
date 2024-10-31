import React, { useState } from 'react';
import SignIn from './components/SignIn';
import NewNotes from './components/NewNotes';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localization, setLocalization] = useState(null); 
  const handleLoginSuccess = (localizationData) => {
    setIsAuthenticated(true);
    setLocalization(localizationData);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <SignIn onLoginSuccess={handleLoginSuccess} />
      ) : (
        <NewNotes localization={localization} />
      )}
    </div>
  );
};

export default App;
