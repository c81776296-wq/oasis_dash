
import { Task, User } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/alex/100', role: 'Full Stack Dev', email: 'alex@example.com' },
  { id: '2', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/100', role: 'UI/UX Designer', email: 'sarah@example.com' },
  { id: '3', name: 'Marco Silva', avatar: 'https://picsum.photos/seed/marco/100', role: 'Product Manager', email: 'marco@example.com' },
  { id: '4', name: 'Elena Petrova', avatar: 'https://picsum.photos/seed/elena/100', role: 'QA Engineer', email: 'elena@example.com' },
];

export const MOCK_TASKS: Task[] = [];

export const PRIORITY_COLORS: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-600',
  High: 'bg-orange-100 text-orange-600',
  Normal: 'bg-blue-100 text-blue-600',
  Low: 'bg-gray-100 text-gray-600',
  Clear: 'bg-transparent text-gray-400',
};

export const STATUS_COLORS: Record<string, string> = {
  'To Do': 'bg-gray-400',
  'In Progress': 'bg-blue-500',
  'Review': 'bg-purple-500',
  'Complete': 'bg-green-500',
  'Blocked': 'bg-red-500',
};
