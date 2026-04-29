import React, { createContext, useContext, useState } from 'react';

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

  const [currentUser, setCurrentUser] = useState(null);

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
    <ProjectContext.Provider value={{ projectData, updateProjectData, resetProject, currentUser, setCurrentUser }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
