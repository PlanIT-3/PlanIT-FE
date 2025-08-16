<template>
  <DefaultLayout>
    <!-- Header -->
    <div class="relative flex items-center py-4">
      <div class="absolute left-0">
        <GoBackButton />
      </div>
      <h1 class="mx-auto text-lg font-semibold">예적금 계좌 할당</h1>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="mb-6 text-center">
      <p class="text-gray-600">계좌 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="mb-6 p-4 bg-red-100 border border-red-300 rounded">
      <p class="text-red-700">{{ error }}</p>
      <button @click="loadAvailableAccounts" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        다시 시도
      </button>
    </div>

    <!-- 목표 할당 금액 -->
    <div class="mb-6" v-if="!loading && !error">
      <label class="block mb-2 font-medium text-gray-700">목표에 할당할 금액</label>
      <BaseTextInput
        :model-value="totalGoalAmount.toLocaleString()"
        type="text"
        :placeholder="`${totalGoalAmount.toLocaleString()}원`"
        class="w-full max-w-lg mb-3"
        disabled
      />

      <p class="mt-1 text-sm text-gray-400">목표 남은 금액: {{ leftGoalAmount.toLocaleString() }}원</p>
    </div>

    <!-- 할당 가능한 계좌가 없을 때 안내 메시지 -->
    <div v-if="!loading && !error && accountOptions.length === 0" class="text-center py-12">
      <div class="mb-6">
        <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-3">할당 가능한 예적금 계좌가 없습니다</h3>
      <div class="text-sm text-gray-500 mb-6 space-y-1">
        <p>다음 중 하나의 이유일 수 있습니다:</p>
        <p>• 모든 예적금 계좌가 다른 목표에 할당됨</p>
        <p>• 연결된 예적금 계좌가 없음</p>
        <p>• 할당 가능한 잔액이 부족함</p>
      </div>
      <div class="space-y-3">
        <Button label="계좌 연결하러 가기" @click="goToAccountLink" class="w-full max-w-sm mx-auto" />
        <button
          @click="goToGoalList"
          class="block w-full max-w-sm mx-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
        >
          다른 목표 확인하기
        </button>
      </div>
    </div>

    <!-- 계좌 목록 -->
    <div v-else-if="!loading && !error && accounts.length > 0">
      <GraphsContainer v-for="(account, index) in accounts" :key="index" class="relative bg-white shadow-sm mb-5">
        <!-- 삭제 버튼 -->
        <div class="absolute top-[1px] right-[6px] flex justify-end">
          <button
            @click="removeAccount(index)"
            class="text-gray-400 hover:text-red-500 focus:outline-none"
            :disabled="accounts.length === 1"
            title="계좌 삭제"
          >
            ✕
          </button>
        </div>

        <!-- 계좌 선택 -->
        <div class="mb-5 mt-2 mx-2">
          <select
            v-model="account.name"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option v-for="option in availableAccountOptions(index)" :key="option.name" :value="option.name">
              {{ option.name }}
            </option>
          </select>
        </div>

        <!-- 슬라이더 -->
        <div class="mx-2 mb-5">
          <div class="font-bold text-gray-800 mb-1">할당 비율 설정</div>
          <div class="flex items-center gap-2 mb-2">
            <input
              type="range"
              min="0"
              max="100"
              :value="account.percentage"
              @input="updatePercentage(index, $event.target.value)"
              class="flex-1 accent-purple-400"
            />
          </div>
          <div class="flex justify-between text-xs text-gray-400">
            <span>총액: {{ formatMoney(getAccountInfo(account.name)?.remainingAmount || 0) }}</span>
            <span>할당: {{ formatMoney(getAllocatedAmount(account)) }}</span>
          </div>
        </div>

        <!-- 할당 상태 바차트 -->
        <div class="mx-2 mb-3">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium text-gray-700">계좌 할당 현황</h4>
            <span class="text-xs text-gray-500">
              {{ formatMoney(getAccountInfo(account.name)?.remainingAmount || 0) }} 중
              {{ formatMoney(getAllocatedAmount(account)) }} 할당
            </span>
          </div>

          <BarChart :data="getAccountAllocationData(account)" />

          <!-- 범례 -->
          <div class="grid grid-cols-1 gap-2 mt-2 text-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded" style="background-color: #4a90e2"></div>
                <span class="text-gray-600">할당된 자산</span>
              </div>
              <span class="text-black font-medium">
                {{ formatMoney(getAccountTotal(account.name) - getAccountInfo(account.name)?.remainingAmount || 0) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded bg-gray-300"></div>
                <span class="text-gray-600">선택된 자산</span>
              </div>
              <span class="text-black font-medium">
                {{ formatMoney(getAllocatedAmount(account)) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded" style="background-color: #5d00a8"></div>
                <span class="text-gray-600">할당 가능자산</span>
              </div>
              <span class="text-black font-medium">
                {{
                  formatMoney(
                    Math.max(0, getAccountInfo(account.name)?.remainingAmount - getAllocatedAmount(account) || 0)
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </GraphsContainer>

      <!-- 계좌 추가 드롭다운 -->
      <div class="relative mb-6">
        <button
          @click="toggleAccountDropdown"
          :disabled="remainingAccountOptions.length === 0 || loading"
          class="w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>＋ 계좌 추가</span>
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': showAccountDropdown }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <!-- 드롭다운 메뉴 -->
        <div
          v-if="showAccountDropdown"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          <div v-if="remainingAccountOptions.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
            추가 가능한 계좌가 없습니다
          </div>
          <button
            v-for="account in remainingAccountOptions"
            :key="account.name"
            @click="addSelectedAccount(account)"
            class="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
          >
            <div class="font-medium text-gray-900">{{ account.name }}</div>
            <div class="text-xs text-gray-500 mt-1">사용 가능: {{ formatMoney(account.remainingAmount) }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- 완료 버튼 -->
    <div v-if="!loading && !error && accounts.length > 0 && accountOptions.length > 0">
      <!-- 완료 조건 안내 메시지 -->
      <div v-if="!isCompletionReady" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-sm">
            <p class="font-medium text-amber-800 mb-1">할당 설정을 완료해주세요</p>
            <p class="text-amber-700">모든 계좌의 할당 비율을 0%보다 크게 설정해야 완료할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <Button
        :label="loading ? '저장 중...' : '예치금 자산 할당 완료'"
        :disabled="loading || !isCompletionReady"
        @click="saveDepositAllocation"
      />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import BarChart from "@/components/graph/BarChart.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import Button from "@/components/base/Button.vue";
import GraphsContainer from "@/components/graph/GraphsContainer.vue";
import { depositService, depositUtils } from "@/api/depositApi.js";
import objectApi from "@/api/objectApi.js";

const route = useRoute();
const router = useRouter();

// URL 파라미터 또는 로컬스토리지에서 goalId 가져오기
const goalId = ref(route.params.goalId || route.query.goalId || localStorage.getItem("newGoalId"));
const memberId = ref(1); // 임시로 하드코딩, 실제로는 로그인 사용자 정보에서 가져와야 함

const totalGoalAmount = ref(Number(route.query.amount || 0) || 0); // 전체 목표 금액 (원 단위) - 쿼리에서 우선 로드, API 백업
const loading = ref(false);
const error = ref(null);

// API에서 가져올 데이터들
const accountOptions = ref([]);
const availableAccounts = ref([]);

// 현재 선택된 계좌들
const accounts = ref([]);

// 완료 상태 추적 (미완료 Goal 삭제 방지용)
const isCompleted = ref(false);

// 계좌 추가 드롭다운 상태
const showAccountDropdown = ref(false);

// API 호출 함수들
async function loadGoalAmount() {
  console.log("🎯 loadGoalAmount 시작:", { goalId: goalId.value, queryAmount: route.query.amount });

  // 신규 생성: 쿼리 파라미터에 amount가 있으면 GoalEdit에서 넘어온 값 사용
  if (route.query.amount && Number(route.query.amount) > 0) {
    totalGoalAmount.value = Number(route.query.amount);
    console.log("🎯 쿼리에서 목표 금액 설정 (신규):", totalGoalAmount.value.toLocaleString() + "원");
    return;
  }

  // 수정: goalId만 있고 amount가 없으면 API에서 조회
  if (!goalId.value) {
    console.error("❌ Goal ID 없음");
    totalGoalAmount.value = 0;
    return;
  }

  try {
    console.log("📡 목표 금액 API 호출 중 (수정)...", `/goals/${goalId.value}/goal-amount`);
    const response = await objectApi.getGoalAmount(goalId.value);
    console.log("✅ 목표 금액 API 응답:", response);

    if (response.status === "OK" && response.data) {
      totalGoalAmount.value = response.data.targetAmount; // 원 단위 그대로 사용
      console.log("🎯 API에서 목표 금액 설정 (수정):", totalGoalAmount.value.toLocaleString() + "원");

      // 수정 모드에서는 기존 할당된 계좌 정보도 가져오기
      await loadExistingAllocations();
      // 수정 모드에서도 사용 가능한 계좌 목록 필요 (계좌 추가나 변경을 위해)
      await loadAvailableAccounts();
    } else {
      console.log("❌ 목표 금액 응답 데이터 구조 문제:", response);
      totalGoalAmount.value = 0; // 기본값
    }
  } catch (err) {
    console.error("목표 금액 로딩 실패:", err);
    totalGoalAmount.value = 0; // 기본값
  }
}

// 수정 모드: 기존 할당된 계좌 정보 가져오기 (DB에서 실제 저장된 데이터)
async function loadExistingAllocations() {
  console.log("🔍 loadExistingAllocations 시작:", { goalId: goalId.value, memberId: memberId.value });

  try {
    console.log("📡 기존 할당 정보 API 호출 중...", `/account/deposit/edit/${memberId.value}?goalId=${goalId.value}`);
    const response = await depositService.getDepositAccountsByGoal(memberId.value, goalId.value);
    console.log("✅ 기존 할당 정보 API 응답:", response);

    if (response.data && response.data.data && response.data.data.length > 0) {
      const existingAllocations = response.data.data;
      console.log("📊 DB에서 가져온 기존 할당 정보:", existingAllocations);

      // 기존 할당 정보를 accounts에 설정
      accounts.value = existingAllocations.map((allocation) => {
        const goalAmountInWan = Math.floor(totalGoalAmount.value / 10000);
        const allocatedAmountInWan = Math.floor(allocation.amount / 10000);
        // 기존 할당 비율 계산: (할당 금액 / 목표 금액) * 100
        const percentage = goalAmountInWan > 0 ? Math.round((allocatedAmountInWan / goalAmountInWan) * 100) : 0;

        console.log(`💰 ${allocation.accountName}: ${allocatedAmountInWan}만원 (${percentage}%)`);

        return {
          name: allocation.accountName,
          memberAccountId: allocation.memberAccountId,
          accountNumber: allocation.accountNumber,
          percentage: Math.min(percentage, 100), // 최대 100%로 제한
        };
      });

      console.log("✅ 기존 할당 정보 화면 설정 완료:", accounts.value);
    } else {
      console.log("❌ 기존 할당 정보 없음:", response);
      // 할당 정보가 없으면 빈 상태로 시작
      accounts.value = [];
    }
  } catch (err) {
    console.error("기존 할당 정보 로딩 실패:", err);
    accounts.value = []; // 실패시 빈 상태로 시작
  }
}

async function loadAvailableAccounts() {
  console.log("🔍 loadAvailableAccounts 시작:", { goalId: goalId.value, memberId: memberId.value });

  if (!goalId.value) {
    error.value = "Goal ID가 필요합니다.";
    console.error("❌ Goal ID 없음");
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    console.log("📡 API 호출 중...", `/account/deposit/available/${memberId.value}?goalId=${goalId.value}`);
    const response = await depositService.getAvailableDeposits(memberId.value, goalId.value);
    console.log("✅ API 응답:", response);

    if (response.data.data) {
      availableAccounts.value = response.data.data;
      console.log("📊 받은 계좌 데이터:", availableAccounts.value);

      // accountOptions를 API 데이터로 변환
      accountOptions.value = availableAccounts.value.map((account) => ({
        name: account.accountName,
        accountNumber: account.accountNumber,
        memberAccountId: account.memberAccountId,
        total: Math.floor(account.presentAmount / 10000), // 원 단위를 만원 단위로 변환
        remainingAmount: Math.floor(account.remainingAmount / 10000),
      }));
      console.log("🔄 변환된 계좌 옵션:", accountOptions.value);

      // 첫 번째 계좌를 기본으로 선택
      if (accountOptions.value.length > 0) {
        accounts.value = [
          {
            name: accountOptions.value[0].name,
            memberAccountId: accountOptions.value[0].memberAccountId,
            accountNumber: accountOptions.value[0].accountNumber,
            percentage: 0,
          },
        ];
        console.log("✅ 기본 계좌 선택:", accounts.value);
      } else {
        console.log("⚠️ 사용 가능한 계좌 없음");
      }
    } else {
      console.log("❌ 응답 데이터 구조 문제:", response);
    }
  } catch (err) {
    console.error("계좌 정보 로딩 실패:", err);
    error.value = "계좌 정보를 불러오는데 실패했습니다.";
  } finally {
    loading.value = false;
  }
}

async function saveDepositAllocation() {
  if (!goalId.value) {
    alert("Goal ID가 필요합니다.");
    return;
  }

  try {
    loading.value = true;

    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      depositAccountRegisterReqs: accounts.value.map((account) => {
        const accountInfo = accountOptions.value.find((opt) => opt.name === account.name);
        const allocatedAmount = getAllocatedAmount(account) * 10000; // 만원을 원 단위로 변환

        return {
          goalId: parseInt(goalId.value),
          memberAccountId: account.memberAccountId,
          accountNumber: account.accountNumber,
          accountType: "Deposit",
          amount: allocatedAmount,
          allocatedRate: account.percentage,
          accountAllocatedRate: account.percentage, // 사용자가 설정한 실제 비율
          actionType: "DEPOSIT",
        };
      }),
    };

    const response = await depositService.registerDeposits(memberId.value, requestData);

    if (response.data.code === "GEN-000") {
      isCompleted.value = true; // 완료 상태로 설정 (Goal 삭제 방지)
      alert("예적금 할당이 완료되었습니다.");
      // GoalEdit으로 돌아가서 최종 완료 처리
      router.push({ path: '/goal/edit', query: { goalId: goalId.value } });
    } else {
      throw new Error(response.data.message || "알 수 없는 오류가 발생했습니다.");
    }
  } catch (err) {
    console.error("예적금 할당 실패:", err);
    alert(err.message || "예적금 할당에 실패했습니다.");
  } finally {
    loading.value = false;
  }
}

// 미완료 Goal 삭제 함수
async function deleteIncompleteGoal() {
  if (!goalId.value) return;

  try {
    console.log("🗑️ 미완료 Goal 삭제 시도:", goalId.value);
    await objectApi.deleteGoal(goalId.value);
    localStorage.removeItem("newGoalId");
    localStorage.removeItem("currentGoalId");
    console.log("✅ 미완료 Goal 삭제 완료:", goalId.value);
  } catch (error) {
    console.error("❌ Goal 삭제 실패:", error);
    // 삭제 실패해도 사용자에게는 알리지 않음 (백그라운드 정리 작업)
  }
}

// 페이지를 벗어날 때 미완료 Goal 삭제
onBeforeUnmount(async () => {
  if (!isCompleted.value && goalId.value) {
    console.log("🚪 페이지 떠남 - 미완료 Goal 삭제 실행");
    await deleteIncompleteGoal();
  }
});

// 브라우저 새로고침/닫기 감지
window.addEventListener("beforeunload", () => {
  if (!isCompleted.value && goalId.value) {
    // 동기적 삭제 (브라우저 제약으로 인한 제한적 지원)
    navigator.sendBeacon(`/api/goals/${goalId.value}`, JSON.stringify({ _method: "DELETE" }));
  }
});

// 컴포넌트 마운트 시 데이터 로딩
onMounted(() => {
  console.log("🚀 컴포넌트 마운트 - goalId 확인:");
  console.log("  - route.params.goalId:", route.params.goalId);
  console.log("  - route.query.goalId:", route.query.goalId);
  console.log("  - route.query.amount:", route.query.amount);
  console.log("  - localStorage.getItem('newGoalId'):", localStorage.getItem("newGoalId"));
  console.log("  - 최종 goalId:", goalId.value);
  console.log("  - 현재 totalGoalAmount:", totalGoalAmount.value);

  loadGoalAmount(); // 신규면 바로 종료, 수정이면 loadExistingAllocations + loadAvailableAccounts 호출

  // 신규 모드일 때만 따로 loadAvailableAccounts 호출
  if (route.query.amount && Number(route.query.amount) > 0) {
    loadAvailableAccounts();
  }
});

// 총액 가져오기
function getAccountTotal(accountName) {
  const account = accountOptions.value.find((a) => a.name === accountName);
  return account?.total ?? 0;
}

// 계좌 정보 가져오기
function getAccountInfo(accountName) {
  return accountOptions.value.find((a) => a.name === accountName);
}

// 개별 할당 금액 계산 - 목표 금액과 할당 가능한 금액 중 작은 값을 기준으로 계산
function getAllocatedAmount(account) {
  const goalAmountInWan = Math.floor(totalGoalAmount.value / 10000);
  const accountInfo = getAccountInfo(account.name);
  const availableAmount = accountInfo?.remainingAmount || 0;
  const maxAmount = Math.min(goalAmountInWan, availableAmount); // 목표 금액과 할당 가능한 금액 중 작은 값
  return (maxAmount * account.percentage) / 100;
}

// 전체 할당 금액
const totalAllocated = computed(() => accounts.value.reduce((sum, acc) => sum + getAllocatedAmount(acc), 0));

// 💡 목표 잔액 계산 (전체 목표 - 할당된 금액) - 모두 원 단위
const leftGoalAmount = computed(() => {
  return totalGoalAmount.value - totalAllocated.value * 10000; // 할당된 금액은 만원 단위이므로 원으로 변환
});

// 퍼센트 업데이트 - 목표 금액과 할당 가능한 금액 중 작은 값을 기준으로 변경
function updatePercentage(index, value) {
  const newPercent = Number(value);
  const goalAmountInWan = Math.floor(totalGoalAmount.value / 10000);
  const accountInfo = getAccountInfo(accounts.value[index].name);
  const availableAmount = accountInfo?.remainingAmount || 0;
  const maxAmount = Math.min(goalAmountInWan, availableAmount); // 목표 금액과 할당 가능한 금액 중 작은 값

  console.log(`🎯 계좌 ${accounts.value[index].name}:`, {
    goalAmount: goalAmountInWan,
    availableAmount: availableAmount,
    maxAmount: maxAmount,
    newPercent: newPercent,
  });

  // 100% = maxAmount이므로 자동으로 할당 가능 금액 초과 방지됨
  accounts.value[index].percentage = newPercent;
}

// 남은 계좌 옵션 계산
const remainingAccountOptions = computed(() => {
  const selectedNames = accounts.value.map((a) => a.name);
  return accountOptions.value.filter((option) => !selectedNames.includes(option.name));
});

// 계좌 추가 드롭다운 토글
function toggleAccountDropdown() {
  showAccountDropdown.value = !showAccountDropdown.value;
}

// 선택된 계좌 추가
function addSelectedAccount(selectedAccount) {
  accounts.value.push({
    name: selectedAccount.name,
    memberAccountId: selectedAccount.memberAccountId,
    accountNumber: selectedAccount.accountNumber,
    percentage: 0,
  });
  showAccountDropdown.value = false; // 드롭다운 닫기
}

// 계좌 추가 (기존 함수 - 호환성 유지)
function addAccount() {
  const remaining = remainingAccountOptions.value;
  if (remaining.length > 0) {
    addSelectedAccount(remaining[0]);
  }
}

// 계좌 삭제
function removeAccount(index) {
  if (accounts.value.length === 1) {
    alert("최소 하나의 계좌는 있어야 합니다.");
    return;
  }
  accounts.value.splice(index, 1);
}

// 계좌 옵션 필터링
function availableAccountOptions(currentIndex) {
  const selected = accounts.value.map((a) => a.name);
  return accountOptions.value.filter(
    (option) => !selected.includes(option.name) || accounts.value[currentIndex].name === option.name
  );
}

// 금액 포맷
function formatMoney(totalGoalAmount) {
  return totalGoalAmount.toLocaleString() + "만원";
}

// 완료 버튼 활성화 조건 검사
const isCompletionReady = computed(() => {
  // 계좌가 없으면 비활성화
  if (accounts.value.length === 0) {
    return false;
  }

  // 모든 계좌가 선택되어 있고 비율이 0보다 큰지 확인
  return accounts.value.every((account) => {
    return account.name && account.percentage > 0;
  });
});

// 계좌별 할당 상태 차트 데이터 생성 (전체 계좌 잔액 기준)
function getAccountAllocationData(account) {
  const accountInfo = accountOptions.value.find((opt) => opt.name === account.name);
  if (!accountInfo) {
    console.log("❌ 계좌 정보 없음:", account.name);
    return [];
  }

  const totalAmount = accountInfo.total; // 전체 계좌 잔액 (만원)
  const currentAllocation = getAllocatedAmount(account); // 현재 설정한 할당 금액 (만원)
  const alreadyAllocated = accountInfo.total - accountInfo.remainingAmount; // 이미 다른 목표에 할당된 금액 (만원)
  const availableAmount = Math.max(0, accountInfo.remainingAmount - currentAllocation); // 남은 사용 가능 금액

  console.log(`📊 ${account.name} 할당 상태:`, {
    totalAmount,
    alreadyAllocated,
    currentAllocation,
    availableAmount,
    remainingAmount: accountInfo.remainingAmount,
  });

  if (totalAmount === 0) {
    return [{ something: "데이터 없음", value: 100 }];
  }

  // 백분율로 변환 (전체 계좌 잔액 100% 기준)
  const alreadyAllocatedPercent = Math.round((alreadyAllocated / totalAmount) * 100);
  const currentAllocationPercent = Math.round((currentAllocation / totalAmount) * 100);
  const availableAmountPercent = Math.round((availableAmount / totalAmount) * 100);

  const chartData = [
    {
      something: "할당", // 다른 목표에 이미 할당된 자산
      value: Math.max(alreadyAllocatedPercent, 0),
    },
    {
      something: "선택된 자산", // 현재 슬라이더로 선택한 자산
      value: Math.max(currentAllocationPercent, 0),
    },
    {
      something: "할당 가능자산", // 아직 할당되지 않은 남은 자산
      value: Math.max(availableAmountPercent, 0),
    },
  ];

  console.log(`📊 ${account.name} 백분율 데이터:`, chartData);

  return chartData;
}

// 네비게이션 함수들
function goToAccountLink() {
  // 계좌 연결 페이지로 이동 (실제 라우팅 경로에 맞게 수정 필요)
  router.push("/onboarding/bank-select");
}

function goToGoalList() {
  // 목표 목록 페이지로 이동
  router.push("/goal");
}
</script>
