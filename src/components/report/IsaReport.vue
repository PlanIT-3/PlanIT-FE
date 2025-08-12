<template>
  <div class="w-full max-w-xl flex flex-col gap-4">
    <IsaTaxSavingStatus />

    <GraphBoxNonPeriod title="ISA vs 일반 계좌 세금 비교"> 그래프 내용 </GraphBoxNonPeriod>

    <GraphBoxNonPeriod title="누적 절세 효과"> 그래프 내용 </GraphBoxNonPeriod>
  </div>
</template>

<script setup>
import api from "@/api";
import GraphBox from "./GraphBox.vue";
import GraphBoxNonPeriod from "./GraphBoxNonPeriod.vue";
import IsaTaxSavingStatus from "./IsaTaxSavingStatus.vue";
</script>

<style scoped></style>
