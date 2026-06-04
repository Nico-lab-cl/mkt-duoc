import React, { useState, useEffect } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Success from './components/Success';
import ChatflowSimulator from './components/ChatflowSimulator';
import GroupSelection from './components/GroupSelection';
import KPIModule from './components/KPIModule';
import LeadMagnetStudio from './components/PageBuilder';
import N8NModule from './components/N8NModule';

import PagePublicView from './components/PageBuilder/PagePublicView';
import VocationalFairLanding from './components/VocationalFairLanding';

const AppContent = () => {
  const { currentUser, setCurrentUser } = useProject();
  
  // Check for public page view in URL
  const path = window.location.pathname;
  const isPublicPage = path.startsWith('/p/');
  const publicPageId = isPublicPage ? path.split('/p/')[1] : null;
  const isIdentidadPage = path.startsWith('/identidad') || path.startsWith('/registro') || path.startsWith('/martech');

  const [view, setView] = useState(
    isPublicPage 
      ? 'public-view' 
      : isIdentidadPage 
        ? 'identidad-view' 
        : (currentUser ? (currentUser.group_id || currentUser.role === 'admin' ? 'dashboard' : 'group-selection') : 'login')
  ); 
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Determinar la vista inicial o transiciones automáticas
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'guest') {
        if (view === 'login') {
          setView('dashboard');
        }
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/');
        }
      } else if (view !== 'identidad-view') {
        if (!currentUser.group_id && currentUser.role === 'student') {
          setView('group-selection');
        } else if (view === 'login') {
          setView('dashboard');
        }
      }
    }
  }, [currentUser, view]);

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    if (platform === 'chatflow') {
      setView('chatflow');
    } else if (platform === 'kpi') {
      setView('kpi');
    } else if (platform === 'leadmagnet') {
      setView('leadmagnet');
    } else if (platform === 'n8n') {
      setView('n8n');
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

      {view === 'leadmagnet' && (
        <LeadMagnetStudio 
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'n8n' && (
        <N8NModule 
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'public-view' && (
        <PagePublicView id={publicPageId} />
      )}

      {view === 'identidad-view' && (
        <VocationalFairLanding />
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
