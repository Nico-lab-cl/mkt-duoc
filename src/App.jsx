import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Success from './components/Success';
import ChatflowSimulator from './components/ChatflowSimulator';
import GroupSelection from './components/GroupSelection';
import KPIModule from './components/KPIModule';

const AppContent = () => {
  const { currentUser, setCurrentUser } = useProject();
  const [view, setView] = useState(currentUser ? (currentUser.group_id || currentUser.role === 'admin' ? 'dashboard' : 'group-selection') : 'login'); 
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Determinar la vista inicial o transiciones automáticas
  useEffect(() => {
    if (currentUser) {
      if (!currentUser.group_id && currentUser.role === 'student') {
        setView('group-selection');
      } else if (view === 'login') {
        setView('dashboard');
      }
    }
  }, [currentUser]);

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    if (platform === 'chatflow') {
      setView('chatflow');
    } else if (platform === 'kpi') {
      setView('kpi');
    } else {
      setView('simulator');
    }
  };

  return (
    <div className="antialiased">
      {view === 'login' && (
        <Login onNext={() => {}} />
      )}

      {view === 'group-selection' && (
        <GroupSelection onNext={() => setView('dashboard')} />
      )}
      
      {view === 'dashboard' && (
        <Dashboard 
          onSelectPlatform={handleSelectPlatform} 
          onChangeGroup={() => setView('group-selection')}
        />
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

      {view === 'kpi' && (
        <KPIModule 
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'success' && (
        <Success onBackToDashboard={() => setView('dashboard')} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
};

export default App;
