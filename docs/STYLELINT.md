# Stylelint Configuration Guide

## Overview

This project uses Stylelint v16+ to maintain consistent CSS code quality and formatting across all stylesheets and Svelte component styles.

**Important:** Stylelint v16 moved stylistic rules (indentation, quotes, spacing) to a separate plugin `@stylistic/stylelint-plugin`. This is why you'll see rules prefixed with `@stylistic/` in the configuration.

## Features

### 🎨 **Property Ordering (Recess Order)**
Properties are automatically organized into logical groups:

1. **Positioning** - position, top, right, bottom, left, z-index
2. **Box Model** - display, flex, grid, width, height, margin, padding, border
3. **Typography** - font, line-height, text-align, color
4. **Visual** - background, opacity, box-shadow, transform
5. **Animation** - transition, animation
6. **Misc** - cursor, pointer-events, user-select

### 📏 **Formatting Rules**
- 2-space indentation
- Single quotes for strings
- Lowercase for all CSS keywords
- Short hex colors (#fff not #ffffff)
- Lowercase hex colors (#fff not #FFF)
- No named colors (use #f00 not 'red')
- Leading zeros (0.5 not .5)
- No units for zero (0 not 0px)

### ✅ **Code Quality**
- No duplicate selectors
- No descending specificity issues (disabled - too strict)
- No redundant longhand properties
- No shorthand property overrides
- Maximum 0 ID selectors (use classes)
- Maximum 1 universal selector

## Usage

### Check CSS
```bash
pnpm lint:css
```

### Auto-fix CSS
```bash
pnpm lint:css:fix
```

### Format Everything
```bash
pnpm format
```

## VS Code Integration

The project includes `.vscode/settings.json` that:
- Enables Stylelint for CSS and Svelte files
- Auto-fixes on save
- Disables built-in CSS validation (Stylelint handles it)

## Example

### Before Auto-fix:
```css
.card {
  color: red;
  background-color: #FFFFFF;
  padding: 10px;
  display: flex;
  margin: 0px;
  position: relative;
}
```

### After Auto-fix:
```css
.card {
  position: relative;
  display: flex;
  margin: 0;
  padding: 10px;
  color: #f00;
  background-color: #fff;
}
```

## Property Order Example

```css
.example {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;

  /* Box Model */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;

  /* Typography */
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  color: #333;

  /* Visual */
  background-color: #fff;
  opacity: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Animation */
  transition: all 0.2s ease;

  /* Misc */
  cursor: pointer;
}
```

## Svelte Component Styles

Stylelint works with both:
- **CSS Module files** (`.module.css`)
- **Svelte `<style>` blocks** (inside `.svelte` files)

### CSS Modules:
```css
/* TaskCard.module.css */
.card {
  display: flex;
  padding: 1rem;
  background: #fff;
}
```

### Svelte Styles:
```svelte
<style>
  .card {
    display: flex;
    padding: 1rem;
    background: #fff;
  }
</style>
```

Both will be formatted and linted the same way!

## Configuration Files

- `.stylelintrc.json` - Main Stylelint configuration
- `.stylelintignore` - Files and directories to ignore
- `.vscode/settings.json` - VS Code integration

## Disabling Rules

### For a single line:
```css
/* stylelint-disable-next-line color-named */
color: red;
```

### For a block:
```css
/* stylelint-disable color-named */
.example {
  color: red;
  background: blue;
}
/* stylelint-enable color-named */
```

### For entire file:
```css
/* stylelint-disable */
```

## Common Issues

### Issue: "Expected single space before" errors
**Solution:** Run `pnpm lint:css:fix` to auto-format

### Issue: "Unexpected named color"
**Solution:** Replace named colors with hex:
- `red` → `#f00`
- `blue` → `#00f`
- `white` → `#fff`
- `black` → `#000`

### Issue: "Expected properties to be ordered"
**Solution:** Run `pnpm lint:css:fix` - properties will be reordered automatically

### Issue: Stylelint not working in VS Code
1. Install the Stylelint extension
2. Reload VS Code
3. Check Output panel (Stylelint) for errors

## Customization

To modify rules, edit `.stylelintrc.json`:

```json
{
  "rules": {
    "indentation": 4,
    "color-named": "always-where-possible"
  }
}
```

## Resources

- [Stylelint Documentation](https://stylelint.io/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules)
- [Recess Order](https://github.com/stormwarning/stylelint-config-recess-order)
- [Property Order](https://github.com/hudochenkov/stylelint-order)
