<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mockTasks } from '@/shared/storybook/mockData';

  const { Story } = defineMeta({
    title: 'Features/Tasks/Column',
    component: Column,
    tags: ['autodocs'],
    argTypes: {
      onDrop: { action: 'dropped' },
      onEditTask: { action: 'edit task' },
      onDeleteTask: { action: 'delete task' },
      onDragStart: { action: 'drag start' },
      onDragEnd: { action: 'drag end' },
    },
  });
</script>

<script lang="ts">
  import Column from './Column.svelte';

  const todoTasks = mockTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = mockTasks.filter((t) => t.status === 'in-progress');
  const doneTasks = mockTasks.filter((t) => t.status === 'done');
  const manyTasks = [...mockTasks, ...mockTasks, ...mockTasks];

  function handleDrop() {}
  function handleEditTask() {}
  function handleDeleteTask() {}
  function handleDragStart() {}
  function handleDragEnd() {}
</script>

<Story name="Todo Column">
  <Column
    status="todo"
    title="To Do"
    tasks={todoTasks}
    draggedTask={null}
    onDrop={handleDrop}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="In Progress Column">
  <Column
    status="in-progress"
    title="In Progress"
    tasks={inProgressTasks}
    draggedTask={null}
    onDrop={handleDrop}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Done Column">
  <Column
    status="done"
    title="Done"
    tasks={doneTasks}
    draggedTask={null}
    onDrop={handleDrop}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Empty Column">
  <Column
    status="todo"
    title="Empty Column"
    tasks={[]}
    draggedTask={null}
    onDrop={handleDrop}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>

<Story name="Many Tasks">
  <Column
    status="todo"
    title="Busy Column"
    tasks={manyTasks}
    draggedTask={null}
    onDrop={handleDrop}
    onEditTask={handleEditTask}
    onDeleteTask={handleDeleteTask}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  />
</Story>
