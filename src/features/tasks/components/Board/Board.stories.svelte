<!--
  Storybook stories for Board component.
  
  Learning Note - Store Isolation in Storybook:
  We use decorators to set up store state for each story.
  The decorator runs before each story, ensuring isolated state.
  
  The `inline: false` parameter opens stories in an iframe,
  which provides better isolation for components that use stores.
-->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { mockTasks } from '@/shared/storybook/mockData';
  import Board from './Board.svelte';
  import { filtersStore, initialState } from '../../stores/filtersStore/filtersStore';
  import { tasksStore } from '../../stores/tasksStore/tasksStore';

  const { Story } = defineMeta({
    title: 'Features/Tasks/Board',
    component: Board,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      docs: { 
        story: { inline: false }, // Opens stories in iframe - isolated!
      },
      // Default store state
      tasks: mockTasks,
    },
    decorators: [
      (story, context) => {
        // Reset stores before each story
        tasksStore.set(context.parameters.tasks || []);
        filtersStore.set(initialState);
        return story();
      },
    ],
  });
</script>

<Story name="Default" parameters={{ tasks: mockTasks }}>
  <Board />
</Story>

<Story name="With Mock Data" parameters={{ tasks: mockTasks }}>
  <Board />
</Story>

<Story name="Empty Board" parameters={{ tasks: [] }}>
  <Board />
</Story>
