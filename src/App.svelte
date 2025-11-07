<script lang="ts">
  /**
   * Root App component.
   * 
   * This is a placeholder that will be implemented in Task 11.
   * For now, it just displays a welcome message to verify the setup works.
   * 
   * Learning Note:
   * Svelte components have three sections:
   * - <script>: Component logic (like React component body)
   * - <main>: Template/markup (like React JSX)
   * - <style>: Scoped CSS (automatically scoped to this component)
   */

  let message = 'TaskFlow - Svelte 5 Setup Complete! 🎉';
</script>

<main>
  <h1>{message}</h1>
  <p>Ready to start building!</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: var(--font-family, sans-serif);
  }

  h1 {
    color: var(--color-primary, #0073ea);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    font-size: 1.2rem;
  }
</style>
