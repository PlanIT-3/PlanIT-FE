<script setup>
import { defineProps } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';

use([CanvasRenderer, PieChart]);

const props = defineProps({
  percent: { type: Number, required: true },
  color: { type: String, default: '#3b82f6' },
  size: { type: [String, Number], default: 64 },
  centerText: { type: String, default: '' },
});

const option = {
  tooltip: { show: false },
  series: [
    {
      type: 'pie',
      radius: ['70%', '100%'],
      avoidLabelOverlap: false,
      silent: true,
      label: { show: false },
      data: [
        {
          value: props.percent,
          itemStyle: { color: props.color },
        },
        {
          value: 100 - props.percent,
          itemStyle: { color: '#e5e7eb' },
        },
      ],
    },
  ],
};
</script>

<template>
  <div :style="{ width: size + 'px', height: size + 'px', position: 'relative' }">
    <VChart :option="option" autoresize :style="{ width: size + 'px', height: size + 'px', position: 'absolute', top: 0, left: 0 }" />
    <span class="absolute inset-0 flex items-center justify-center text-base font-bold text-gray-700 z-10">
      {{ centerText || percent + '%' }}
    </span>
  </div>
</template> 