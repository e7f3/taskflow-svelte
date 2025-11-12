/**
 * Main entry point for the TaskFlow application.
 *
 * This file:
 * 1. Imports global styles
 * 2. Creates the root Svelte component
 * 3. Mounts it to the DOM
 *
 * Learning Note - Svelte 5 Mounting:
 * Svelte 5 changed the mounting API from Svelte 4.
 *
 * Svelte 4 way:
 *   new App({ target: element })
 *
 * Svelte 5 way:
 *   mount(App, { target: element })
 *
 * This new API is more explicit and allows better tree-shaking.
 */

import './styles/theme.css';
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
