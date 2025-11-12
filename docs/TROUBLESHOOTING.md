# Troubleshooting Guide

This guide covers common issues you might encounter with the TaskFlow project setup.

## Table of Contents

- [ESLint Issues](#eslint-issues)
- [Stylelint Issues](#stylelint-issues)
- [VS Code Integration](#vs-code-integration)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)

---

## ESLint Issues

### Issue: "The .eslintignore file is no longer supported"

**Symptom:**
```
ESLintIgnoreWarning: The ".eslintignore" file is no longer supported
```

**Solution:**
ESLint 9+ uses the `ignores` property in `eslint.config.js` instead of `.eslintignore`.

Delete `.eslintignore` and use the config file:
```javascript
export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js']
  }
];
```

---

### Issue: Quote conflicts in Svelte files

**Symptom:**
Quotes flip between single and double on save.

**Cause:**
ESLint and Svelte formatter fighting over quote style.

**Solution:**
- Use ESLint for formatting (not Prettier or Svelte formatter)
- Configure `.vscode/settings.json`:
```json
{
  "[svelte]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

---

### Issue: Import order not auto-fixing

**Symptom:**
`import/order` rule shows errors but doesn't fix on save.

**Solution:**
1. Ensure `eslint-plugin-import` is installed
2. Check VS Code settings:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```
3. Run manually: `pnpm lint:fix`

---

## Stylelint Issues

### Issue: "Unknown rule" errors (indentation, string-quotes, etc.)

**Symptom:**
```
Unknown rule indentation
Unknown rule string-quotes
Unknown rule color-hex-case
```

**Cause:**
Stylelint v16 moved stylistic rules to `@stylistic/stylelint-plugin`.

**Solution:**
1. Install the plugin:
```bash
pnpm add -D @stylistic/stylelint-plugin
```

2. Update `.stylelintrc.json`:
```json
{
  "plugins": ["@stylistic/stylelint-plugin"],
  "rules": {
    "@stylistic/indentation": 2,
    "@stylistic/string-quotes": "single"
  }
}
```

**Rules that moved to @stylistic/:**
- `indentation` → `@stylistic/indentation`
- `string-quotes` → `@stylistic/string-quotes`
- `color-hex-case` → `@stylistic/color-hex-case`
- `property-case` → `@stylistic/property-case`
- `unit-case` → `@stylistic/unit-case`
- And many more...

**Rules that stayed in core:**
- `selector-type-case`
- `function-name-case`
- `color-hex-length`
- `color-named`

---

### Issue: Stylelint errors not showing in VS Code

**Symptom:**
Errors show in terminal (`pnpm lint:css`) but not in editor.

**Solution:**
1. Install Stylelint extension: `stylelint.vscode-stylelint`
2. Update `.vscode/settings.json`:
```json
{
  "stylelint.enable": true,
  "stylelint.validate": ["css", "postcss", "svelte"],
  "css.validate": false
}
```
3. Reload VS Code: `Cmd/Ctrl + Shift + P` → "Reload Window"

---

### Issue: "Unexpected unknown pseudo-class selector :global"

**Symptom:**
```
Unexpected unknown pseudo-class selector ":global"
```

**Cause:**
`:global()` is a CSS Modules/Svelte-specific pseudo-class.

**Solution:**
Add to `.stylelintrc.json`:
```json
{
  "overrides": [
    {
      "files": ["**/*.module.css"],
      "rules": {
        "selector-pseudo-class-no-unknown": [
          true,
          {
            "ignorePseudoClasses": ["global", "local"]
          }
        ]
      }
    }
  ]
}
```

---

### Issue: "Expected #app to have no more than 0 ID selectors"

**Symptom:**
```
Expected "#app" to have no more than 0 ID selectors (selector-max-id)
```

**Cause:**
Using ID selectors in CSS (considered bad practice).

**Solutions:**

**Option 1: Use classes instead (Recommended)**
```html
<!-- HTML -->
<div id="app" class="app"></div>
```
```css
/* CSS - style with class */
.app {
  width: 100%;
}
```

**Option 2: Allow 1 ID selector**
```json
{
  "rules": {
    "selector-max-id": 1
  }
}
```

---

### Issue: Properties not reordering

**Symptom:**
CSS properties stay in wrong order after `stylelint --fix`.

**Cause:**
Property ordering rule is disabled or misconfigured.

**Solution:**
Ensure `stylelint-config-recess-order` is in extends:
```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recess-order"
  ]
}
```

Don't set `order/properties-order` to `null` unless you're providing custom order.

---

## VS Code Integration

### Issue: Extensions not working

**Symptom:**
No linting errors, no auto-fix on save.

**Solution:**
1. Install required extensions:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Stylelint (`stylelint.vscode-stylelint`)
   - Svelte for VS Code (`svelte.svelte-vscode`)

2. Check `.vscode/extensions.json` exists:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "svelte.svelte-vscode"
  ]
}
```

3. Reload VS Code

---

### Issue: Format on save not working

**Symptom:**
Files don't format when you save.

**Solution:**
Check `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.fixAll.stylelint": "explicit"
  }
}
```

---

## Build Issues

### Issue: TypeScript errors in Svelte files

**Symptom:**
```
Cannot find module './Component.svelte'
```

**Solution:**
1. Ensure `svelte-check` is installed
2. Run: `pnpm check`
3. Check `tsconfig.json` includes Svelte files:
```json
{
  "include": ["src/**/*.svelte", "src/**/*.ts"]
}
```

---

### Issue: CSS Module types not found

**Symptom:**
```
Cannot find module './styles.module.css'
```

**Solution:**
Create `src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

---

## Runtime Issues

### Issue: Styles not applying

**Symptom:**
CSS classes don't style elements.

**Possible Causes & Solutions:**

**1. CSS Module not imported:**
```typescript
// ❌ Wrong
import './Component.module.css';

// ✅ Correct
import styles from './Component.module.css';
```

**2. Class name typo:**
```svelte
<!-- ❌ Wrong -->
<div class={styles.myClass}></div>

<!-- ✅ Correct (camelCase) -->
<div class={styles.myClass}></div>
```

**3. CSS not loaded:**
Check browser DevTools → Network tab for 404 errors.

---

### Issue: localStorage not working

**Symptom:**
Data doesn't persist after refresh.

**Solution:**
1. Check browser console for errors
2. Verify `storageService.isAvailable()` returns true
3. Check browser privacy settings (localStorage might be disabled)
4. Clear browser cache and try again

---

## Getting Help

If you're still stuck:

1. **Check the logs:**
   - Browser console (F12)
   - Terminal output
   - VS Code Output panel (View → Output → Select ESLint/Stylelint)

2. **Verify versions:**
```bash
pnpm list eslint stylelint svelte typescript
```

3. **Clean install:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

4. **Check documentation:**
   - [ESLint Docs](https://eslint.org/docs/latest/)
   - [Stylelint Docs](https://stylelint.io/)
   - [Svelte Docs](https://svelte.dev/docs)

---

## Quick Fixes Checklist

- [ ] All VS Code extensions installed
- [ ] VS Code reloaded after config changes
- [ ] `node_modules` up to date (`pnpm install`)
- [ ] Config files have no syntax errors
- [ ] `.vscode/settings.json` properly configured
- [ ] Browser cache cleared
- [ ] TypeScript server restarted (Cmd/Ctrl + Shift + P → "Restart TS Server")
