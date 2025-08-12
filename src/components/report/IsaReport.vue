<template>
  <div class="w-full max-w-xl flex flex-col gap-4">
    <GraphBoxNonPeriod title="ISA 비과세 한도 사용 현황"> 그래프 내용 </GraphBoxNonPeriod>
  </div>
</template>

<script setup>
import api from "@/api";
import GraphBox from "./GraphBox.vue";
import GraphBoxNonPeriod from "./GraphBoxNonPeriod.vue";
</script>

<style scoped></style>
