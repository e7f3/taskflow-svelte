<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mockTasks } from '@/shared/storybook/mockData';

  const { Story } = defineMeta({
    title: 'Features/Tasks/TaskCard',
    component: TaskCard,
    tags: ['autodocs'],
    argTypes: {
      onDragStart: { action: 'drag start' },
      onDragEnd: { action: 'drag end' },
    },
  });
</script>

<script lang="ts">
  import TaskCard from './TaskCard.svelte';

  function handleDragStart() {}
  function handleDragEnd() {}
</script>

<Story name="Default">
  <TaskCard
    task={mockTasks[0]}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Urgent Priority">
  <TaskCard
    task={mockTasks[1]}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Completed">
  <TaskCard
    task={mockTasks[2]}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Low Priority">
  <TaskCard
    task={mockTasks[3]}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="No Description">
  <TaskCard
    task={{
      ...mockTasks[0],
      description: '',
    }}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Long Title">
  <TaskCard
    task={{
      ...mockTasks[0],
      title:
        'This is a very long task title that should wrap to multiple lines and test how the card handles overflow content',
    }}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>
