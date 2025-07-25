<template>
  <CardContainer class="pt-2 pb-0 px-0 rounded-t-3xl shadow-lg">
    <!-- RecommendBanner 영역 -->
    <div class="flex flex-col items-center">
      <RecommendBanner />
    </div>
    <!-- Card 리스트 영역에만 스크롤 적용 -->
    <div class="flex flex-col gap-4 w-[366px] mx-auto py-4 overflow-y-auto pb-32">
      <CardListView />
    </div>
  </CardContainer>
</template>

<script setup>
import RecommendBanner from "@/components/recommendation/RecommendBanner.vue";
import CardContainer from "@/components/common/CardContainer.vue";
import CardListView from "./CardListView.vue";
</script>
