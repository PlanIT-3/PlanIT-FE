<template>
  <DefaultLayout>
    <CardContainer class="pt-2 pb-0 px-0 rounded-t-3xl shadow-lg">
      <div class="flex flex-col items-center">
        <RecommendBanner />
      </div>
      <div class="flex flex-col gap-4 w-[366px] mx-auto py-4 overflow-y-auto pb-32">
        <CardListView />
      </div>
    </CardContainer>
  </DefaultLayout>
</template>

<script setup>
import RecommendBanner from "@/components/recommendation/RecommendBanner.vue";
import CardContainer from "@/components/common/CardContainer.vue";
import CardListView from "./CardListView.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
</script>
