// .eslintrc.js
export default {
  env: {
    browser: true, // Permite o uso de variáveis de ambiente do navegador
    node: true,    // Permite o uso de variáveis de ambiente do Node.js (como process.env)
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021, // Habilita o uso de funcionalidades do ECMAScript 2021
    sourceType: 'module', // Permite o uso de módulos ES6
  },
  settings: {
    react: {
      version: 'detect', // Detecta automaticamente a versão do React
    },
  },
  rules: {
    'no-undef': 'off',  // Desativa a regra 'no-undef', que pode causar o erro com 'process'
  },
};
