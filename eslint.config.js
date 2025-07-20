import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  
  {
    rules: {
      // 세미콜론 강제
      'semi': ['error', 'always'],
      
      // 쌍따옴표 강제
      'quotes': ['error', 'double'],
      
      // 카멜케이스 강제
      'camelcase': ['error', { properties: 'always' }],
      
      // 연산자 주변 공백
      'space-infix-ops': 'error',
      
      // 콤마 뒤 공백
      'comma-spacing': ['error', { before: false, after: true }],
      
      // 생성자 함수명 대문자
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      
      // 한 줄에 하나의 문장
      'max-statements-per-line': ['error', { max: 1 }],
      
      // 주석 들여쓰기 (기본적으로 처리됨)
      'spaced-comment': ['error', 'always'],
      
      // 중괄호 내부 공백
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
    },
  },
  
  skipFormatting,
])
