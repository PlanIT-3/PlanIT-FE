<template>
  <div class="w-full h-full">
    <VChart :option="chartOptions" autoresize />
  </div>
</template>

<script setup>
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  period: {
    type: String,
    default: "daily",
  },
});

const chartOptions = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {};
  }

  // 데이터를 날짜 순으로 정렬 (오래된 순서대로)
  const sortedData = [...props.data].sort((a, b) => {
    const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2]);
    const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2]);
    return dateA - dateB;
  });

  // 날짜 라벨과 수익률 데이터 추출
  const dates = sortedData.map((item) => {
    const date = new Date(item.date[0], item.date[1] - 1, item.date[2]);
    switch (props.period) {
      case "daily":
        return `${item.date[1]}/${item.date[2]}`;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      case "monthly":
        return `${item.date[0]}.${String(item.date[1]).padStart(2, "0")}`;
      default:
        return `${item.date[1]}/${item.date[2]}`;
    }
  });

  const rates = sortedData.map((item) => item.rate);

  return {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        const value = typeof params[0].value === "object" ? params[0].value.value : params[0].value;
        const sign = value >= 0 ? "+" : "";
        return `${params[0].axisValue}<br/>${params[0].marker}수익률: ${sign}${value.toFixed(2)}%`;
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "10%",
    },
    xAxis: {
      type: "category",
      data: dates,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        fontSize: 10,
        color: "#666",
      },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        formatter: function (value) {
          return value.toFixed(1) + "%";
        },
        fontSize: 10,
        color: "#666",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: rates.map((rate) => ({
          value: rate,
          itemStyle: {
            color: rate >= 0 ? "#3b82f6" : "#ef4444",
            borderRadius: rate >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4],
          },
        })),
        barWidth: "60%",
      },
    ],
  };
});
</script>
