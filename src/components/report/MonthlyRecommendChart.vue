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
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent]);

const props = defineProps({
  monthlyData: {
    type: Object,
    default: () => ({})
  },
  recommendData: {
    type: Object,
    default: () => ({})
  }
});

const chartOptions = computed(() => {
  const monthlyAmounts = props.monthlyData?.monthlyTotalAmount || [];
  const recommendedAmounts = props.recommendData?.recommendedInvestmentAmount || [];
  const dates = props.monthlyData?.date || [];
  
  // 날짜 라벨을 월 형식으로 변환
  const monthLabels = dates.map(date => {
    if (date) {
      const d = new Date(date);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return '';
  });

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach(param => {
          const value = param.value ? param.value.toLocaleString() : '0';
          result += `${param.marker}${param.seriesName}: ₩${value}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['월별 투자금액', '권장 투자금액'],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%'
    },
    xAxis: {
      type: 'category',
      data: monthLabels,
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: 10,
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      name: '금액 (₩)',
      position: 'left',
      axisLabel: {
        formatter: function(value) {
          if (value >= 100000) {
            return (value / 10000).toFixed(0) + '만';
          }
          return value.toLocaleString();
        },
        fontSize: 10,
        color: '#666'
      },
      nameTextStyle: {
        fontSize: 10,
        color: '#666'
      }
    },
    series: [
      {
        name: '월별 투자금액',
        type: 'bar',
        data: monthlyAmounts,
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
      },
      {
        name: '권장 투자금액',
        type: 'line',
        data: recommendedAmounts.slice(0, monthLabels.length),
        lineStyle: {
          color: '#f59e0b',
          width: 3
        },
        itemStyle: {
          color: '#f59e0b'
        },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true
      }
    ]
  };
});
</script>