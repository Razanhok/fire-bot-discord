module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "airbnb-base",
  "plugins": [
      "import"
  ],
  "rules": {
    "no-console": "off",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": "off",
    "quotes": ["warn", "double"],
    "arrow-body-style": ["error", "always"],
    "max-len": "off",
  }
};
