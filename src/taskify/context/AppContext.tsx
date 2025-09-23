import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Project, Comment, TaskStatus } from '../types';
import { users as mockUsers, projects as mockProjects } from '../mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  setCurrentUser: (user: User) => void;
  updateTaskStatus: (projectId: string, taskId: string, newStatus: TaskStatus) => void;
  updateTaskAssignee: (projectId: string, taskId: string, assigneeId: string) => void;
  addComment: (projectId: string, taskId: string, content: string) => void;
  editComment: (projectId: string, taskId: string, commentId: string, content: string) => void;
  deleteComment: (projectId: string, taskId: string, commentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const updateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const updateTaskAssignee = (projectId: string, taskId: string, assigneeId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, assigneeId } : task
            ),
          };
        }
        return project;
      })
    );
  };

  const addComment = (projectId: string, taskId: string, content: string) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      authorId: currentUser.id,
      taskId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId
                ? { ...task, comments: [...task.comments, newComment] }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const editComment = (projectId: string, taskId: string, commentId: string, content: string) => {
    if (!currentUser) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    comments: task.comments.map(comment =>
                      comment.id === commentId && comment.authorId === currentUser.id
                        ? { ...comment, content, updatedAt: new Date() }
                        : comment
                    ),
                  }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  const deleteComment = (projectId: string, taskId: string, commentId: string) => {
    if (!currentUser) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    comments: task.comments.filter(
                      comment => !(comment.id === commentId && comment.authorId === currentUser.id)
                    ),
                  }
                : task
            ),
          };
        }
        return project;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users: mockUsers,
        projects,
        setCurrentUser,
        updateTaskStatus,
        updateTaskAssignee,
        addComment,
        editComment,
        deleteComment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};