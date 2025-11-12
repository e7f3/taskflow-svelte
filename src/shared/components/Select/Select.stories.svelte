<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
  });
</script>

<script lang="ts">
  import Select from './Select.svelte';

  let defaultValue = $state('');
  let selectedValue = $state('medium');
  let errorValue = $state('');
  let disabledValue = $state('medium');
  let requiredValue = $state('');
  let statusValue = $state('inProgress');
</script>

<Story name="Default">
  <Select bind:value={defaultValue}>
    <option value="">Select priority...</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </Select>
</Story>

<Story name="With Value">
  <Select bind:value={selectedValue}>
    <option value="">Select priority...</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </Select>
</Story>

<Story name="With Error">
  <Select bind:value={errorValue} required error="Please select an option">
    <option value="">Select priority...</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </Select>
</Story>

<Story name="Disabled">
  <Select bind:value={disabledValue} disabled>
    <option value="">Select priority...</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </Select>
</Story>

<Story name="Required">
  <Select bind:value={requiredValue} required>
    <option value="">Select priority...</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
    <option value="critical">Critical</option>
  </Select>
</Story>

<Story name="Status Select">
  <Select bind:value={statusValue}>
    <option value="">Select status...</option>
    <option value="todo">To Do</option>
    <option value="inProgress">In Progress</option>
    <option value="done">Done</option>
  </Select>
</Story>
