import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import importPlugin from 'eslint-plugin-import';

export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Svelte recommended rules
  ...eslintPluginSvelte.configs['flat/recommended'],

  // Global ignores
  {
    ignores: [
      'dist/**',
      'build/**',
      '.svelte-kit/**',
      'node_modules/**',
      'storybook-static/**',
      '*.config.js',
      '*.config.ts',
      '.storybook/**',
    ],
  },

  // Configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import ordering and organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External packages
            'internal', // Internal modules (using path aliases)
            ['parent', 'sibling'], // Parent and sibling imports
            'index', // Index imports
            'type', // Type imports
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/no-unresolved': 'off', // TypeScript handles this
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },

  // Configuration for Svelte files
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json',
        extraFileExtensions: ['.svelte'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
    },
    rules: {
      // Svelte specific rules
      'svelte/no-at-html-tags': 'error',
      'svelte/no-target-blank': 'error',
      'svelte/no-unused-svelte-ignore': 'warn',
      'svelte/valid-compile': 'error',
      'svelte/no-reactive-reassign': 'warn',

      // Svelte 5 runes
      'svelte/valid-prop-names-in-kit-pages': 'off',

      // Style preferences
      'svelte/indent': [
        'error',
        {
          indent: 2,
          switchCase: 1,
          alignAttributesVertically: false,
        },
      ],
      'svelte/first-attribute-linebreak': [
        'error',
        {
          multiline: 'below',
          singleline: 'beside',
        },
      ],
      'svelte/max-attributes-per-line': [
        'error',
        {
          multiline: 1,
          singleline: 3,
        },
      ],
      'svelte/html-closing-bracket-spacing': 'error',
      'svelte/html-quotes': ['error', { prefer: 'double' }],
      'svelte/mustache-spacing': 'error',
      'svelte/no-spaces-around-equal-signs-in-attribute': 'error',
      'svelte/shorthand-attribute': 'error',
      'svelte/shorthand-directive': 'error',
      'svelte/spaced-html-comment': 'error',

      // TypeScript rules for Svelte files
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^\\$\\$',
        },
      ],

      // Import ordering (same as TS files)
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
    },
  },

  // General rules for all files
  {
    files: ['**/*.{js,ts,svelte}'],
    rules: {
      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',

      // Formatting (basic - Prettier would handle more)
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': 'error',

      // Best practices
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-implicit-coercion': 'error',
      'no-return-await': 'error',
      'require-await': 'warn',
      'no-unused-expressions': 'error',
    },
  },
];
