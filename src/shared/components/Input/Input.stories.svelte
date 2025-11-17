<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './Input.svelte';

  const { Story } = defineMeta({
    title: 'Shared/Input',
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
      docs: {
        story: { inline: false }, // Render stories in iframe for state isolation
      },
    },
  });
</script>

<script lang="ts">
  /**
   * Learning Note - Storybook State Isolation:
   * By setting `docs.story.inline: false`, each story renders in its own iframe.
   * This provides proper state isolation between stories.
   * Each story has its own state variable that doesn't interfere with others.
   */
  let defaultValue = $state('');
  let textValue = $state('Sample text');
  let passwordValue = $state('');
  let emailValue = $state('');
  let errorValue = $state('invalid@');
  let disabledValue = $state('Disabled input');
  let requiredValue = $state('');
  let interactiveValue = $state('');
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

<Story name="Interactive Example">
  <div style="display: flex; flex-direction: column; gap: 16px; min-width: 300px;">
    <Input bind:value={interactiveValue} placeholder="Type something..." />
    <div
      style="padding: 12px; border-radius: 8px;

        font-size: 14px; color: #666;

        background: #f5f5f5;">
      Current value: <strong>{interactiveValue || '(empty)'}</strong>
    </div>
  </div>
</Story>
