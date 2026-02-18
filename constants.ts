
import { Task, User, Team } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Augusto Silva', avatar: '', role: 'Owner', email: 'augusto@example.com' },
  { id: '2', name: 'Bruno Santos', avatar: '', role: 'Member', email: 'bruno@oasisinternationalsolutions.com' },
  { id: '3', name: 'Djavan Silva', avatar: '', role: 'Member', email: 'djavan@nuvera.global' },
  { id: '4', name: 'Gustavo', avatar: '', role: 'Member', email: 'gustavo@example.com' },
  { id: '5', name: 'Ramiro Kolesnik', avatar: '', role: 'Member', email: 'ramiro@example.com' },
];

export const TEAMS: Team[] = [
  { id: 'team-1', name: 'Team Dubai', color: '#ff7043', membersCount: 3 },
  { id: 'team-2', name: 'Team Oman', color: '#ba68c8', membersCount: 3 },
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
  'TO DO': 'bg-gray-400',
  'COMPLETED': 'bg-green-500',
  'CANCELLED': 'bg-red-500',
  'BLOCKED': 'bg-red-500',
};

export const MOCK_TAGS: string[] = [];
