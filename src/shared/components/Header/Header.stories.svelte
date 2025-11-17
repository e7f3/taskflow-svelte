<!--
  Storybook stories for Header component.
  
  Learning Note - Storybook with Svelte:
  Stories demonstrate different states of the Header component.
  We use onMount to set up auth state for each story.
-->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { initialState } from '@/features/auth/stores/authStore';
  import Header from './Header.svelte';

  const { Story } = defineMeta({
    title: 'Shared/Header',
    component: Header,
    tags: ['autodocs'],
    
    parameters: {
      layout: 'fullscreen',
      // Default to logged out
      authState: initialState,
      docs: { 
        story: { inline: false }, // Opens stories in iframe - isolated!
      },
    },
    decorators: [
      (story, context) => {
        authStore.set(context.parameters.authState);
        return story();
      },
    ],
  });
</script>

<script lang="ts">
  import { MOCK_USERS } from '@/features/auth/services/authService';
  import { authStore } from '@/features/auth/stores/authStore';
</script>

<!-- Now this story inherits the default (logged out) -->
<Story name="Not Authenticated" parameters={{ authState: initialState}}>
  <Header />
  <div style="padding: 24px;">
    <p><strong>Not Authenticated State</strong></p>
    <p>Only shows the TaskFlow title, no user info or logout button</p>
  </div>
</Story>

<!-- This story overrides with logged in state -->
<Story 
  name="Authenticated"
  parameters={{
    authState: {
      isAuthenticated: true,
      currentUser: MOCK_USERS[0],
      sessionToken: 'mock-token',
    },
  }}
>
  <Header />
  <div style="padding: 24px;">
    <p><strong>Authenticated State</strong></p>
    <p>Shows user avatar (👩💼), name (Alice Johnson), and logout button</p>
  </div>
</Story>