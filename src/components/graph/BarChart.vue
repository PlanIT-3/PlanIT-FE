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
    default: false, // 기본값은 범례 표시
  },
});

const options = computed(() => ({
  tooltip: {
    trigger: "axis",
    triggerOn: "click",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {
    show: props.showLegend,
    top: 10,
    left: "center",
    textStyle: {
      fontSize: 8,
    },
    selectedMode: true,
  },
  grid: {
    left: "",
    right: "2%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    show: false,
  },
  yAxis: {
    type: "category",
    data: [""],
    show: false,
  },
  series: props.data.map((item, index) => {
    const isFirst = index === 0;
    const isLast = index === props.data.length - 1;
    return {
      name: item.name,
      type: "bar",
      stack: "total",
      data: [item.value],
      itemStyle: {
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
