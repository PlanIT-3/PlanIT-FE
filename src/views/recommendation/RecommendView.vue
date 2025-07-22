<template>
  <div class="relative w-[393px] min-h-screen mx-auto bg-[#f5f5f5] pb-24 overflow-hidden">
    <!-- Header (우주 배경) -->
    <div
      class="absolute top-0 left-0 w-full h-[220px] z-0"
      :style="{ background: `url(${bgImg}) center/cover no-repeat` }"
    ></div>
    <!-- 메인 컨텐츠(흰색 카드 영역) -->
    <div class="relative z-10 w-full" style="margin-top: 140px">
      <div class="bg-white rounded-t-3xl shadow-lg pt-2 pb-0 px-0" style="min-height: calc(100vh - 140px)">
        <!-- RecommendBanner 영역 -->
        <div class="flex flex-col items-center">
          <RecommendBanner />
        </div>
        <!-- Card 리스트 영역 -->
        <div class="flex flex-col gap-4 w-[366px] mx-auto py-4">
          <CardListView />
        </div>
      </div>
      <!-- NavBar 영역 -->
      <NavBar />
    </div>
  </div>
</template>

<script setup>
import CardListView from "./CardListView.vue";
import bgImg from "@/assets/images/background.png";
import RecommendBanner from "@/components/recommendation/RecommendBanner.vue";
import NavBar from "@/components/common/NavBar.vue";
</script>
