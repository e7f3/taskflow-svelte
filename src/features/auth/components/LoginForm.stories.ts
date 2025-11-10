// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/svelte-vite';
import LoginForm from './LoginForm.svelte';

const meta = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    // You can add interaction tests here using @storybook/test
    // For example, submitting empty form to show validation
  }
};
