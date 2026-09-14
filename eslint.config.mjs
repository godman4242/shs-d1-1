// ESLint flat config — adopted per STAGE1_KICKOFF §3 (RESUME_HERE decision #4,
// default = do it). Strictest type-checked presets: quality bar over speed.
// tests/fixtures/scan-probe/ is excluded from tsconfig.node.json on purpose
// (scanner regression fixtures), so projectService cannot type it — ignore it.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    // *.workflow.js are GAUNTLET fan-out scripts. The harness evaluates them
    // inside its own async wrapper, so their top-level `await`/`return` is
    // legal there and unparseable here. They are orchestration, never shipped.
    ignores: ['dist/**', 'tests/fixtures/**', '**/*.workflow.js', '.claude/workflows/**'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        // Explicit two-project array (not projectService): the service only
        // auto-discovers tsconfig.json, so tests/ + vite.config.ts — which
        // live in tsconfig.node.json — would go unlinted.
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Numbers stringify deterministically; the hazard this rule guards
      // against is objects/arrays in templates. Keep those banned.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Array<T> stays legal for non-simple element types (tuples, unions).
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    },
  },
);
