<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] h-[852px] bg-white shadow-md overflow-hidden relative">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

if (auth.isLogin) {
  const router = useRouter();
  router.push({ name: "main" });
}
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
