import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState({
    agencyName: '',
    projectName: '',
    platform: null,
    campaign: {},
    adSet: {},
    ad: {},
  });

  // Intentar cargar el usuario desde localStorage al iniciar
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('simulador_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Guardar usuario en localStorage cuando cambie
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('simulador_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('simulador_user');
    }
  }, [currentUser]);

  // Gestión de Temas
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('simulador_theme') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('simulador_theme', theme);
    // Aplicar clase de tema al body para CSS global
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const updateProjectData = (newData) => {
    setProjectData((prev) => ({ ...prev, ...newData }));
  };

  const resetProject = () => {
    setProjectData({
      agencyName: '',
      projectName: '',
      platform: null,
      campaign: {},
      adSet: {},
      ad: {},
    });
  };

  return (
    <ProjectContext.Provider value={{ 
      projectData, 
      updateProjectData, 
      resetProject, 
      currentUser, 
      setCurrentUser,
      theme,
      setTheme
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
