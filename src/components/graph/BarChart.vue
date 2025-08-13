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

const colors = ["#4a90e2", "#7ed6df", "#f6b93b"];

// 🔹 데이터 변환 (마지막 값 = 100 - 합계)
const transformedData = computed(() => {
  const converted = props.data.map((item) => ({
    name: item.something, // something → name
    value: Number(item.value.toFixed(2)), // 소수점 2자리 고정
  }));

  const sum = converted.reduce((acc, cur) => acc + cur.value, 0);
  const lastValue = Number((100 - sum).toFixed(2));

  converted.push({
    name: "남은 비율", // 필요 시 다른 이름으로 변경 가능
    value: lastValue < 0 ? 0 : lastValue, // 합이 100 초과일 경우 0 처리
  });

  return converted;
});

const options = computed(() => ({
  tooltip: {
    trigger: "axis",
    triggerOn: "click",
    axisPointer: { type: "shadow" },
  },
  legend: {
    show: props.showLegend,
    top: 10,
    left: "center",
    textStyle: { fontSize: 8 },
    selectedMode: true,
  },
  grid: {
    left: "",
    right: "2%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: { type: "value", show: false },
  yAxis: { type: "category", data: [""], show: false },
  series: transformedData.value.map((item, index) => {
    const isFirst = index === 0;
    const isLast = index === transformedData.value.length - 1;
    return {
      name: item.name,
      type: "bar",
      stack: "total",
      data: [item.value],
      itemStyle: {
        color: colors[index % colors.length],
        borderRadius: isFirst ? [6, 0, 0, 6] : isLast ? [0, 6, 6, 0] : 0,
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
