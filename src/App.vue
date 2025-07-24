<!-- 루트 애플리케이션 컴포넌트 -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
<<<<<<< HEAD
    <div id="app" class="w-[393px] min-h-[852px] bg-white shadow-md overflow-hidden relative">
      <RouterView></RouterView>
=======
    <div id="app" class="w-[393px] min-h-[852px] bg-white shadow-md overflow-hidden relative flex flex-col">
      <!-- TODO: 앱 레이아웃 구현 -->
      <component :is="layoutHeader" />
      <div class="flex-1">
        <RouterView></RouterView>
      </div>
      <!-- 헤더 없으면 nav도 없게 -->
      <div v-if="!route.meta?.layout || route.meta.layout !== 'noHeader'">
        <NavBar></NavBar>
      </div>
>>>>>>> e35e3af (fix: #45 CardContainer 컴포넌트 기반으로 코드 수정)
    </div>
  </div>
</template>

<script setup>
// TODO: 앱 로직 구현
import { RouterView } from "vue-router";
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainHeader from "./components/common/MainHeader.vue";
import NavBar from "./components/common/NavBar.vue";
import OnboardingHeader from "@/components/common/OnboardingHeader.vue";

const route = useRoute();

const layoutHeader = computed(() => {
  const layout = route.meta.layout;
  if (layout === "onboardHeader") return OnboardingHeader;
  if (layout === "noHeader") return null;
  return MainHeader;
});
</script>

<style>
/* TODO: 전역 스타일 구현 */
</style>
