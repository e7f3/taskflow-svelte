<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
      layout: 'centered',
    },
    argTypes: {
      onclick: { action: 'clicked' },
    },
  });
</script>

<script lang="ts">
  import Button from './Button.svelte';
</script>

<Story name="Primary">
  <Button variant="primary">Primary Button</Button>
</Story>

<Story name="Secondary">
  <Button variant="secondary">Secondary Button</Button>
</Story>

<Story name="Danger">
  <Button variant="danger">Delete</Button>
</Story>

<Story name="Small">
  <Button size="small">Small Button</Button>
</Story>

<Story name="Large">
  <Button size="large">Large Button</Button>
</Story>

<Story name="Disabled">
  <Button disabled>Disabled Button</Button>
</Story>

<Story name="Loading">
  <Button loading>Loading...</Button>
</Story>

<Story name="All Variants">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
    <div style="display: flex; gap: 1rem;">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
    <div style="display: flex; gap: 1rem;">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
    <div style="display: flex; gap: 1rem;">
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  </div>
</Story>
