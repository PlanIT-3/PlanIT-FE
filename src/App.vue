<!-- 루트 애플리케이션 컴포넌트 -->
<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div id="app" class="w-[393px] h-[852px] bg-white shadow-md overflow-y-auto overflow-x-visible relative flex flex-col">
      <div class="flex-shrink-0">
        <component :is="layoutHeader" />
      </div>
      <div class="flex-1 min-h-0">
        <RouterView></RouterView>
      </div>
      <div class="flex-shrink-0">
        <NavBar></NavBar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
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

onMounted(() => {
  //뷰포트
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport) {
    metaViewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
  }
});
</script>

<style>
/* TODO: 전역 스타일 구현 */
</style>