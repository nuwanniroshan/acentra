import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ]
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
