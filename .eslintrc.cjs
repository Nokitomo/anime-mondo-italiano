// .eslintrc.cjs — configurazione legacy ESLint
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    es2021: true
  },
  settings: {
    react: { version: 'detect' }
  },
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/'],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'prefer-const': 'off',
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // React Refresh rule (solo regola, no extends)
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    // Disattiva regole non rilevanti
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-require-imports': 'off'
  }
};
