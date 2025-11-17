<!--
  Storybook stories for FilterBar component.
  
  Learning Note - Storybook with Svelte:
  Stories demonstrate different filter states.
  We use decorators to set up the filters store state for each story.
-->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FilterBar from './FilterBar.svelte';

  const { Story } = defineMeta({
    title: 'Features/Tasks/FilterBar',
    component: FilterBar,
    tags: ['autodocs'],
    parameters: {
      layout: 'padded',
      // Default to no filters
      filterState: initialState,
      docs: { 
        story: { inline: false }, // Opens stories in iframe - isolated!
      },
    },
    decorators: [
      (story, context) => {
        filtersStore.set(context.parameters.filterState);
        return story();
      },
    ],
  });
</script>

<script lang="ts">
  import { MOCK_USERS } from '@/features/auth/services/authService';
  import { filtersStore, initialState } from '../../stores/filtersStore/filtersStore';
</script>

<!-- Default state - no filters active -->
<Story name="Default" parameters={{ filterState: initialState }}>
  <div
    style="padding: 16px;

      background: #f5f5f5;">
    <FilterBar />
    <div
      style="margin-top: 16px; padding: 12px; border-radius: 8px;

        background: #fff;">
      <p
        style="margin: 0;

          font-size: 14px; color: #666;">
        No filters active - all dropdowns show "All" options
      </p>
    </div>
  </div>
</Story>

<!-- With search query -->
<Story 
  name="With Search Query"
  parameters={{
    filterState: {
      searchQuery: 'design',
      assigneeId: undefined,
      priority: undefined,
    },
  }}
>
  <div
    style="padding: 16px;

      background: #f5f5f5;">
    <FilterBar />
    <div
      style="margin-top: 16px; padding: 12px; border-radius: 8px;

        background: #fff;">
      <p
        style="margin: 0;

          font-size: 14px; color: #666;">
        Search query: "design" - filters tasks by title/description
      </p>
    </div>
  </div>
</Story>

<!-- With assignee filter -->
<Story 
  name="With Assignee Filter"
  parameters={{
    filterState: {
      searchQuery: undefined,
      assigneeId: MOCK_USERS[0].id,
      priority: undefined,
    },
  }}
>
  <div
    style="padding: 16px;

      background: #f5f5f5;">
    <FilterBar />
    <div
      style="margin-top: 16px; padding: 12px; border-radius: 8px;

        background: #fff;">
      <p
        style="margin: 0;

          font-size: 14px; color: #666;">
        Filtered by assignee: {MOCK_USERS[0].name}
      </p>
    </div>
  </div>
</Story>

<!-- With priority filter -->
<Story 
  name="With Priority Filter"
  parameters={{
    filterState: {
      searchQuery: undefined,
      assigneeId: undefined,
      priority: 'high',
    },
  }}
>
  <div
    style="padding: 16px;

      background: #f5f5f5;">
    <FilterBar />
    <div
      style="margin-top: 16px; padding: 12px; border-radius: 8px;

        background: #fff;">
      <p
        style="margin: 0;

          font-size: 14px; color: #666;">
        Filtered by priority: High
      </p>
    </div>
  </div>
</Story>

<!-- With all filters active -->
<Story 
  name="All Filters Active"
  parameters={{
    filterState: {
      searchQuery: 'bug',
      assigneeId: MOCK_USERS[1].id,
      priority: 'critical',
    },
  }}
>
  <div
    style="padding: 16px;

      background: #f5f5f5;">
    <FilterBar />
    <div
      style="margin-top: 16px; padding: 12px; border-radius: 8px;

        background: #fff;">
      <p
        style="margin: 0;

          font-size: 14px; color: #666;">
        All filters active: search="bug", assignee={MOCK_USERS[1].name}, priority=Critical
      </p>
      <p
        style="margin: 8px 0 0;

          font-size: 14px; color: #666;">
        "Clear Filters" button should be visible
      </p>
    </div>
  </div>
</Story>
