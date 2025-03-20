import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Apply to JavaScript, TypeScript, and CommonJS files
    languageOptions: {
      globals: globals.node, // Set Node.js globals for server-side code
    },
    rules: {
      // Allow `import/export` syntax, don't restrict ES Modules
      "import/no-commonjs": "off", // Don't restrict CommonJS, since we're using ES Modules
      "no-restricted-syntax": [
        "off", // Disable the restriction on import/export usage
      ],
      "no-console": "off", // Allow console statements in backend code
      "no-unused-vars": "warn", // Show warnings for unused variables
    },
  },

  {
    languageOptions: {
      globals: globals.browser, // Keep browser globals for frontend code (if needed)
    },
  },

  // Apply recommended rules from ESLint JS and TypeScript plugins
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
