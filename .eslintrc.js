module.exports = {
  env: {
    es6: true,
    node: true
  },
  plugins: ["security"],
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "new-cap": ["error", { properties: false }]
  },
  extends: [
    "plugin:security/recommended",
    "eslint:recommended",
    "google",
    "prettier"
  ]
};
