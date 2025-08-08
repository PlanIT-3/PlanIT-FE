<template>
  <div>
    <!-- 리밸런싱 -->
    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">특정 기간 리밸런싱</h4>
      <div class="flex gap-2 mb-4">
        <button
          v-for="period in periods"
          :key="period"
          @click="selectedPeriod = period"
          :class="[
            'px-3 py-1 text-xs rounded-md border transition-colors',
            selectedPeriod === period
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ period }}
        </button>
      </div>
      <RebalanceCard
        title="한달"
        expected-yield="8.2%"
        yield-change="1.5%"
        goal-period="6개월"
        risk-level="중간"
        risk-color="text-orange-600"
        comment="현재 포트폴리오 비중이 목표와 잘 맞습니다."
        comment-emoji="✅"
      />
    </div>

    <!-- 포트폴리오 & 코인 -->
    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">QQQ + QLD 포트폴리오</h4>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">예상 수익률:</span>
            <span class="font-semibold text-green-600 ml-2">4.3%</span>
          </div>
          <div>
            <span class="text-gray-600">4.5개월:</span>
            <span class="font-semibold ml-2">목표 달성</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <h4 class="text-base font-semibold text-gray-800 mb-3">코인 보유 종목</h4>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">비중:</span>
            <span class="font-semibold ml-2">15.0%</span>
          </div>
          <div>
            <span class="text-gray-600">4.3%:</span>
            <span class="font-semibold text-orange-600 ml-2">위험도 높음</span>
          </div>
          <div>
            <span class="text-gray-600">현재 보유:</span>
            <span class="font-semibold text-red-600 ml-2">주의 필요</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import RebalanceCard from "@/components/goal/RebalanceCard.vue";
import { ref } from "vue";

// 리밸런싱 기간
const periods = ref(["한달", "3개월", "6개월", "1년"]);
const selectedPeriod = ref("한달");
</script>
<style scoped></style>
