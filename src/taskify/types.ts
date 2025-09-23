export type UserRole = 'Product Manager' | 'Engineer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  projectId: string;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
}