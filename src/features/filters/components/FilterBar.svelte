<script lang="ts">
  import { authService } from '@/features/auth/services/authService';
  import type { Priority } from '@/features/tasks/types/task.types';
  import Button from '@/shared/components/Button/Button.svelte';
  import Input from '@/shared/components/Input/Input.svelte';
  import Select from '@/shared/components/Select/Select.svelte';
  import styles from './FilterBar.module.css';
  import { filtersStore } from '../stores/filtersStore';

  const users = authService.getAllUsers();
  const priorityOptions: Priority[] = ['low', 'medium', 'high', 'critical'];

  // Simple one-way binding: store → UI
  let searchInput = $state($filtersStore.searchQuery || '');
  let assigneeFilter = $state($filtersStore.assigneeId || '');
  let priorityFilter = $state($filtersStore.priority || '');
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Debounce search
  $effect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filtersStore.setSearchQuery(searchInput || undefined);
    }, 300);
  });

  // Immediate updates for dropdowns
  $effect(() => {
    filtersStore.setAssigneeFilter(assigneeFilter || undefined);
  });

  $effect(() => {
    filtersStore.setPriorityFilter((priorityFilter as Priority) || undefined);
  });

  function handleClearFilters() {
    searchInput = '';
    assigneeFilter = '';
    priorityFilter = '';
    filtersStore.clearFilters();
  }

  const hasFilters = $derived(filtersStore.hasActiveFilters($filtersStore));
</script>

<div class={styles.filterBar}>
  <div class={styles.filterGroup}>
    <Input type="text" placeholder="Search tasks..." bind:value={searchInput} />
  </div>

  <div class={styles.filterGroup}>
    <Select bind:value={assigneeFilter}>
      <option value="">All Assignees</option>
      {#each users as user (user.id)}
        <option value={user.id}>{user.avatar} {user.name}</option>
      {/each}
    </Select>
  </div>

  <div class={styles.filterGroup}>
    <Select bind:value={priorityFilter}>
      <option value="">All Priorities</option>
      {#each priorityOptions as priority (priority)}
        <option value={priority}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </option>
      {/each}
    </Select>
  </div>

  {#if hasFilters}
    <div class={styles.filterGroup}>
      <Button variant="secondary" onclick={handleClearFilters}>
        Clear Filters
      </Button>
    </div>
  {/if}
</div>
