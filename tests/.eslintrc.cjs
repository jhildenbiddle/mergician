module.exports = {
  env: {
    'jest/globals': true
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style'],
  plugins: ['jest'],
  rules: {
    'jest/no-focused-tests': ['warn']
  }
};
