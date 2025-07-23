import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import js from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import naverConfig from "eslint-config-naver";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },

  {
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 기본 JavaScript 권장 설정
  js.configs.recommended,

  // Vue 관련 설정
  ...pluginVue.configs["flat/essential"],

  // 네이버 ESLint 설정 적용
  naverConfig,

  skipFormatting,
];
