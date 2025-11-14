<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Features/Tasks/TaskForm',
    component: TaskForm,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
  });
</script>

<script lang="ts">
  import { mockTasks } from '@/shared/storybook/mockData';
  import TaskForm from './TaskForm.svelte';
</script>

<Story name="Create New Task">
  <TaskForm isOpen={true} />
</Story>

<Story name="Edit Existing Task">
  <TaskForm
    isOpen={true}
    task={mockTasks[0]}
  />
</Story>
