/**
 * Main entry point for the TaskFlow application.
 * 
 * This file:
 * 1. Imports global styles
 * 2. Creates the root Svelte component
 * 3. Mounts it to the DOM
 * 
 * Learning Note:
 * Unlike React's ReactDOM.render(), Svelte uses a simple constructor.
 * The component is instantiated with a target element and optional props.
 */

import './styles/theme.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
