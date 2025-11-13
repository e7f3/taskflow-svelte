<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Modal',
    // Don't set component: Modal here - it causes Storybook to wrap everything in Modal
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<script lang="ts">
  import Modal from './Modal.svelte';
  import Button from '../Button/Button.svelte';

  // Story 1 state
  let isOpen1 = $state(false);

  // Story 2 state
  let isOpen2 = $state(false);

  // Story 3 state
  let isOpen3 = $state(false);
</script>

<Story name="Default">
  <div style="padding: 2rem;">
    <Button onclick={() => (isOpen1 = true)}>Open Modal</Button>
  </div>

  <Modal isOpen={isOpen1} onClose={() => (isOpen1 = false)} title="Modal Title">
    <p>This is the modal content. Click outside or press Escape to close.</p>
    <p>You can put any content here!</p>
  </Modal>
</Story>

<Story name="Without Title">
  <div style="padding: 2rem;">
    <Button onclick={() => (isOpen2 = true)}>Open Modal Without Title</Button>
  </div>

  <Modal isOpen={isOpen2} onClose={() => (isOpen2 = false)}>
    <p>This modal has no title.</p>
    <p>Just content!</p>
  </Modal>
</Story>

<Story name="With Form">
  <div style="padding: 2rem;">
    <Button onclick={() => (isOpen3 = true)}>Open Form Modal</Button>
  </div>

  <Modal isOpen={isOpen3} onClose={() => (isOpen3 = false)} title="Create New Item">
    <form
      onsubmit={(e) => {
        e.preventDefault();
        isOpen3 = false;
      }}
    >
      <div style="margin-bottom: 1rem;">
        <label for="name">Name:</label>
        <input
          id="name"
          type="text"
          style="width: 100%; margin-top: 0.25rem; padding: 0.5rem;"
        />
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <Button type="button" variant="secondary" onclick={() => (isOpen3 = false)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">Save</Button>
      </div>
    </form>
  </Modal>
</Story>
