module.exports = {
  "extends": "airbnb",
  "globals": {
  },
  "plugins": [
    "import",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    }
  },
  "rules": {
    "semi": ["error", "never"],
    "no-console": "off",
    "max-len": ["error", 120],
    "no-param-reassign": ["error", {"props": false}],
    "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
    "no-constant-condition": ["error", { "checkLoops": false }],
    "func-names": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "eol-last": "off",
    "arrow-parens": "off",
  }
};