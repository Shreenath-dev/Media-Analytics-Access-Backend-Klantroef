import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, 
        ...globals.jest,
      },
    },
  },

  {
    rules: {
      eqeqeq: "off", 
      "no-unused-vars": "warn", 
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false,
        },
      ],
    },
  },

  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
];
