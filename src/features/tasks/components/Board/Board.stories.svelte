<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Features/Tasks/Board',
    component: Board,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { mockTasks } from '@/shared/storybook/mockData';
  import Board from './Board.svelte';
  import { tasksStore } from '../../stores/tasksStore';
  import type { Task } from '../../types/task.types';

  function initializeStore(tasks: Task[]) {
    onMount(() => {
      tasksStore.set(tasks);
    });
  }
</script>

<Story name="Default">
  {#snippet children()}
    {initializeStore(mockTasks)}
    <Board />
  {/snippet}
</Story>

<Story name="With Mock Data">
  {#snippet children()}
    {initializeStore(mockTasks)}
    <Board />
  {/snippet}
</Story>

<Story name="Empty Board">
  {#snippet children()}
    {initializeStore([])}
    <Board />
  {/snippet}
</Story>
