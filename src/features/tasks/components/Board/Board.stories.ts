// @ts-nocheck
import { mockTasks } from '@/shared/storybook/mockData';
import Board from './Board.svelte';
import { tasksStore } from '../../stores/tasksStore';
import type { Meta, StoryObj } from '@storybook/svelte-vite';

const meta = {
  title: 'Features/Tasks/Board',
  component: Board,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => {
      // Initialize store with mock data before rendering
      tasksStore.set(mockTasks);
      return story();
    },
  ],
} satisfies Meta<Board>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMockData: Story = {};

export const EmptyBoard: Story = {
  decorators: [
    (story) => {
      // Clear the store for empty board
      tasksStore.set([]);
      return story();
    },
  ],
};
