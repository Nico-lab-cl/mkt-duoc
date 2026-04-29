import React, { useState } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Success from './components/Success';
import ChatflowSimulator from './components/ChatflowSimulator';

const App = () => {
  const [view, setView] = useState('login'); // 'login' | 'dashboard' | 'simulator' | 'chatflow' | 'success'
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    if (platform === 'chatflow') {
      setView('chatflow');
    } else {
      setView('simulator');
    }
  };

  return (
    <ProjectProvider>
      <div className="antialiased">
        {view === 'login' && (
          <Login onNext={() => setView('dashboard')} />
        )}
        
        {view === 'dashboard' && (
          <Dashboard onSelectPlatform={handleSelectPlatform} />
        )}

        {view === 'simulator' && (
          <Simulator 
            platform={selectedPlatform} 
            onBack={() => setView('dashboard')}
            onFinish={() => setView('success')} 
          />
        )}

        {view === 'chatflow' && (
          <ChatflowSimulator 
            onBack={() => setView('dashboard')}
            onFinish={() => setView('success')}
          />
        )}

        {view === 'success' && (
          <Success onBackToDashboard={() => setView('dashboard')} />
        )}
      </div>
    </ProjectProvider>
  );
};

export default App;
