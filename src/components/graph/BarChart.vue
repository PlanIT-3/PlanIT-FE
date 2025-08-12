<script setup>
import { computed, defineProps } from "vue";

import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const props = defineProps({
  data: { type: Array, required: true },
  labelValues: { type: Array, default: () => [] }, // 내가 표시할 라벨 값 배열
  showLegend: { type: Boolean, default: false },
});

const cappedData = computed(() =>
  props.data.map((item) => ({
    ...item,
    cappedValue: Math.min(item.value, 100),
  }))
);

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
    left: "2%",
    right: "2%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    max: 100,
    show: false,
  },
  yAxis: {
    type: "category",
    data: [""],
    show: false,
  },
  series: cappedData.value.map((item, index) => {
    const isFirst = index === 0;
    const isLast = index === cappedData.value.length - 1;

    return {
      name: item.name,
      type: "bar",
      stack: "total",
      data: [item.cappedValue],
      itemStyle: {
        borderRadius: isFirst ? [6, 0, 0, 6] : isLast ? [0, 6, 6, 0] : 0,
      },
      label: {
        show: true,
        position: "insideRight",
        formatter: () => {
          // labelValues 배열에 값이 있으면 사용, 없으면 기본값 %
          return props.labelValues[index] !== undefined ? props.labelValues[index] : item.cappedValue + "%";
        },
        color: "#fff",
        fontSize: 10,
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
