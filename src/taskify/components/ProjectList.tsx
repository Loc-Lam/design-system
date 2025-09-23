import React from 'react';
import type { Project } from '../types';
import { useApp } from '../context/AppContext';
import { Folder, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ onProjectSelect }) => {
  const { projects, currentUser } = useApp();

  const getProjectStats = (project: Project) => {
    const total = project.tasks.length;
    const done = project.tasks.filter(t => t.status === 'Done').length;
    const inProgress = project.tasks.filter(t => t.status === 'In Progress').length;
    const myTasks = project.tasks.filter(t => t.assigneeId === currentUser?.id).length;

    return { total, done, inProgress, myTasks };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Logged in as:</span>
              <span className="font-medium text-gray-800">{currentUser?.name}</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const stats = getProjectStats(project);
            const completionPercentage = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;

            return (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <Folder className="w-6 h-6 text-indigo-600" />
                  </div>
                  {stats.myTasks > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {stats.myTasks} assigned to you
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">{Math.round(completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-600">{stats.done}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-gray-600">{stats.inProgress}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{stats.total}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};