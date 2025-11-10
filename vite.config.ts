import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vite configuration for TaskFlow application.
 * 
 * Key configurations:
 * - Svelte 5 plugin with TypeScript support
 * - Path aliases for clean imports (@/ points to src/)
 * - CSS Modules support (enabled by default in Vite)
 */
export default defineConfig({
  plugins: [svelte()],
  
  resolve: {
    alias: {
      // Allows imports like: import { authStore } from '@/features/auth/stores/authStore'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  css: {
    modules: {
      // CSS Modules configuration
      // Files ending in .module.css will be treated as CSS Modules
      localsConvention: 'camelCase'
    }
  }
});
