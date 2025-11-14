<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Features/Filters/FilterBar',
    component: FilterBar,
    tags: ['autodocs'],
    parameters: {
      layout: 'padded',
    },
  });
</script>

<script lang="ts">
  import FilterBar from './FilterBar.svelte';
</script>

<Story name="Default">
  <FilterBar />
</Story>