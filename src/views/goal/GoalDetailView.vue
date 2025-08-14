<template>
  <DefaultLayout>
    <!-- 메인 콘텐츠 -->
    <div v-if="!isLoading" class="flex flex-col relative gap-4">
      <!-- 목표 헤더 섹션 -->
      <div class="w-full">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-gray-900">나의 목표</h1>
          <button
            class="p-2 rounded-lg hover:bg-gray-100"
            @click="
              router.push({
                path: '/goal/edit',
                query: { goalId: id },
              })
            "
          >
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
      <div>
        <div class="w-full">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">목표에 할당된 계좌</h3>
          <!-- 예금 계좌 -->
          <GoalAssignedCard
            v-for="(account, index) in depositAccounts"
            :key="`deposit-${index}`"
            :bank-name="account.bankName"
            :product-name="account.productName"
            :percent="Math.round((account.amount / (goalDetail.targetAmount || 1)) * 100)"
            :amount="account.amount.toLocaleString()"
            class="mb-3"
          />

          <!-- ISA 계좌 -->
          <GoalIsaCard
            v-for="(isa, index) in isaAccounts"
            :key="`isa-${index}`"
            :item-name="isa.itemName"
            :present-amount="isa.presentAmount"
            :quantity="isa.quantity"
            :isa-balance="isa.isaBalance"
            :percent="Math.round((isa.isaBalance / (goalDetail.targetAmount || 1)) * 100)"
            class="mb-3"
          />
        </div>

        <!-- 목표 금액 및 저축액 요약 -->
        <div class="bg-white rounded-2xl p-5">
          <div class="flex justify-between items-center mb-2">
            <div>
              <p class="text-xs text-gray-600">목표 금액</p>
              <p class="text-lg font-semibold text-gray-800">{{ goalDetail.targetAmount?.toLocaleString() }}원</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-600">현재 저축액</p>
              <p class="text-lg font-semibold text-green-600">{{ currentAmount.toLocaleString() }}원</p>
            </div>
          </div>
          <div class="border-t border-gray-300 pt-2 w-full">
            <div class="flex justify-between items-center">
              <p class="text-xs font-medium text-gray-700">목표 금액까지</p>
              <p class="text-lg font-semibold text-blue-600">{{ remainingAmount?.toLocaleString() }}원</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 목표 진행 요약 및 차트 -->
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800">목표 진행 추이</h3>
        <GoalProgress :progressData="goalProgress"></GoalProgress>
      </div>
      <!-- <GoalProgressAdvice :goalId="id" /> -->
    </div>

    <!-- 로딩 -->
    <div v-else>
      <div class="flex justify-center items-center h-24">
        <div class="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import GoalAssignedCard from "@/components/manageGoal/GoalAssignedCard.vue";
import GoalIsaCard from "@/components/manageGoal/GoalIsaCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import GoalProgress from "./GoalProgress.vue";
import GoalProgressAdvice from "@/components/goal/GoalProgressAdvice.vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/objectApi";

import GoalCard from "@/components/goal/GoalCard.vue";
import VChart from "vue-echarts";

const auth = useAuthStore();
const cr = useRoute();
const router = useRouter();

const id = cr.params.id; //라우터 경로 변수

const goalDetail = ref({});
const rateList = ref();
const goalProgress = ref([]); // api 응답 데이터 배열
const accounts = ref([]);
const depositAccounts = ref([]);
const isaAccounts = ref([]);
const isLoading = ref(true); // 로딩 상태

const investmentChartOption = ref({}); // 차트 옵션 빈 객체 초기화

const load = async () => {
  try {
    isLoading.value = true;

    goalDetail.value = (await api.getGoal(id)).data;
    rateList.value = await api.getGoalAccountRates(id);
    goalProgress.value = await api.getGoalProgress(id);
    accounts.value = await api.getGoalAccounts(id);

    // 새로운 API로 예금과 ISA 계좌 분리 조회
    const accountsDetail = await api.getGoalAccountsDetail(id);
    depositAccounts.value = accountsDetail.depositAccounts;
    isaAccounts.value = accountsDetail.isaAccounts;

    console.log("Goal Progress Response:", goalProgress.value);
    console.log("Accounts Data:", accounts.value);
  } catch (err) {
    console.log("Goal API 호출 실패", err);
  } finally {
    isLoading.value = false;
  }
};

const currentAmount = computed(() => {
  const depositAmount = depositAccounts.value.reduce((sum, acc) => sum + acc.amount, 0);
  const isaAmount = isaAccounts.value.reduce((sum, acc) => sum + acc.isaBalance, 0);
  return depositAmount + isaAmount;
});

const remainingAmount = computed(() => (goalDetail.value?.targetAmount || 0) - currentAmount.value);

onMounted(load);
</script>
