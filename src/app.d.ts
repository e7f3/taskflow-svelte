/**
 * TypeScript declarations for Svelte 5 components.
 * 
 * This file helps TypeScript understand Svelte component imports.
 * It's needed because Svelte 5's type system is still evolving.
 */

declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component;
  export default component;
}
