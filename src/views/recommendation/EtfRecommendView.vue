<template>
  <div>
    <div class="flex flex-col items-center">
      <RecommendBanner />
    </div>
    <div
      class="flex flex-col gap-4 w-[366px] mx-auto py-4 overflow-y-auto pb-16 custom-scroll"
      style="max-height: 500px"
    >
      <CardListView />
    </div>
  </div>
</template>
<script setup>
import RecommendBanner from "@/components/recommendation/RecommendBanner.vue";
import CardListView from "./CardListView.vue";
</script>
<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 0;
}
</style>
