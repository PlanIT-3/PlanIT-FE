<!-- 루트 애플리케이션 컴포넌트 -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] h-[852px] bg-white shadow-md overflow-y-auto relative">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
// TODO: 앱 로직 구현
import { RouterView } from "vue-router";
</script>

<style>
/* TODO: 전역 스타일 구현 */
</style>
