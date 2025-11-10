import type { Meta, StoryObj } from '@storybook/svelte';
import Board from './Board.svelte';
import { mockTasks } from '../../../shared/storybook/mockData';

const meta = {
  title: 'Features/Tasks/Board',
  component: Board,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<Board>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMockData: Story = {
  render: () => ({
    Component: Board,
    props: {}
  }),
  play: async () => {
    // In a real scenario, you'd mock the store here
    // For now, this shows the board structure
  }
};

export const EmptyBoard: Story = {
  render: () => ({
    Component: Board,
    props: {}
  })
};
