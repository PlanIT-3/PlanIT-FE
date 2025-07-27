<template>
  <div class="w-full min-h-screen h-full flex flex-col">
    <MainHeader class="flex-shrink-0 relative z-10" />
    <div
      id="content"
      class="w-full bg-white rounded-t-3xl shadow-lg px-6 pt-12 pb-8 z-* -mt-[84px] overflow-y-auto"
      :style="{ maxHeight: 'calc(852px - 148px)', minHeight: 'calc(852px - 148px)' }"
    >
      <slot />
    </div>
    <NavBar class="sticky bottom-0 bg-white z-10" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import MainHeader from "@/components/common/MainHeader.vue";
import NavBar from "@/components/common/NavBar.vue";

const route = useRoute();
</script>

<style scoped>
/* 컨텐츠 영역 스크롤바 스타일링 (선택사항) */
#content::-webkit-scrollbar {
  width: 4px;
}

#content::-webkit-scrollbar-track {
  background: transparent;
}

#content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

#content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
