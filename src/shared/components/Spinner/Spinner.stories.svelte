<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Spinner',
    tags: ['autodocs'],
    argTypes: {
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'Size of the spinner',
      },
      label: {
        control: 'text',
        description: 'Accessibility label for screen readers',
      },
    },
    parameters: {
      layout: 'centered',
    },
  });
</script>

<script lang="ts">
  import Spinner from './Spinner.svelte';
</script>

<Story name="Small">
  <Spinner size="small" />
</Story>

<Story name="Medium">
  <Spinner size="medium" />
</Story>

<Story name="Large">
  <Spinner size="large" />
</Story>

<Story name="Custom Label">
  <Spinner size="medium" label="Please wait while we load your data..." />
</Story>

<Story name="All Sizes">
  <div style="display: flex; align-items: center; gap: 2rem;">
    <div style="text-align: center;">
      <Spinner size="small" />
      <p
        style="margin-top: 0.5rem;

          font-size: 12px;">Small</p>
    </div>
    <div style="text-align: center;">
      <Spinner size="medium" />
      <p
        style="margin-top: 0.5rem;

          font-size: 12px;">Medium</p>
    </div>
    <div style="text-align: center;">
      <Spinner size="large" />
      <p
        style="margin-top: 0.5rem;

          font-size: 12px;">Large</p>
    </div>
  </div>
</Story>

<Story name="In Context">
  <div
    style=" display: flex; flex-direction: column; justify-content: center; align-items: center;width: 400px; height: 300px; border: 1px solid #e0e0e0; border-radius: 8px;

      background: #f5f5f5;"
  >
    <Spinner size="large" label="Loading your tasks..." />
    <p
      style="margin-top: 1rem;

        font-size: 14px; color: #666;">Loading your tasks...</p>
  </div>
</Story>
