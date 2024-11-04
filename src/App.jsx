import React, { useState } from 'react';
import SignIn from './components/SignIn';
import NewNotes from './components/NewNotes';
import CaptureImages from './components/CaptureImages';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notesId, setNotesId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [localization, setLocalization] = useState(null); 

  const handleLoginSuccess = (localizationData) => {
    setIsAuthenticated(true);
    setLocalization(localizationData);
  };

  const handleStartCapture = (notesId) => {
    setNotesId(notesId);
    setIsCapturing(true);
  };

   return (
    <div className="app">
      {!isAuthenticated ? (
        <SignIn onLoginSuccess={handleLoginSuccess} />
      ) : isCapturing ? (
        <CaptureImages notesId={notesId} onBack={() => setIsCapturing(false)} />
      ) : (
        <NewNotes localization={localization} onNoteCreation={setNotesId} onStartCapture={handleStartCapture} />
      )}
    </div>
  );
};

export default App;
