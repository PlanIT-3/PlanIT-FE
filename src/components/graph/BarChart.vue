<script setup>
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const options = {
  tooltip: {
    trigger: "axis",
    triggerOn: "click",
    axisPointer: {
      type: "shadow",
    },
  },

  legend: {
    top: 10, // 범례를 위쪽에 배치
    textStyle: {
      fontSize: 8,
    },
    selectedMode: true, //옵션 그래프에서 숨기기
  },
  grid: {
    // 여백
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    show: false, // 가로축 안보이게
  },
  yAxis: {
    type: "category",
    data: ["오늘"], // 하나의 줄 (막대)
    show: false, // 세로축 안보이게
  },
  series: [
    {
      name: "식비",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series",
      },
      data: [40],
      itemStyle: {
        borderRadius: [6, 0, 0, 6],
      },
    },
    {
      name: "교통비",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series",
      },
      data: [30],
    },
    {
      name: "여가",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series",
      },
      data: [20],
    },
    {
      name: "기타",
      type: "bar",
      stack: "total",
      emphasis: {
        focus: "series",
      },
      data: [10],
      itemStyle: {
        borderRadius: [0, 6, 6, 0],
      },
    },
  ],
};
</script>

<template>
  <div class="w-full h-[60px]">
    <VChart :option="options" autoresize />
  </div>
</template>
