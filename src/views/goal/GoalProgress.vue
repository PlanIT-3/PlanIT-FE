<template>
  <div class="chart-container -mt-2">
    <VChart :option="chartOption" autoresize class="progress-chart" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import VChart from "vue-echarts";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { use } from "echarts/core";

use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// props로 진행 데이터 받음 (API 응답 구조 전체)
const props = defineProps({
  progressData: {
    type: Object,
    default: () => ({}),
  },
});

const chartOption = ref({});

watch(
  () => props.progressData,
  (newVal) => {
    if (!newVal) {
      chartOption.value = {};
      return;
    }

    // 배열 데이터 가져오기
    const rawData = Array.isArray(newVal) ? newVal : newVal.data || [];
    if (rawData.length === 0) {
      chartOption.value = {};
      return;
    }

    // 최근 6개월만 필터링
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 이번달 포함 최근 6개월
    const filteredData = rawData.filter((item) => {
      if (!item.createdAt) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate >= sixMonthsAgo && itemDate <= today;
    });

    // 월별 평균 계산
    const monthMap = {};
    filteredData.forEach((item) => {
      const date = new Date(item.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { depositSum: 0, isaSum: 0, count: 0 };
      }
      monthMap[monthKey].depositSum += item.depositProgress || 0;
      monthMap[monthKey].isaSum += item.isaProgress || 0;
      monthMap[monthKey].count += 1;
    });

    // x축 월, y축 평균 데이터
    const months = Object.keys(monthMap).sort();
    const depositData = months.map((m) => +(monthMap[m].depositSum / monthMap[m].count).toFixed(2));
    const isaData = months.map((m) => +(monthMap[m].isaSum / monthMap[m].count).toFixed(2));

    // x축 표시용 "MM월" 포맷
    const monthLabels = months.map((m) => {
      const parts = m.split("-");
      return `${parseInt(parts[1], 10)}월`;
    });

    chartOption.value = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textStyle: { color: "#374151" },
        formatter: function (params) {
          let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`;
          params.forEach((param) => {
            result += `<div style="margin: 4px 0;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${param.color};margin-right:8px;"></span>
              ${param.seriesName}: <strong>${param.value}%</strong>
            </div>`;
          });
          return result;
        },
      },
      legend: {
        data: ["적금 진행률", "ISA 진행률"],
        bottom: -5,
        textStyle: { fontSize: 13, color: "#6b7280" },
      },
      grid: { left: "5%", right: "5%", bottom: "15%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: monthLabels,
        axisLabel: { color: "#6b7280", fontSize: 12 },
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        axisTick: { lineStyle: { color: "#e5e7eb" } },
      },
      yAxis: {
        type: "value",
        name: "진행률 (%)",
        nameTextStyle: { color: "#6b7280", fontSize: 12 },
        axisLabel: { formatter: (value) => `${value * 100}%`, color: "#6b7280", fontSize: 12 },
        axisLine: { lineStyle: { color: "#e5e7eb" } },
        splitLine: { lineStyle: { color: "#f3f4f6", type: "dashed" } },
      },
      series: [
        {
          name: "적금 진행률",
          type: "line",
          data: depositData,
          smooth: true,
          lineStyle: { width: 3, color: "#3b82f6" },
          itemStyle: { color: "#3b82f6", borderWidth: 2, borderColor: "#ffffff" },
          symbol: "circle",
          symbolSize: 6,
        },
        {
          name: "ISA 진행률",
          type: "line",
          data: isaData,
          smooth: true,
          lineStyle: { width: 3, color: "#ef4444" },
          itemStyle: { color: "#ef4444", borderWidth: 2, borderColor: "#ffffff" },
          symbol: "circle",
          symbolSize: 6,
        },
      ],
    };
  },
  { immediate: true }
);
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 280px;
  padding: 0px;
  position: relative;
  overflow: hidden;
}

.progress-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    padding: 16px;
    border-radius: 12px;
  }
}
</style>
