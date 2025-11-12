<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Features/Auth/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<script lang="ts">
  import LoginForm from './LoginForm.svelte';
</script>

<Story name="Default">
  <LoginForm />
</Story>
