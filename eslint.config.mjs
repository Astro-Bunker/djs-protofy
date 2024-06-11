import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.ts"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ["**/*.js", "**/*.d.ts"] },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-semi": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/semi": "warn",
      "comma-dangle": ["warn", "always-multiline"],
      curly: "off",
      "eol-last": "warn",
      eqeqeq: "warn",
      "no-await-in-loop": "warn",
      "no-empty": "off",
      "no-eval": "warn",
      "no-throw-literal": "warn",
      "prefer-const": "warn",
      quotes: ["warn", "double"],
    },
  },
  /* {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extra-semi": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/semi": "warn",
      "comma-dangle": ["warn", "always-multiline"],
      curly: "off",
      "eol-last": "warn",
      eqeqeq: "warn",
      "no-await-in-loop": "warn",
      "no-empty": "off",
      "no-eval": "warn",
      "no-throw-literal": "warn",
      "prefer-const": "warn",
      quotes: ["warn", "double"],
    },
  }, */
];
