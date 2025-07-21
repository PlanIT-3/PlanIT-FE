import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import js from "@eslint/js";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

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

  // 네이버 코딩 컨벤션 스타일 규칙들을 수동으로 적용
  {
    rules: {
      // 세미콜론 강제
      semi: ["error", "always"],

      // 쌍따옴표 강제
      quotes: ["error", "double"],

      // 카멜케이스 강제
      camelcase: ["error", { properties: "always" }],

      // 연산자 주변 공백
      "space-infix-ops": "error",

      // 콤마 뒤 공백
      "comma-spacing": ["error", { before: false, after: true }],

      // 생성자 함수명 대문자
      "new-cap": ["error", { newIsCap: true, capIsNew: false }],

      // 한 줄에 하나의 문장
      "max-statements-per-line": ["error", { max: 1 }],

      // 주석 공백
      "spaced-comment": ["error", "always"],

      // 중괄호 내부 공백
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],

      // 들여쓰기 (2칸)
      indent: ["error", 2],

      // 함수 괄호 앞 공백
      "space-before-function-paren": ["error", "never"],

      // 키워드 앞뒤 공백
      "keyword-spacing": ["error", { before: true, after: true }],

      // 블록 앞 공백
      "space-before-blocks": "error",

      // 중괄호 스타일
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    },
  },

  skipFormatting,
];
