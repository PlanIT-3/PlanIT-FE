<template>
  <!-- style로 반드시 높이 지정 필요 -->
  <VChart :option="chartOption" autoresize style="width: 100%; height: 300px" />
</template>

<script setup>
import { ref, watch } from "vue";
import VChart from "vue-echarts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// props로 진행 데이터 배열 받음
const props = defineProps({
  progressData: {
    type: Array,
    default: () => [],
  },
});

const chartOption = ref({});

watch(
  () => props.progressData,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      chartOption.value = {};
      return;
    }

    const rawData = newVal;

    const dates = rawData
      .map((item) => {
        if (!item.progressDate) return null;
        const [y, m, d] = item.progressDate;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      })
      .filter(Boolean);

    const depositData = rawData.filter((item) => item.progressDate).map((item) => item.depositProgress);

    const isaData = rawData.filter((item) => item.progressDate).map((item) => item.isaProgress);

    chartOption.value = {
      title: {
        text: "투자 진행 현황",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["depositProgress", "isaProgress"],
        top: 30,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: dates,
        axisLabel: {
          formatter: (value) => value.replace("2025-", ""),
        },
      },
      yAxis: {
        type: "value",
        name: "진행률",
      },
      series: [
        {
          name: "depositProgress",
          type: "line",
          data: depositData,
          smooth: true,
          lineStyle: { color: "#5B9BD5", width: 3 },
          itemStyle: { color: "#5B9BD5" },
        },
        {
          name: "isaProgress",
          type: "line",
          data: isaData,
          smooth: true,
          lineStyle: { color: "#ED7D31", width: 3 },
          itemStyle: { color: "#ED7D31" },
        },
      ],
    };
  },
  { immediate: true }
);
</script>
