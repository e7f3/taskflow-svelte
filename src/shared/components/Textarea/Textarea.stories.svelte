<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Textarea from './Textarea.svelte';

  const { Story } = defineMeta({
    title: 'Shared/Textarea',
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
   */
  let defaultValue = $state('');
  let textValue = $state(
    'This is a sample description with multiple lines of text.\n\nIt demonstrates how the textarea component handles longer content.',
  );
  let errorValue = $state('Too short');
  let disabledValue = $state('This textarea is disabled');
  let requiredValue = $state('');
  let largeValue = $state('');
</script>

<Story name="Default">
  <Textarea bind:value={defaultValue} placeholder="Enter description..." />
</Story>

<Story name="With Value">
  <Textarea bind:value={textValue} placeholder="Enter description..." />
</Story>

<Story name="With Error">
  <Textarea
    bind:value={errorValue}
    placeholder="Enter description..."
    required
    error="Description must be at least 10 characters"
  />
</Story>

<Story name="Disabled">
  <Textarea bind:value={disabledValue} placeholder="Enter description..." disabled />
</Story>

<Story name="Required">
  <Textarea bind:value={requiredValue} placeholder="This field is required" required />
</Story>

<Story name="Large Rows">
  <Textarea bind:value={largeValue} placeholder="Enter a longer description..." rows={8} />
</Story>
