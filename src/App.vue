<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] h-[852px] bg-white shadow-md overflow-hidden relative">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
// 자동 리다이렉트 로직 제거 - 라우터 가드에서 처리
</script>

<style>
/* 전역 스타일 */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
