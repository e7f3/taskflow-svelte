# Stylelint v16 Rule Migration Guide

## Rules in @stylistic/stylelint-plugin

These rules were moved from core Stylelint to the stylistic plugin:

### Indentation & Spacing
- `@stylistic/indentation`
- `@stylistic/max-empty-lines`
- `@stylistic/no-eol-whitespace`
- `@stylistic/no-missing-end-of-source-newline`

### Quotes & Strings
- `@stylistic/string-quotes`

### Colors
- `@stylistic/color-hex-case`

### Numbers
- `@stylistic/number-leading-zero`

### Properties & Values
- `@stylistic/property-case`
- `@stylistic/unit-case`

### Declarations
- `@stylistic/declaration-block-trailing-semicolon`
- `@stylistic/declaration-colon-space-after`
- `@stylistic/declaration-colon-space-before`
- `@stylistic/declaration-block-semicolon-newline-after`

### Blocks
- `@stylistic/block-opening-brace-space-before`
- `@stylistic/block-closing-brace-newline-after`

### Selectors
- `@stylistic/selector-pseudo-class-case`
- `@stylistic/selector-pseudo-element-case`

### At-Rules
- `@stylistic/at-rule-name-case`

## Rules Still in Core Stylelint

These rules remain in core Stylelint (no prefix needed):

### Selectors
- `selector-type-case`
- `selector-class-pattern`
- `selector-id-pattern`
- `selector-max-id`
- `selector-max-universal`
- `selector-no-qualifying-type`
- `selector-not-notation`

### Functions
- `function-name-case`
- `function-url-quotes`

### Colors
- `color-hex-length`
- `color-named`
- `color-function-notation`

### Values
- `value-keyword-case`
- `length-zero-no-unit`
- `alpha-value-notation`

### Media
- `media-feature-range-notation`
- `hue-degree-notation`

### Imports
- `import-notation`

### Font
- `font-family-name-quotes`

### Keyframes
- `keyframes-name-pattern`

### Code Quality (always in core)
- `no-descending-specificity`
- `no-duplicate-selectors`
- `declaration-block-no-redundant-longhand-properties`
- `shorthand-property-no-redundant-values`
- `declaration-block-no-shorthand-property-overrides`

## Quick Reference

**If the rule is about formatting/style** → Try `@stylistic/` prefix first  
**If the rule is about code quality** → No prefix (core Stylelint)  
**If unsure** → Check the error message or [Stylelint docs](https://stylelint.io/user-guide/rules)

## Migration Checklist

- [x] Install `@stylistic/stylelint-plugin`
- [x] Add plugin to config: `"plugins": ["@stylistic/stylelint-plugin"]`
- [x] Prefix stylistic rules with `@stylistic/`
- [x] Keep code quality rules without prefix
- [x] Test configuration: `npx stylelint "**/*.css"`
