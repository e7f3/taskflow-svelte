<script lang="ts">
  import { onMount } from 'svelte';
  import Board from './features/tasks/components/Board/Board.svelte';
  import { taskService } from './features/tasks/services/taskService';

  // Load tasks when app starts
  onMount(() => {
    taskService.loadTasks();
  });
</script>

<main>
  <header>
    <h1>TaskFlow</h1>
  </header>
  <Board />
</main>

<style>
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: var(--font-family, sans-serif);
  background-color: #f5f5f5;
}

header {
  background: white;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
  border-bottom: 1px solid #e0e0e0;
}

h1 {
  color: var(--color-primary, #0073ea);
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}
</style>
