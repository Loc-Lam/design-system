import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { UserSelection } from './components/UserSelection';
import { ProjectList } from './components/ProjectList';
import { KanbanBoard } from './components/KanbanBoard';
import type { Project } from './types';

type ViewMode = 'user-selection' | 'project-list' | 'kanban-board';

export const TaskifyApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('user-selection');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleUserSelect = () => {
    setViewMode('project-list');
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setViewMode('kanban-board');
  };

  const handleBackToProjects = () => {
    setViewMode('project-list');
    setSelectedProject(null);
  };

  return (
    <AppProvider>
      {viewMode === 'user-selection' && (
        <UserSelection onUserSelect={handleUserSelect} />
      )}
      {viewMode === 'project-list' && (
        <ProjectList onProjectSelect={handleProjectSelect} />
      )}
      {viewMode === 'kanban-board' && selectedProject && (
        <KanbanBoard project={selectedProject} onBack={handleBackToProjects} />
      )}
    </AppProvider>
  );
};