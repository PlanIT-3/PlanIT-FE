<template>
  <MixedChart
    :data="chartData"
    :period="period"
    bar-name="총 투자금액"
    line-name="평가금액"
    bar-color="#3b82f6"
    line-color="#10b981"
  />
</template>

<script setup>
import { computed } from "vue";
import MixedChart from "./MixedChart.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      date: [],
      dailyTotalAmount: [],
      dailyValuationAmount: [],
      weeklyTotalAmount: [],
      weeklyValuationAmount: [],
      monthlyTotalAmount: [],
      monthlyValuationAmount: [],
    }),
  },
  period: {
    type: String,
    default: "daily",
  },
  chartType: {
    type: String,
    default: "daily",
  },
});

const chartData = computed(() => {
  let barData, lineData;

  switch (props.chartType) {
    case "weekly":
      barData = props.data.weeklyTotalAmount || [];
      lineData = props.data.weeklyValuationAmount || [];
      break;
    case "monthly":
      barData = props.data.monthlyTotalAmount || [];
      lineData = props.data.monthlyValuationAmount || [];
      break;
    default: // 'daily'
      barData = props.data.dailyTotalAmount || [];
      lineData = props.data.dailyValuationAmount || [];
  }

  return {
    date: props.data.date || [],
    barData,
    lineData,
  };
});
</script>
