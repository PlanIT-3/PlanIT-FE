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
              @click=""
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

        <GoalCard
          :title="goalDetail.goalName ?? ''"
          :rate="goalDetail.goalRate ?? 0"
          :showLegend="false"
          :barChartData="rateList"
          :totalAmount="goalDetail.totalAmount ?? 0"
          :targetAmount="goalDetail.targetAmount ?? 0"
        />
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
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BarChart from "@/components/graph/BarChart.vue";
import GoalAssignedCard from "@/components/manageGoal/GoalAssignedCard.vue";
import SummaryCard from "@/components/common/SummaryCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/GoalApi";
import GoalCard from "@/components/goal/GoalCard.vue";

const auth = useAuthStore();
const cr = useRoute();
const router = useRouter();

const id = cr.params.id; //라우터 경로 변수

const goalDetail = ref({});
const rateList = ref();
const load = async () => {
  try {
    goalDetail.value = (await api.getGoal(id)).data;
    rateList.value = await api.getGoalAccountRates(id);
  } catch (err) {
    console.log("Goal API 호출 실패", err);
  }
};

// Props (나중에 외부에서 넘기도록 할 수 있음)
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

onMounted(load);
</script>
