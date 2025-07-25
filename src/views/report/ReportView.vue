<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 투자 리포트 박스: 흰배경, 둥근 모서리, 회색 테두리 -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div class="flex flex-col items-center">
          <div class="flex items-center mb-2">
            <span class="inline-block w-6 h-6 mr-2">
              <span class="text-2xl">📊</span>
            </span>
            <h1 class="text-2xl font-bold">투자 리포트</h1>
          </div>
          <div class="text-gray-400 text-sm mb-4">2025년 7월 기준 · 개인 투자 현황 분석</div>
        </div>
        <!-- 목표별 달성률 영역 -->
        <div class="mb-0">
          <div class="text-sm font-semibold mb-2 flex items-center">
            <span class="text-red-500 mr-1">📈</span> 목표별 달성률
          </div>
          <div class="text-xs text-gray-400 mb-4">각 투자 목표의 현재 진행 상황</div>

          <!-- 차트 1 ~ 4개까지 자동 배치 가능 -->
          <div
            :class="[
              'grid gap-4 justify-center',
              goals.length === 1
                ? 'grid-cols-1'
                : goals.length === 2
                  ? 'grid-cols-2'
                  : goals.length === 3
                    ? 'grid-cols-3'
                    : 'grid-cols-4',
            ]"
          >
            <div v-for="(goal, i) in goals" :key="i" class="flex flex-col items-center">
              <CircleProgress :percent="72" :color="goal.color" :size="64" />
              <div class="text-xs font-semibold text-gray-700 mt-2">{{ goal.name }}</div>
              <div class="text-[11px] text-gray-400">{{ goal.value }} / {{ goal.total }}</div>
            </div>
          </div>
        </div>
        <div class="text-gray-400 text-sm mb-4">2025년 7월 기준 · 개인 투자 현황 분석</div>
      </div>
      <!-- 목표별 달성률 영역 -->
      <div class="mb-0">
        <div class="text-sm font-semibold mb-2 flex items-center">
          <span class="text-red-500 mr-1">📈</span> 목표별 달성률
        </div>
        <div class="text-xs text-gray-400 mb-4">각 투자 목표의 현재 진행 상황</div>

        <!-- 탭 버튼 -->
        <div class="flex justify-center gap-2 mb-4">
          <button
            @click="setActiveTab('isa')"
            :class="[
              'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
              activeTab === 'isa'
                ? 'bg-blue-100 text-blue-600 border-blue-300'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
            ]"
          >
            <span class="text-base">💳</span> ISA 리포트
          </button>
          <button
            @click="setActiveTab('investment')"
            :class="[
              'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
              activeTab === 'investment'
                ? 'bg-blue-100 text-blue-600 border-blue-300'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
            ]"
          >
            <span class="text-base">📊</span> 투자 리포트
          </button>
        </div>
      </div>

      <!-- 탭 버튼 -->
      <div class="flex justify-center gap-2 mb-4">
        <button
          @click="setActiveTab('isa')"
          :class="[
            'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
            activeTab === 'isa'
              ? 'bg-blue-100 text-blue-600 border-blue-300'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
          ]"
        >
          <span class="text-base">💳</span> ISA 리포트
        </button>
        <button
          @click="setActiveTab('investment')"
          :class="[
            'px-6 py-2 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors text-sm',
            activeTab === 'investment'
              ? 'bg-blue-100 text-blue-600 border-blue-300'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200',
          ]"
        >
          <span class="text-base">📊</span> 투자 리포트
        </button>
      </div>
    </div>
    <!-- 그래프 카드 영역 (GraphBox 컴포넌트 사용) -->
    <div class="w-full max-w-xl flex flex-col gap-4">
      <GraphBox title="내 일별 수익률 변화" v-model:period="period1"> [그래프 영역] </GraphBox>
      <GraphBox title="주별 투자금 총액 비교" v-model:period="period2"> [그래프 영역] </GraphBox>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import CircleProgress from "@/components/report/CircleProgress.vue";
import { ref } from "vue";

const activeTab = ref("investment"); // 기본값: 투자 리포트

const goals = [
  { name: "ISA 내집마련", value: 2160, total: 3000, color: "#3b82f6" },
  { name: "ISA 내집마련", value: 2160, total: 3000, color: "#10b981" },
  { name: "ISA 내집마련", value: 2160, total: 3000, color: "#f59e42" },
];

const setActiveTab = (tab) => {
  activeTab.value = tab;
};
</script>
