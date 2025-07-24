<template>
  <CardContainer>
    <!-- 상단 헤더 -->
    <div class="flex items-center mb-6">
      <h2 class="text-lg font-bold">ISA 계좌 할당</h2>
    </div>

    <!-- 목표 금액 입력 -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">ISA 계좌의 목표 금액(정확 비율의 금액)</label>
      <BaseTextInput v-model="isaGoalAmountInput" type="number" :placeholder="`${totalGoalAmount}만원`" class="w-full max-w-lg mb-3" />
      <div class="flex justify-between text-xs text-gray-500 mb-2">
        <span>목표 남은 금액: {{ remainingAmount.toLocaleString() }}만원</span>
        <span>비과세 현황: {{ selectedTotal.toLocaleString() }} / {{ isaGoalAmount.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 상품 선택 -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold">상품 선택</span>
        <input
          type="text"
          v-model="search"
          placeholder="검색"
          class="border rounded px-2 py-1 text-xs w-32"
        />
      </div>
      <div class="max-h-40 overflow-y-auto border rounded p-2 bg-white">
        <template v-for="item in filteredProducts" :key="item.id">
          <label class="flex items-center py-1 cursor-pointer">
            <input
              type="checkbox"
              class="mr-2"
              :value="item.id"
              v-model="selectedProductIds"
              :disabled="isProductDisabled(item)"
            />
            <div class="flex-1">
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-500">{{ item.desc }}</div>
            </div>
            <span class="ml-2">{{ item.amount.toLocaleString() }}만원</span>
          </label>
        </template>
        <div v-if="filteredProducts.length === 0" class="text-xs text-gray-400 text-center py-2">검색 결과가 없습니다.</div>
      </div>
    </div>

    <!-- 총 선택된 금액 -->
    <div class="mb-4 text-right">
      <span class="font-semibold">총 선택된 금액 </span>
      <span class="text-blue-600 font-bold">{{ selectedTotal.toLocaleString() }}만원</span>
    </div>

    <!-- 도넛 차트 -->
    <div class="relative flex justify-center mb-6" style="height: 160px;">
      <v-chart :option="chartOption" autoresize style="width: 160px; height: 160px;" />
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="text-3xl font-bold text-gray-400">{{ donutPercent }}%</span>
      </div>
    </div>

    <!-- 완료 버튼 -->
    <button class="w-full bg-indigo-700 text-white py-3 rounded font-bold text-base" :disabled="selectedTotal !== isaGoalAmount">ISA 계좌 합당 완료</button>
  </CardContainer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CardContainer from "@/components/common/CardContainer.vue";
import BaseTextInput from '@/components/base/BaseTextInput.vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);
// 전체 목표 금액(예: 3,000만원) - 실제로는 props로 받을 것
const totalGoalAmount = 3000;
// BaseTextInput용 입력값 (항상 string)
const isaGoalAmountInput = ref('200');
// 실제 숫자값
const isaGoalAmount = ref(200);
// 상품 mock 데이터
const products = ref([
  { id: 1, name: 'KODEX 200 ETF', desc: '코스피 200 지수 추종', amount: 20 },
  { id: 2, name: 'TIGER 미국필라델피아반도체나스닥', desc: '미국 반도체 기업 투자', amount: 20 },
  { id: 3, name: '삼성전자', desc: '대한민국 대표 기술주', amount: 20 },
  { id: 4, name: '카카오', desc: '모바일 플랫폼 선두 기업', amount: 20 },
  { id: 5, name: 'NAVER', desc: '국내 대표 IT 기업', amount: 10 },
  { id: 6, name: '현대차', desc: '자동차 산업 선두', amount: 15 },
  { id: 7, name: 'LG화학', desc: '화학/배터리 산업', amount: 12 },
]);
// 검색어
const search = ref('');
// 선택된 상품 id
const selectedProductIds = ref([]);

// 상품 필터링
const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  return products.value.filter(
    item =>
      item.name.includes(search.value) ||
      item.desc.includes(search.value)
  );
});

// 선택된 상품의 총 금액
const selectedTotal = computed(() => {
  return products.value
    .filter(item => selectedProductIds.value.includes(item.id))
    .reduce((sum, item) => sum + item.amount, 0);
});

// 목표 남은 금액
const remainingAmount = computed(() => {
  return totalGoalAmount - isaGoalAmount.value;
});

// 도넛 차트 비율
const donutPercent = computed(() => {
  if (!isaGoalAmount.value) return 0;
  return Math.round((selectedTotal.value / isaGoalAmount.value) * 100);
});

// 차트 색상 팔레트
const chartColors = [
  '#1e3a8a', // 진한 파랑
  '#2563eb', // 파랑
  '#0ea5e9', // 하늘
  '#38bdf8', // 밝은 하늘
  '#6366f1', // 보라
  '#f59e42', // 주황
  '#10b981', // 초록
];

// 선택된 상품의 차트 데이터 (미할당 금액 포함)
const selectedChartData = computed(() => {
  const selected = products.value
    .filter(item => selectedProductIds.value.includes(item.id))
    .map((item, idx) => ({
      value: item.amount,
      name: item.name,
      itemStyle: { color: chartColors[idx % chartColors.length] },
    }));
  const total = selected.reduce((sum, item) => sum + item.value, 0);
  if (isaGoalAmount.value > total) {
    selected.push({
      value: isaGoalAmount.value - total,
      name: '미할당',
      itemStyle: { color: '#e5e7eb' }, // 연한 회색
      label: { show: false },
      tooltip: { show: false },
    });
  }
  return selected;
});
// ECharts 옵션
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: params => `${params.name}: ${params.value}만원 (${params.percent}%)`,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#ccc',
    borderWidth: 1,
    textStyle: { color: '#fff', fontSize: 13 },
  },
  series: [
    {
      name: 'ISA 종목별 비중',
      type: 'pie',
      radius: ['60%', '85%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(0, 0, 0, 0.08)',
      },
      label: { show: false },
      data: selectedChartData.value,
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: idx => Math.random() * 200,
    },
  ],
}));

// 입력값이 바뀔 때마다 숫자 변환 및 최대값 제한
watch(isaGoalAmountInput, (val) => {
  let num = parseInt(val.replace(/[^\d]/g, ''), 10);
  if (isNaN(num)) num = 0;
  if (num > totalGoalAmount) num = totalGoalAmount;
  if (num < 0) num = 0;
  isaGoalAmount.value = num;
  // 입력값도 동기화(최대값 초과 시 자동 반영)
  if (val !== String(num)) isaGoalAmountInput.value = String(num);
});
// isaGoalAmount가 외부에서 바뀔 때도 입력값 동기화
watch(isaGoalAmount, (val) => {
  if (isaGoalAmountInput.value !== String(val)) isaGoalAmountInput.value = String(val);
});

// 상품 선택 시 ISA 목표 금액을 초과하지 않도록 체크박스 비활성화
function isProductDisabled(item) {
  // 이미 선택된 경우는 항상 활성
  if (selectedProductIds.value.includes(item.id)) return false;
  // 선택 시 총합이 ISA 목표 금액을 초과하면 비활성
  return selectedTotal.value + item.amount > isaGoalAmount.value;
}
</script>
