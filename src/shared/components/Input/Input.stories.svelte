<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
  });
</script>

<script lang="ts">
  import Input from './Input.svelte';

  let defaultValue = $state('');
  let textValue = $state('Sample text');
  let passwordValue = $state('');
  let emailValue = $state('');
  let errorValue = $state('invalid@');
  let disabledValue = $state('Disabled input');
  let requiredValue = $state('');
</script>

<Story name="Default">
  <Input bind:value={defaultValue} placeholder="Enter text..." />
</Story>

<Story name="With Value">
  <Input bind:value={textValue} placeholder="Enter text..." />
</Story>

<Story name="Password">
  <Input bind:value={passwordValue} type="password" placeholder="Enter password..." />
</Story>

<Story name="Email">
  <Input bind:value={emailValue} type="email" placeholder="Enter email..." />
</Story>

<Story name="With Error">
  <Input
    bind:value={errorValue}
    type="email"
    placeholder="Enter email..."
    required
    error="Please enter a valid email address"
  />
</Story>

<Story name="Disabled">
  <Input bind:value={disabledValue} placeholder="Enter text..." disabled />
</Story>

<Story name="Required">
  <Input bind:value={requiredValue} placeholder="This field is required" required />
</Story>
