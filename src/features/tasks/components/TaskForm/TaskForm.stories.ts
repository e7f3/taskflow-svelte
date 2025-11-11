// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import TaskForm from './TaskForm.svelte';

const meta = {
  title: 'Features/Tasks/TaskForm',
  component: TaskForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<TaskForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    // You can add interaction tests here using @storybook/test
    // For example, submitting empty form to show validation
  }
};
