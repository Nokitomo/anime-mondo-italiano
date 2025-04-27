import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  // ESLint recommended config for JavaScript
  js.configs.recommended,

  // Configurazione aggiuntiva per TypeScript e React
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2020,
        sourceType: "module"
      },
      globals: globals.browser
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      // Regole consigliate TypeScript
      ...tsPlugin.configs.recommended.rules,
      // Regole consigliate React Hooks
      ...reactHooks.configs.recommended.rules,
      // Regole consigliate React Refresh
      ...reactRefresh.configs.recommended.rules,
      // Permetti export di costanti insieme ai componenti
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      // Disattiva regole non rilevanti per il progetto
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  }
];
