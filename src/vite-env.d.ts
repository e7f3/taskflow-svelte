/// <reference types="svelte" />
/// <reference types="vite/client" />

/**
 * TypeScript declarations for Vite environment.
 * This file provides type definitions for:
 * - Svelte component imports
 * - Vite-specific features
 * - CSS Module imports
 */

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
