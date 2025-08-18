<template>
  <DefaultLayout>
    <!-- 메인 콘텐츠 -->
    <div v-if="!isLoading" class="flex flex-col relative gap-4">
      <!-- 목표 헤더 섹션 -->
      <div class="w-full">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-xl font-bold text-gray-900">나의 목표</h1>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg hover:bg-gray-100"
              title="수정"
              @click="router.push({ path: '/goal/edit', query: { goalId: id } })"
            >
              <!-- 아이콘 생략 -->
            </button>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onDelete"
              :disabled="deleting"
              title="삭제"
            >
              <!-- 아이콘 생략 -->
            </button>
          </div>
        </div>

        <GoalCard
          :title="goalDetail.goalName ?? ''"
          :rate="goalDetail.goalRate ?? 0"
          :showLegend="false"
          :barChartData="rateList"
          :totalAmount="currentAmount ?? 0"
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
            :percent="toPercent(account.amount, goalDetail.targetAmount)"
            :amount="formatCurrency(account.amount)"
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
            :percent="toPercent(isa.isaBalance, goalDetail.targetAmount)"
            class="mb-3"
          />
        </div>

        <!-- 목표 금액 및 저축액 요약 -->
        <div class="bg-white rounded-2xl p-5">
          <div class="flex justify-between items-center mb-2">
            <div>
              <p class="text-xs text-gray-600">목표 금액</p>
              <p class="text-lg font-semibold text-gray-800">{{ formatCurrency(goalDetail.targetAmount) }}원</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-600">현재 저축액</p>
              <p class="text-lg font-semibold text-green-600">{{ formatCurrency(currentAmount) }}원</p>
            </div>
          </div>
          <div class="border-t border-gray-300 pt-2 w-full">
            <div class="flex justify-between items-center">
              <p class="text-xs font-medium text-gray-700">목표 금액까지</p>
              <p class="text-lg font-semibold text-blue-600">{{ formatCurrency(remainingAmount) }}원</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 목표 진행 요약 및 차트 -->
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800">목표 진행 추이</h3>
        <GoalProgress :progressData="goalProgress"></GoalProgress>
      </div>
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
import { ref, computed, onMounted } from "vue";
import GoalAssignedCard from "@/components/manageGoal/GoalAssignedCard.vue";
import GoalIsaCard from "@/components/manageGoal/GoalIsaCard.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import GoalProgress from "./GoalProgress.vue";
import GoalCard from "@/components/goal/GoalCard.vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/objectApi";

// --- 유틸 함수 ---
function round(num, digits = 0) {
  if (num == null) return 0;
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}

function toPercent(value, total) {
  if (!total) return 0;
  return round((value / total) * 100);
}

function formatCurrency(num) {
  return round(num).toLocaleString();
}

// --- 컴포넌트 상태 ---
const cr = useRoute();
const router = useRouter();
const id = cr.params.id;

const goalDetail = ref({});
const rateList = ref([]);
const goalProgress = ref([]);
const accounts = ref([]);
const depositAccounts = ref([]);
const isaAccounts = ref([]);
const isLoading = ref(true);
const deleting = ref(false);

// --- 계산된 값 ---
const currentAmount = computed(() => {
  const depositAmount = depositAccounts.value.reduce((sum, acc) => sum + acc.amount, 0);
  const isaAmount = isaAccounts.value.reduce((sum, acc) => sum + acc.isaBalance, 0);
  return depositAmount + isaAmount;
});

const remainingAmount = computed(() => (goalDetail.value?.targetAmount || 0) - currentAmount.value);

// --- API 호출 ---
const load = async () => {
  try {
    isLoading.value = true;
    goalDetail.value = (await api.getGoal(id)).data;
    rateList.value = await api.getGoalAccountRates(id);
    accounts.value = await api.getGoalAccounts(id);

    const accountsDetail = await api.getGoalAccountsDetail(id);

    depositAccounts.value = (accountsDetail.goalDepositList || []).map((account) => ({
      bankName: account.bankName,
      productName: account.accountName,
      amount: account.accountBalance,
    }));

    isaAccounts.value = (accountsDetail.goalIsaList || []).map((account) => ({
      itemName: account.itemName,
      presentAmount: account.presentAmount,
      quantity: account.quantity,
      isaBalance: account.isaBalance,
    }));
  } catch (err) {
    console.error("Goal API 호출 실패", err);
  } finally {
    isLoading.value = false;
  }
};

// --- 삭제 ---
async function onDelete() {
  if (!confirm("해당 목표를 삭제하시겠습니까?")) return;
  deleting.value = true;
  try {
    await api.deleteGoal(id);
    alert("삭제되었습니다.");
    router.push("/goal");
  } catch (e) {
    console.error("목표 삭제 실패:", e);
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>
