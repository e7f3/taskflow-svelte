<!--
  Storybook stories for ConfirmationModal component.
  
  Learning Note - Modal Stories in Storybook:
  ConfirmationModal uses Modal which renders to document.body.
  We use `inline: false` to render in an iframe for proper isolation.
-->
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/ConfirmationModal',
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      docs: { 
        story: { inline: false }, // Opens stories in iframe - isolated!
      },
    },
  });
</script>

<script lang="ts">
  import ConfirmationModal from './ConfirmationModal.svelte';
  import Button from '../Button/Button.svelte';

  let isOpen1 = $state(false);
  let isOpen2 = $state(false);
</script>

<Story name="Default">
  <div style="padding: 2rem;">
    <Button onclick={() => (isOpen1 = true)}>Open Confirmation</Button>
  </div>

  <ConfirmationModal
    isOpen={isOpen1}
    message="Are you sure you want to proceed with this action?"
    onConfirm={() => {
      console.log('Confirmed!');
      isOpen1 = false;
    }}
    onCancel={() => (isOpen1 = false)}
  />
</Story>

<Story name="Delete Confirmation">
  <div style="padding: 2rem;">
    <Button variant="danger" onclick={() => (isOpen2 = true)}>Delete Item</Button>
  </div>

  <ConfirmationModal
    isOpen={isOpen2}
    title="Delete Item"
    message="Are you sure you want to delete this item? This action cannot be undone."
    confirmText="Delete"
    cancelText="Cancel"
    confirmVariant="danger"
    onConfirm={() => {
      console.log('Deleted!');
      isOpen2 = false;
    }}
    onCancel={() => (isOpen2 = false)}
  />
</Story>
