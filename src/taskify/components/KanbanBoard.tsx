import React, { useState } from 'react';
import type { DragEvent } from 'react';
import type { Project, Task, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';
import { TaskCard } from './TaskCard';
import { ArrowLeft, User, MessageSquare } from 'lucide-react';

interface KanbanBoardProps {
  project: Project;
  onBack: () => void;
}

const columns: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, onBack }) => {
  const { currentUser, users, updateTaskStatus } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return project.tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (status: TaskStatus) => {
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      updateTaskStatus(project.id, draggedTask.id, status);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getAssignee = (task: Task) => {
    return users.find(u => u.id === task.assigneeId);
  };

  const isMyTask = (task: Task) => {
    return task.assigneeId === currentUser?.id;
  };

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100';
      case 'In Progress': return 'bg-blue-50';
      case 'In Review': return 'bg-yellow-50';
      case 'Done': return 'bg-green-50';
      default: return 'bg-gray-100';
    }
  };

  const getColumnBorderColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do': return 'border-gray-300';
      case 'In Progress': return 'border-blue-300';
      case 'In Review': return 'border-yellow-300';
      case 'Done': return 'border-green-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Logged in as:</span>
              <span className="font-medium text-gray-800">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div
              key={column}
              className={`${getColumnColor(column)} rounded-lg p-4 min-h-[600px] ${
                dragOverColumn === column ? 'ring-2 ring-indigo-400' : ''
              }`}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(column)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${getColumnBorderColor(column)}`}>
                <h3 className="font-semibold text-gray-700">{column}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                  {getTasksByStatus(column).length}
                </span>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column).map(task => {
                  const assignee = getAssignee(task);
                  const myTask = isMyTask(task);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => setSelectedTask(task)}
                      className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                        myTask ? 'ring-2 ring-indigo-400 bg-indigo-50' : ''
                      } ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
                    >
                      <h4 className="font-medium text-gray-800 mb-2 text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {assignee && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{assignee.name.split(' ')[0]}</span>
                            </div>
                          )}
                        </div>
                        {task.comments.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{task.comments.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedTask && (
        <TaskCard
          task={selectedTask}
          projectId={project.id}
          isMyTask={isMyTask(selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};