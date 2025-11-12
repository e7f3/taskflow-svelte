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
  import type { EntityId } from '@/shared/types/common.types';
  import TaskForm from './TaskForm.svelte';
  import type { CreateTaskData, TaskSaveResult } from '../../types/task.types';

  function handleSave(
    taskData: CreateTaskData,
    taskId?: EntityId,
  ): Promise<TaskSaveResult> {
    console.log('Save task:', taskData, taskId);
    return Promise.resolve({ success: true, task: { ...mockTasks[0], ...taskData } });
  }

  function handleCancel() {
    console.log('Cancel');
  }
</script>

<Story name="Create New Task">
  <TaskForm onSave={handleSave} onCancel={handleCancel} />
</Story>

<Story name="Edit Existing Task">
  <TaskForm task={mockTasks[0]} onSave={handleSave} onCancel={handleCancel} />
</Story>
