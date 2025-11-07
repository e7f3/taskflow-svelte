import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Svelte compiler configuration.
 * 
 * vitePreprocess: Enables preprocessing of TypeScript, SCSS, PostCSS, etc.
 * This is what allows us to use TypeScript in <script lang="ts"> blocks.
 */
export default {
  preprocess: vitePreprocess()
};
