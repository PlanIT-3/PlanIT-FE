<!-- 목표 뷰 페이지 -->
<template>
  <DefaultLayout>
    <div class="flex flex-col items-start w-full px-0 gap-2">
      <h1 class="text-l font-semibold m-0">목표 리스트</h1>
    </div>
    <GoalCard title="자가용 구매하기" statusText="목표 달성!" badge-text="목표달성" :showLegend="false"></GoalCard>
  </DefaultLayout>
</template>

<script setup>
import GoalCard from "@/components/goal/GoalCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
</script>

<style scoped>
.goal-view {
  /* 목표 뷰 스타일 */
}
</style>
<!-- <GoalCard title="자가용 구매하기" statusText="목표 달성!" badge-text="목표달성" :showLegend="false"></GoalCard> -->
