import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        ignores: ["node_modules", "build", "dist", "eslint.config.js", "eslint.config.mjs"],
    },

    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                ...globals.browser,
                ...globals.node,
                React: "readonly",
            },
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: {
                    jsx: true,
                    classes: true,
                    modules: true,
                },
            },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks,
            "jsx-a11y": jsxA11y,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",

            "semi": ["error", "always"],
            "comma-dangle": ["error", "always-multiline"],
            "indent": ["error", 4],
            "quotes": ["error", "double", { "avoidEscape": true }],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "always"],
            "comma-style": ["error", "last"],

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/jsx-indent": ["error", 4],
            "react/jsx-tag-spacing": ["error", {
                "closingSlash": "never",
                "beforeSelfClosing": "always",
                "afterOpening": "never",
                "beforeClosing": "allow",
            }],
            "react/jsx-curly-spacing": ["error", { "when": "always" }],
            "react/no-unescaped-entities": ["error", { "forbid": [">", "\"", "}"] }],

            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.jest,
            },
        },
    },
];
