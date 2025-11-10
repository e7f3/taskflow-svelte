/**
 * Mock data for Storybook stories
 */

import type { Task, TaskAssignee } from '../../features/tasks/types/task.types';
import type { User } from '../../features/auth/types/auth.types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'john',
    name: 'John Doe',
    avatar: '👨‍💼'
  },
  {
    id: '2',
    username: 'jane',
    name: 'Jane Smith',
    avatar: '👩‍💼'
  },
  {
    id: '3',
    username: 'bob',
    name: 'Bob Johnson',
    avatar: '👨‍💻'
  }
];

export const mockAssignees: TaskAssignee[] = mockUsers.map(user => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar
}));

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create mockups for the new landing page with updated branding',
    status: 'in-progress',
    priority: 'high',
    assignee: mockAssignees[0],
    createdAt: new Date('2024-11-01').getTime(),
    updatedAt: new Date('2024-11-10').getTime(),
    createdBy: '1'
  },
  {
    id: '2',
    title: 'Fix authentication bug',
    description: 'Users are unable to log in with Google OAuth',
    status: 'todo',
    priority: 'critical',
    assignee: mockAssignees[1],
    createdAt: new Date('2024-11-08').getTime(),
    updatedAt: new Date('2024-11-09').getTime(),
    createdBy: '2'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples',
    status: 'done',
    priority: 'medium',
    assignee: mockAssignees[2],
    createdAt: new Date('2024-10-25').getTime(),
    updatedAt: new Date('2024-11-05').getTime(),
    createdBy: '3'
  },
  {
    id: '4',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: 'todo',
    priority: 'low',
    assignee: mockAssignees[0],
    createdAt: new Date('2024-11-01').getTime(),
    updatedAt: new Date('2024-11-01').getTime(),
    createdBy: '1'
  }
];
