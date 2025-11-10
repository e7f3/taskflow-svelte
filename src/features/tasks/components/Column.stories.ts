import type { Meta, StoryObj } from '@storybook/svelte';
import Column from './Column.svelte';
import { mockTasks } from '../../../shared/storybook/mockData';

const meta = {
  title: 'Features/Tasks/Column',
  component: Column,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Column title'
    },
    tasks: {
      control: 'object',
      description: 'Array of tasks to display'
    },
    ondrop: { action: 'dropped' },
    ondragover: { action: 'drag over' }
  }
} satisfies Meta<Column>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TodoColumn: Story = {
  args: {
    title: 'To Do',
    tasks: mockTasks.filter(t => t.status === 'todo')
  }
};

export const InProgressColumn: Story = {
  args: {
    title: 'In Progress',
    tasks: mockTasks.filter(t => t.status === 'in-progress')
  }
};

export const DoneColumn: Story = {
  args: {
    title: 'Done',
    tasks: mockTasks.filter(t => t.status === 'done')
  }
};

export const EmptyColumn: Story = {
  args: {
    title: 'Empty Column',
    tasks: []
  }
};

export const ManyTasks: Story = {
  args: {
    title: 'Busy Column',
    tasks: [...mockTasks, ...mockTasks, ...mockTasks]
  }
};
