
export type Status = 'TO DO' | 'COMPLETED' | 'CANCELLED' | 'BLOCKED' | string;
export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low' | 'Clear';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  membersCount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: User;
  dueDate: string;
  startDate: string;
  tags: string[];
  taskType?: string;
}

export type ViewType = 'Overview' | 'List' | 'Board' | 'Calendar' | 'Gantt' | 'Team';
