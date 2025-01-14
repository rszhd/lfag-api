import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js globals
        console: true,
        process: true,
        module: true,
        require: true,
        __dirname: true,
        __filename: true,
        exports: true,
        Buffer: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        global: true
      }
    },
    rules: {
      indent: [2, 2],
      'linebreak-style': [2, 'unix'],
      quotes: [1, 'single'],
      semi: [1, 'always'],
      'no-inner-declarations': 'off'
    }
  }
];