import pluginJs from "@eslint/js";
import { Linter } from "eslint";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {Linter.Config[]} */
export default [
  { files: ["**/*.?(c|m)ts"] },
  { ignores: ["**/*.?(c|m)js", "**/*.d.?(c|m)ts"] },
  { languageOptions: { globals: globals.node } },
  { languageOptions: { sourceType: "script" } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
      }],
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
      semi: ["warn", "always"],
    },
  },
];
