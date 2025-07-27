<template>
  <DefaultLayout>
    <div class="flex flex-col min-h-screen relative mt-10">
      <!-- 목표 헤더 섹션 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-4 mx-[13px] -mt-[87px] relative z-20">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-gray-900">나의 목표</h1>
          <button class="p-2 rounded-lg hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ goalTitle }}</h2>
          <div class="flex items-center">
            <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ progressPercentage }}%
            </div>
            <span class="ml-2 text-sm text-gray-600">목표 달성까지 {{ remainingAmount }}만원</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>{{ currentAmount }}만원</span>
            <span>{{ targetAmount }}만원</span>
          </div>
          <BarChart />
        </div>
      </div>

      <!-- 목표에 할당된 계좌 섹션 -->
      <div class="bg-white rounded-2xl shadow-sm mx-4 mb-4 p-5">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">목표에 할당된 계좌</h3>
        <GoalAssignedCard
          v-for="(account, index) in accounts"
          :key="index"
          :bank-name="account.bankName"
          :product-name="account.productName"
          :percent="account.percent"
          :amount="account.amount"
          class="mb-3"
        />
      </div>

      <!-- 목표 금액 및 저축액 요약 -->
      <div class="bg-white rounded-2xl shadow-sm mx-4 mb-4 p-5">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-sm text-gray-600">목표 금액</p>
            <p class="text-2xl font-bold text-gray-800">{{ targetAmount }}만원</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">현재 저축액</p>
            <p class="text-2xl font-bold text-green-600">{{ currentAmount }}만원</p>
          </div>
        </div>
        <div class="border-t pt-4">
          <div class="flex justify-between items-center">
            <p class="text-sm font-medium text-gray-700">목표 금액까지</p>
            <p class="text-xl font-bold text-blue-600">{{ remainingAmount }}만원</p>
          </div>
        </div>
      </div>

      <!-- 목표 진행 요약 및 차트 -->
      <div class="bg-white rounded-2xl shadow-sm mx-4 mb-4 p-5">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">주식 진행 추이</h3>

        <div class="mb-6 h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-purple-200">
          <div class="text-center text-gray-500">
            <div class="text-sm mb-2">주식 진행 추이 차트</div>
            <div class="text-xs text-purple-600">추후 실제 차트 컴포넌트로 교체</div>
          </div>
        </div>

        <div class="mb-6 flex justify-center">
          <SummaryCard>
            <template #title>🔍 목표 진행 요약</template>
            목표 달성을 위한 현재 포트폴리오 상태입니다. 지속적인 적립식 투자로 목표 달성이 가능할 것으로 예상됩니다.
            AI들어갈예정
          </SummaryCard>
        </div>

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
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import BarChart from "@/components/graph/BarChart.vue";
import GoalAssignedCard from "@/components/manageGoal/GoalAssignedCard.vue";
import SummaryCard from "@/components/common/SummaryCard.vue";
import RebalanceCard from "@/components/goal/RebalanceCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";

// Props (나중에 외부에서 넘기도록 할 수 있음)
const goalTitle = ref("자가용 구매하기");
const targetAmount = ref(5000);

const accounts = ref([
  { bankName: "토스", productName: "예금 · 주택청약", percent: 15, amount: 675 },
  { bankName: "KB", productName: "적금 · 주택청약", percent: 60, amount: 2700 },
  { bankName: "카카오뱅크", productName: "자유적금", percent: 25, amount: 1125 },
]);

const currentAmount = computed(() => {
  return accounts.value.reduce((sum, acc) => sum + acc.amount, 0);
});

const remainingAmount = computed(() => targetAmount.value - currentAmount.value);
const progressPercentage = computed(() => Math.round((currentAmount.value / targetAmount.value) * 100));

// 리밸런싱 기간
const periods = ref(["한달", "3개월", "6개월", "1년"]);
const selectedPeriod = ref("한달");
</script>
