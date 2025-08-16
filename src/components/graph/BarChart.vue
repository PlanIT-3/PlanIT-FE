<script setup>
import { computed } from "vue";
import { defineProps } from "vue";

import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  showLegend: {
    type: Boolean,
    default: false,
  },
});

// 유채색 팔레트
const colors = ["#4a90e2", "#ff7f50", "#5D00A8", "#00c49f", "#ffbb28"];

// 데이터 변환 (값 0 제외, 마지막 값 = 100 - 합계)
const transformedData = computed(() => {
  const converted = props.data
    .map((item) => ({
      name: item.name,
      value: Math.round(item.value), // 정수 처리
    }))
    .filter((item) => item.value > 0); // 값이 0인 항목 제거

  const sum = converted.reduce((acc, cur) => acc + cur.value, 0);
  const lastValue = 100 - sum;

  if (lastValue > 0) {
    converted.push({
      name: "남은 비율",
      value: lastValue,
    });
  }

  return converted;
});

const options = computed(() => ({
  tooltip: {
    trigger: "axis",
    triggerOn: "click",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      return params.map((p) => `${p.marker} ${p.seriesName}: ${Math.round(p.value)}%`).join("<br/>");
    },
  },
  legend: {
    show: props.showLegend,
    top: 10,
    left: "center",
    textStyle: { fontSize: 8 },
    selectedMode: true,
  },
  grid: {
    left: "2%",
    right: "2%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: { type: "value", show: false },
  yAxis: { type: "category", data: [""], show: false },
  series: transformedData.value.map((item, index) => {
    const isRemaining = item.name === "남은 비율";
    const isFirst = index === 0;
    const isLast = index === transformedData.value.length - 1;

    let radius = 0;
    if (isFirst && isLast) {
      radius = 5; // 데이터가 하나일 경우 전체 둥글게
    } else if (isFirst) {
      radius = [5, 0, 0, 5]; // 왼쪽 둥글게
    } else if (isLast) {
      radius = [0, 5, 5, 0]; // 오른쪽 둥글게
    }

    return {
      name: item.name,
      type: "bar",
      stack: "total",
      data: [item.value],
      itemStyle: {
        color: isRemaining ? "#eeeeee" : colors[index % colors.length],
        borderRadius: radius,
      },
    };
  }),
}));
</script>

<template>
  <div class="w-full h-[100px]">
    <VChart :option="options" autoresize />
  </div>
</template>
