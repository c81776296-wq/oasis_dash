
export type Status = 'To Do' | 'In Progress' | 'Review' | 'Complete' | 'Blocked';
export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low' | 'Clear';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
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
}

export type ViewType = 'Overview' | 'List' | 'Board' | 'Calendar' | 'Gantt' | 'Team';
