// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Deriva __dirname in ambiente ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carica la configurazione legacy CommonJS
const require = createRequire(import.meta.url);
const legacyConfig = require('./.eslintrc.cjs');

// Crea un'istanza di FlatCompat per migrare la config legacy
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: true,
});

// Esporta il flat config risultante esteso dal legacy
export default [
  ...compat.extendFlatConfig(legacyConfig),
];
