<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Shared/Banner',
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['info', 'warning', 'error', 'success'],
        description: 'Banner variant style',
      },
      title: {
        control: 'text',
        description: 'Banner title',
      },
      message: {
        control: 'text',
        description: 'Banner message',
      },
      icon: {
        control: 'text',
        description: 'Custom icon (optional)',
      },
    },
    parameters: {
      docs: {
        story: {
          inline: false,
        },
      },
    },
  });
</script>

<script lang="ts">
  import Banner from './Banner.svelte';
</script>

<Story name="Info">
  <Banner
    variant="info"
    title="Information"
    message="This is an informational message to keep you updated."
  />
</Story>

<Story name="Warning">
  <Banner
    variant="warning"
    title="Storage Unavailable"
    message="Your data won't be saved between sessions. This may be due to private browsing mode or browser settings."
  />
</Story>

<Story name="Error">
  <Banner
    variant="error"
    title="Error Occurred"
    message="Something went wrong. Please try again or contact support."
  />
</Story>

<Story name="Success">
  <Banner
    variant="success"
    title="Success!"
    message="Your changes have been saved successfully."
  />
</Story>

<Story name="Without Title">
  <Banner
    variant="info"
    message="This banner has no title, just a message."
  />
</Story>

<Story name="Custom Icon">
  <Banner
    variant="info"
    title="Custom Icon"
    message="You can provide a custom icon instead of the default."
    icon="🎉"
  />
</Story>

<Story name="Custom Content">
  <Banner variant="warning" title="Custom Content">
    <p
      style="margin: 0;

        font-size: 13px; line-height: 1.4;">
      You can use the children snippet for custom content with
      <strong>formatting</strong> and <a href="https://example.com">links</a>.
    </p>
  </Banner>
</Story>
