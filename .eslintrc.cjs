module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'prettier'],
  ignorePatterns: ['dist'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: [],
  rules: {
    'array-bracket-spacing': ['error'],
    'array-callback-return': ['error'],
    'block-scoped-var': ['error'],
    'block-spacing': ['error'],
    curly: ['error'],
    'dot-notation': ['error'],
    eqeqeq: ['error'],
    // indent: ['error', 4],
    'no-console': ['warn'],
    'no-floating-decimal': ['error'],
    'no-implicit-coercion': ['error'],
    'no-implicit-globals': ['error'],
    'no-loop-func': ['error'],
    'no-return-assign': ['error'],
    'no-template-curly-in-string': ['error'],
    'no-unneeded-ternary': ['error'],
    'no-unused-vars': ['error', { args: 'none' }],
    'no-useless-computed-key': ['error'],
    'no-useless-return': ['error'],
    'no-var': ['error'],
    'prefer-const': ['error'],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
