// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import TaskCard from './TaskCard.svelte';
import { mockTasks } from '../../../../shared/storybook/mockData';

const meta = {
  title: 'Features/Tasks/TaskCard',
  component: TaskCard,
  tags: ['autodocs'],
  argTypes: {
    task: {
      description: 'Task object to display',
      control: 'object'
    },
    onclick: { action: 'clicked' },
    ondragstart: { action: 'drag started' }
  }
} satisfies Meta<TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    task: mockTasks[0]
  }
};

export const UrgentPriority: Story = {
  args: {
    task: mockTasks[1]
  }
};

export const Completed: Story = {
  args: {
    task: mockTasks[2]
  }
};

export const LowPriority: Story = {
  args: {
    task: mockTasks[3]
  }
};

export const NoDueDate: Story = {
  args: {
    task: {
      ...mockTasks[0],
      dueDate: undefined
    }
  }
};

export const NoDescription: Story = {
  args: {
    task: {
      ...mockTasks[0],
      description: undefined
    }
  }
};

export const LongTitle: Story = {
  args: {
    task: {
      ...mockTasks[0],
      title: 'This is a very long task title that should wrap to multiple lines and test how the card handles overflow content'
    }
  }
};
