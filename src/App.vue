<!-- 루트 애플리케이션 컴포넌트 -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] h-[852px] bg-white shadow-md overflow-hidden relative">
      <!-- TODO: 앱 레이아웃 구현 -->
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup>
// TODO: 앱 로직 구현
import Button from "./components/base/Button.vue";
</script>

<style>
/* TODO: 전역 스타일 구현 */
</style>
