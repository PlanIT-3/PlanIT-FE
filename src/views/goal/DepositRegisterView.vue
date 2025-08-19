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
            <span>총액: {{ formatMoney(getMaxAllocatableAmount(account.name)) }}</span>
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
                {{ formatMoney(getLegendAllocatedAmount(account.name)) }}
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
                {{ formatMoney(getLegendAvailableAmount(account.name)) }}
              </span>
            </div>
          </div>
        </div>
      </GraphsContainer>

      <!-- 계좌 추가 버튼 -->
      <div class="mb-6">
        <button
          @click="addNextAccount"
          :disabled="remainingAccountOptions.length === 0 || loading"
          class="w-full py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>＋ 계좌 추가</span>
        </button>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
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

// URL 파라미터 또는 로컬스토리지에서 goalId 가져오기 (우선순위: query > params > localStorage)
// 신규모드: route.query.goalId가 명시적으로 없으면 localStorage 무시
const goalId = ref(
  route.query.goalId ||
    route.params.goalId ||
    (route.query.goalId === undefined ? null : localStorage.getItem("currentGoalId"))
);

// JWT 토큰에서 memberId 가져오기
function getMemberIdFromToken() {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return 1; // 기본값

    const auth = JSON.parse(authData);
    const token = auth.token?.accessToken;
    if (!token) return 1; // 기본값

    // JWT 페이로드 디코딩
    const parts = token.split(".");
    if (parts.length !== 3) return 1; // 기본값

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.memberId || payload.sub || payload.userId || payload.id || 1;
  } catch (error) {
    console.error("JWT에서 memberId 추출 실패:", error);
    return 1; // 기본값
  }
}

const memberId = ref(getMemberIdFromToken());

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

// 모드 고정 (처음 결정된 후 변경되지 않음)
const isEditMode = ref(false);

// 디버깅용: isEditMode 변경 추적
watch(
  isEditMode,
  (newValue, oldValue) => {
    console.log("🚨 isEditMode 변경 감지:", {
      old: oldValue,
      new: newValue,
      stack: new Error().stack,
    });
  },
  { immediate: true }
);

// 계좌 추가 드롭다운 상태
const showAccountDropdown = ref(false);

// API 호출 함수들
async function loadGoalAmount() {
  console.log("🎯 loadGoalAmount 시작:", { goalId: goalId.value, queryAmount: route.query.amount });

  // goalId가 없으면 에러
  if (!goalId.value) {
    console.error("❌ Goal ID 없음");
    totalGoalAmount.value = 0;
    return;
  }

  // 쿼리에서 목표 금액 설정
  if (route.query.amount && Number(route.query.amount) > 0) {
    totalGoalAmount.value = Number(route.query.amount);
    console.log("🎯 쿼리에서 목표 금액 설정:", totalGoalAmount.value.toLocaleString() + "원");
  }

  // 먼저 DB에서 기존 할당 정보 확인하여 신규/수정 모드 결정
  console.log("🔍 기존 할당 정보 확인 중...");
  try {
    const response = await depositService.getDepositAccountsByGoal(memberId.value, goalId.value);

    if (response.data && response.data.data && response.data.data.length > 0) {
      // 기존 할당 정보가 있음 → 수정모드
      isEditMode.value = true;
      console.log("📝 수정모드: 기존 할당 정보 발견", response.data.data);
      await loadExistingAllocations(response.data.data); // 이미 가져온 데이터 전달
      await loadAvailableAccounts();
    } else {
      // 기존 할당 정보가 없음 → 신규모드
      isEditMode.value = false;
      console.log("🆕 신규모드: 기존 할당 정보 없음");
      // 신규모드에서는 사용 가능한 계좌 목록만 로드
      await loadAvailableAccounts();
    }
  } catch (error) {
    console.error("❌ 할당 정보 확인 실패:", error);
    // 에러 발생 시 신규모드로 처리
    isEditMode.value = false;
    console.log("🆕 신규모드로 처리 (에러 시 기본값)");
    await loadAvailableAccounts();
    return;
  }

  // 쿼리에서 목표 금액을 가져오지 못한 경우만 API에서 조회
  if (!totalGoalAmount.value) {
    try {
      console.log("📡 목표 금액 API 호출 중...", `/goals/${goalId.value}/goal-amount`);
      const response = await objectApi.getGoalAmount(goalId.value);
      console.log("✅ 목표 금액 API 응답:", response);

      if (response.status === "OK" && response.data) {
        totalGoalAmount.value = response.data.targetAmount; // 원 단위 그대로 사용
        console.log("🎯 API에서 목표 금액 설정:", totalGoalAmount.value.toLocaleString() + "원");
      } else {
        console.log("❌ 목표 금액 응답 데이터 구조 문제:", response);
        totalGoalAmount.value = 0; // 기본값
      }
    } catch (err) {
      console.error("목표 금액 로딩 실패:", err);
      totalGoalAmount.value = 0; // 기본값
    }
  }
}

// 수정 모드: 기존 할당된 계좌 정보 가져오기 (DB에서 실제 저장된 데이터)
async function loadExistingAllocations(existingData = null) {
  console.log("🔍 loadExistingAllocations 시작:", { goalId: goalId.value, memberId: memberId.value });

  let existingAllocations = existingData;

  // 데이터가 전달되지 않은 경우에만 API 호출
  if (!existingAllocations) {
    try {
      console.log("📡 기존 할당 정보 API 호출 중...", `/account/deposit/edit/${memberId.value}?goalId=${goalId.value}`);
      const response = await depositService.getDepositAccountsByGoal(memberId.value, goalId.value);
      console.log("✅ 기존 할당 정보 API 응답:", response);

      if (response.data && response.data.data && response.data.data.length > 0) {
        existingAllocations = response.data.data;
      } else {
        console.log("❌ 기존 할당 정보 없음");
        return;
      }
    } catch (error) {
      console.error("❌ 기존 할당 정보 로딩 실패:", error);
      return;
    }
  }

  try {
    if (existingAllocations && existingAllocations.length > 0) {
      console.log("📊 DB에서 가져온 기존 할당 정보:", existingAllocations);

      // 기존 할당 정보를 accounts에 설정
      accounts.value = existingAllocations.map((allocation) => {
        const goalAmountInWan = Math.floor(totalGoalAmount.value / 10000);
        const allocatedAmountInWan = Math.floor(allocation.amount / 10000);

        console.log(`🔍 비율계산 디버그 ${allocation.accountName}:`, {
          totalGoalAmount: totalGoalAmount.value,
          goalAmountInWan,
          allocationAmount: allocation.amount,
          allocatedAmountInWan,
          division: allocatedAmountInWan / goalAmountInWan,
        });

        // 수정모드에서는 최대 할당 가능 금액 대비 비율로 계산해야 함
        // 최대 할당 가능 금액 = min(목표 금액, 계좌 사용가능 잔액)
        const accountTotalInWan = Math.floor((allocation.presentAmount || allocation.accountBalance || 0) / 10000);
        const apiRemainingInWan = Math.floor((allocation.remainingAmount || 0) / 10000);
        const correctedRemainingInWan = apiRemainingInWan + allocatedAmountInWan; // 현재 할당분 추가
        const maxAllocatableInWan = Math.min(goalAmountInWan, correctedRemainingInWan);

        // 기존 할당 비율 계산: (할당 금액 / 최대 할당 가능 금액) * 100
        let percentage = 0;
        if (maxAllocatableInWan > 0 && !isNaN(allocatedAmountInWan) && !isNaN(maxAllocatableInWan)) {
          percentage = Math.round((allocatedAmountInWan / maxAllocatableInWan) * 100);
        }

        // NaN 방지
        percentage = isNaN(percentage) ? 0 : percentage;

        console.log(`📊 수정모드 비율계산 ${allocation.accountName}:`, {
          goalAmount: goalAmountInWan,
          allocated: allocatedAmountInWan,
          maxAllocatable: maxAllocatableInWan,
          percentage: percentage,
        });

        console.log(`💰 ${allocation.accountName}: ${allocatedAmountInWan}만원 (${percentage}%)`);

        return {
          name: allocation.accountName,
          memberAccountId: allocation.memberAccountId,
          accountNumber: allocation.accountNumber,
          percentage: Math.min(Math.max(percentage, 0), 100), // 0-100% 범위로 제한
        };
      });

      // 기존 할당된 계좌들을 accountOptions에도 설정 (수정모드에서 드롭다운에 표시하기 위해)
      accountOptions.value = existingAllocations.map((allocation) => {
        const totalAmount = Math.floor((allocation.presentAmount || allocation.accountBalance || 0) / 10000);
        const allocatedAmount = Math.floor(allocation.amount / 10000); // 현재 목표에 할당된 금액
        const apiRemainingAmount = Math.floor((allocation.remainingAmount || 0) / 10000);

        // 수정모드에서는 현재 할당 금액을 다시 사용 가능하게 만들어야 함
        const correctedRemainingAmount =
          (isNaN(apiRemainingAmount) ? 0 : apiRemainingAmount) + (isNaN(allocatedAmount) ? 0 : allocatedAmount);

        console.log(`🔧 계좌 정보 수정: ${allocation.accountName}`, {
          total: totalAmount,
          apiRemaining: apiRemainingAmount,
          allocated: allocatedAmount,
          correctedRemaining: correctedRemainingAmount,
        });

        return {
          name: allocation.accountName,
          accountNumber: allocation.accountNumber,
          memberAccountId: allocation.memberAccountId,
          total: isNaN(totalAmount) ? 0 : totalAmount,
          remainingAmount: Math.max(0, isNaN(correctedRemainingAmount) ? 0 : correctedRemainingAmount),
        };
      });

      console.log("✅ 기존 할당 정보 화면 설정 완료:", accounts.value);
      console.log("✅ accountOptions 설정 완료:", accountOptions.value);
    } else {
      console.log("❌ 기존 할당 정보 없음:", response);
      // 할당 정보가 없으면 빈 상태로 시작
      accounts.value = [];
      accountOptions.value = [];
    }
  } catch (err) {
    console.error("기존 할당 정보 로딩 실패:", err);
    accounts.value = []; // 실패시 빈 상태로 시작
    accountOptions.value = [];
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

      // 수정모드 확인 (전역 isEditMode 사용)

      // accountOptions를 API 데이터로 변환
      if (isEditMode.value) {
        // 수정모드: loadExistingAllocations에서 이미 accountOptions를 설정했으므로
        // 추가 계좌만 병합 (계좌 추가 기능용)
        console.log("🔄 수정모드: 기존 accountOptions 유지하고 추가 계좌만 병합");
        console.log("🔍 현재 accountOptions:", accountOptions.value);
        console.log("🔍 사용 가능한 추가 계좌:", availableAccounts.value);

        // 기존 accountOptions에 없는 계좌만 추가
        const existingAccountNames = accountOptions.value.map((acc) => acc.name);
        const additionalAccounts = availableAccounts.value
          .filter((account) => !existingAccountNames.includes(account.accountName) && account.remainingAmount > 0)
          .map((account) => ({
            name: account.accountName,
            accountNumber: account.accountNumber,
            memberAccountId: account.memberAccountId,
            total: Math.floor(account.presentAmount / 10000),
            remainingAmount: Math.floor(account.remainingAmount / 10000),
          }));

        // 기존 계좌 + 추가 계좌 병합
        accountOptions.value = [...accountOptions.value, ...additionalAccounts];
        console.log("✅ 병합된 accountOptions:", accountOptions.value);
      } else {
        // 신규모드: 할당 가능한 자산이 있는 계좌만
        console.log("🆕 신규모드: 할당 가능한 계좌만");
        console.log(
          "🔍 필터링 전 계좌들:",
          availableAccounts.value.map((acc) => ({
            name: acc.accountName,
            remainingAmount: acc.remainingAmount,
            presentAmount: acc.presentAmount,
          }))
        );

        // 만원 단위로 변환 후 필터링
        const accountsInWan = availableAccounts.value.map((account) => ({
          name: account.accountName,
          accountNumber: account.accountNumber,
          memberAccountId: account.memberAccountId,
          total: Math.floor(account.presentAmount / 10000),
          remainingAmount: Math.floor(account.remainingAmount / 10000),
          originalRemainingAmount: account.remainingAmount, // 디버깅용
        }));

        console.log(
          "🔍 만원 단위 변환 후:",
          accountsInWan.map((acc) => ({
            name: acc.name,
            originalRemaining: acc.originalRemainingAmount,
            remainingWan: acc.remainingAmount,
          }))
        );

        const filteredAccounts = accountsInWan.filter((account) => account.remainingAmount > 0);
        console.log(
          "🔍 필터링 후 계좌들:",
          filteredAccounts.map((acc) => ({
            name: acc.name,
            remainingAmount: acc.remainingAmount,
          }))
        );

        accountOptions.value = filteredAccounts;
      }
      console.log("🔄 변환된 계좌 옵션:", accountOptions.value);

      // 수정모드에서 기존 할당된 계좌가 accountOptions에 없을 경우 전체 계좌에서 가져와서 추가
      if (isEditMode.value) {
        console.log("🔄 수정모드: 기존 할당 계좌 확인 및 추가");

        try {
          // 전체 계좌 정보 가져오기
          const allAccountsResponse = await depositService.getDepositAccounts(memberId.value);
          console.log("📊 전체 계좌 정보:", allAccountsResponse);

          if (allAccountsResponse.data.data) {
            const allAccounts = allAccountsResponse.data.data;

            // 기존 할당된 계좌 중에서 accountOptions에 없는 것들을 찾아서 추가
            for (const allocatedAccount of accounts.value) {
              const existsInOptions = accountOptions.value.some((opt) => opt.name === allocatedAccount.name);

              if (!existsInOptions) {
                // 전체 계좌에서 해당 계좌 정보 찾기
                const realAccountInfo = allAccounts.find((acc) => acc.accountName === allocatedAccount.name);

                if (realAccountInfo) {
                  console.log(`🔄 기존 할당 계좌 추가: ${allocatedAccount.name}`);

                  accountOptions.value.push({
                    name: realAccountInfo.accountName,
                    accountNumber: realAccountInfo.accountNumber,
                    memberAccountId: realAccountInfo.memberAccountId || allocatedAccount.memberAccountId,
                    total: Math.floor((realAccountInfo.presentAmount || realAccountInfo.accountBalance || 0) / 10000),
                    remainingAmount: Math.floor(
                      (realAccountInfo.remainingAmount || realAccountInfo.accountBalance || 0) / 10000
                    ),
                  });
                }
              }
            }

            console.log("✅ 수정모드: 최종 계좌 옵션:", accountOptions.value);
          }
        } catch (error) {
          console.error("전체 계좌 정보 가져오기 실패:", error);
        }
      } else {
        // 신규모드에서만 첫 번째 계좌를 기본으로 선택
        if (accountOptions.value.length > 0) {
          accounts.value = [
            {
              name: accountOptions.value[0].name,
              memberAccountId: accountOptions.value[0].memberAccountId,
              accountNumber: accountOptions.value[0].accountNumber,
              percentage: 0,
            },
          ];
          console.log("✅ 신규모드: 기본 계좌 선택:", accounts.value);
        } else {
          console.log("⚠️ 사용 가능한 계좌 없음");
        }
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

  // 중복 클릭 방지
  if (loading.value) {
    console.log("⚠️ 이미 저장 중입니다. 중복 클릭 방지");
    return;
  }

  try {
    loading.value = true;
    console.log("🚀 saveDepositAllocation 시작 - 호출 스택:", new Error().stack?.split("\n")[1]);

    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      depositAccountRegisterReqs: accounts.value.map((account) => {
        const accountInfo = accountOptions.value.find((opt) => opt.name === account.name);
        const allocatedAmount = getAllocatedAmount(account) * 10000; // 만원을 원 단위로 변환

        return {
          goalId: parseInt(localStorage.getItem("currentGoalId") || goalId.value),
          memberAccountId: account.memberAccountId,
          accountNumber: account.accountNumber,
          accountType: "Deposit",
          amount: Math.round(allocatedAmount), // 정수로 변환
          allocatedRate: account.percentage,
          accountAllocatedRate: account.percentage, // 사용자가 설정한 실제 비율
          actionType: "DEPOSIT", // enum 값으로 변경
        };
      }),
    };

    // goalId 정보 확인 및 동기화
    const localStorageGoalId = localStorage.getItem("currentGoalId");
    console.log("🔍 현재 goalId 정보:");
    console.log("  - route.query.goalId:", route.query.goalId);
    console.log("  - localStorage.currentGoalId:", localStorageGoalId);
    console.log("  - 기존 goalId:", goalId.value);

    // localStorage에 올바른 goalId가 있으면 사용
    if (localStorageGoalId && localStorageGoalId !== goalId.value) {
      console.log("📝 localStorage의 goalId로 업데이트:", localStorageGoalId);
      goalId.value = localStorageGoalId;
    }

    console.log("  - 최종 사용 goalId:", goalId.value);

    // 예적금 할당 데이터 저장
    console.log("📡 예적금 할당 API 호출:", requestData);
    const response = await depositService.registerDeposits(memberId.value, requestData);

    console.log("✅ 저장 API 응답:", response);
    console.log("✅ 응답 코드:", response.data?.code);
    console.log("✅ 응답 상태:", response.status);

    if (response.data.code === "GEN-000") {
      isCompleted.value = true; // 완료 상태로 설정 (Goal 삭제 방지)
      console.log("✅ 예적금 할당 성공 - GoalEdit으로 이동");

      // 저장 후 실제 데이터 확인 - DB에 저장된 action 테이블 데이터를 조회해보자
      console.log("🔍 저장 확인 - goalId:", goalId.value, "memberId:", memberId.value);

      // 저장된 데이터 확인용 API 호출
      const verifyData = async () => {
        try {
          const checkResponse = await depositService.getDepositAccountsByGoal(memberId.value, goalId.value);
          console.log("✅ action 테이블 저장 확인:", checkResponse);

          // 사용자의 실제 목표 목록 확인
          try {
            const goalsResponse = await objectApi.getGoalList();
            console.log("🎯 goal 테이블의 실제 목표 목록:", goalsResponse);

            const existingGoals = goalsResponse?.data || [];
            const currentGoalExists = existingGoals.find((goal) => goal.goalId == goalId.value);

            if (!currentGoalExists) {
              console.log(`❌ goalId ${goalId.value}이 goal 테이블에 없습니다!`);
              console.log("💡 해결책 필요: action 테이블에만 저장되고 goal 테이블에는 없는 상태");

              if (existingGoals.length > 0) {
                console.log("📝 실제 존재하는 첫 번째 목표:", existingGoals[0]);
                console.log("💭 이 목표 ID를 사용해서 이동합니다:", existingGoals[0].goalId);

                // 실제 존재하는 goalId로 변경
                goalId.value = existingGoals[0].goalId;
                localStorage.setItem("currentGoalId", goalId.value);
              }
            } else {
              console.log("✅ goalId가 goal 테이블에 존재합니다:", currentGoalExists);
            }
          } catch (goalErr) {
            console.error("❌ 목표 목록 조회 실패:", goalErr);
          }
        } catch (err) {
          console.error("❌ DB 저장 확인 실패:", err);
        }
      };
      verifyData();

      alert("예적금 할당이 완료되었습니다.");
      // GoalEdit으로 돌아가서 최종 완료 처리
      router.push({ path: "/goal/edit", query: { goalId: goalId.value } });
    } else {
      console.error("❌ 예적금 할당 실패:", response.data);
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

// Goal 삭제는 GoalEdit에서만 수동으로 처리
// 자동 삭제 로직 비활성화 (안전성 확보)

// onBeforeUnmount(async () => {
//   // 자동 삭제 비활성화
// });

// window.addEventListener("beforeunload", () => {
//   // 자동 삭제 비활성화
// });

// 컴포넌트 마운트 시 데이터 로딩
onMounted(() => {
  console.log("🚀 컴포넌트 마운트 - goalId 확인:");
  console.log("  - route.params.goalId:", route.params.goalId);
  console.log("  - route.query.goalId:", route.query.goalId);
  console.log("  - route.query.amount:", route.query.amount);
  console.log("  - localStorage.getItem('newGoalId'):", localStorage.getItem("newGoalId"));
  console.log("  - 최종 goalId:", goalId.value);
  console.log("  - 현재 totalGoalAmount:", totalGoalAmount.value);
  console.log("  - 현재 memberId:", memberId.value);

  loadGoalAmount(); // 신규면 바로 종료, 수정이면 loadExistingAllocations + loadAvailableAccounts 호출

  // 신규 모드일 때만 따로 loadAvailableAccounts 호출 (goalId가 없는 경우만)
  if (route.query.amount && Number(route.query.amount) > 0 && !goalId.value) {
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

// 최대 할당 가능 금액 계산 (수정모드 고려)
function getMaxAllocatableAmount(accountName) {
  const accountInfo = getAccountInfo(accountName);
  const goalAmountInWan = Math.floor(totalGoalAmount.value / 10000) || 0;
  const availableAmount = accountInfo?.remainingAmount || 0;

  // 수정모드에서는 현재 목표에 할당된 금액도 수정 가능하므로
  // 실제 사용 가능한 금액은 remainingAmount 전체
  // 전역 isEditMode 사용
  const currentAccount = accounts.value.find((acc) => acc.name === accountName);

  console.log(`🔍 상세 디버그 ${accountName}:`, {
    accountInfo: accountInfo,
    accountInfoExists: !!accountInfo,
    goalAmountInWan,
    availableAmount,
    isEditMode: isEditMode.value,
    currentAccount: currentAccount,
    accountOptions: accountOptions.value.map((opt) => ({
      name: opt.name,
      remaining: opt.remainingAmount,
      total: opt.total,
    })),
  });

  let maxAllocatable = 0;
  if (isEditMode.value && currentAccount) {
    // 수정모드: remainingAmount에 현재 할당분이 포함되어 있으므로 전체 사용 가능
    maxAllocatable = Math.min(goalAmountInWan, availableAmount);
  } else {
    // 신규모드: 기존 로직
    maxAllocatable = Math.min(goalAmountInWan, availableAmount);
  }

  console.log(
    `🎯 최대할당계산 ${accountName}: 목표=${goalAmountInWan}, 잔액=${availableAmount}, 최대할당=${maxAllocatable}, 수정모드=${isEditMode.value}`
  );

  return isNaN(maxAllocatable) ? 0 : Math.max(0, maxAllocatable);
}

// 개별 할당 금액 계산 - 최대 할당 가능 금액 기준으로 비율 적용
function getAllocatedAmount(account) {
  const maxAmount = getMaxAllocatableAmount(account.name) || 0;
  const percentage = account.percentage || 0;
  const result = (maxAmount * percentage) / 100;

  console.log(`💰 할당금액 계산 ${account.name}: 최대=${maxAmount}, 비율=${percentage}%, 결과=${result}`);

  return isNaN(result) ? 0 : result;
}

// 전체 할당 금액
const totalAllocated = computed(() => accounts.value.reduce((sum, acc) => sum + getAllocatedAmount(acc), 0));

// 💡 목표 잔액 계산 (전체 목표 - 할당된 금액) - 모두 원 단위
const leftGoalAmount = computed(() => {
  return totalGoalAmount.value - totalAllocated.value * 10000; // 할당된 금액은 만원 단위이므로 원으로 변환
});

// 퍼센트 업데이트 - 최대 할당 가능 금액 기준으로 변경
function updatePercentage(index, value) {
  const newPercent = Number(value);
  const accountName = accounts.value[index].name;
  const maxAmount = getMaxAllocatableAmount(accountName);

  console.log(`🎯 계좌 ${accountName}: 최대할당=${maxAmount}만원, 비율=${newPercent}%`);

  // 100% = maxAmount이므로 자동으로 할당 가능 금액 초과 방지됨
  accounts.value[index].percentage = newPercent;
}

// 남은 계좌 옵션 계산
const remainingAccountOptions = computed(() => {
  const selectedNames = accounts.value.map((a) => a.name);
  return accountOptions.value.filter((option) => !selectedNames.includes(option.name));
});

// 다음 계좌 자동 추가
function addNextAccount() {
  const remaining = remainingAccountOptions.value;
  if (remaining.length > 0) {
    accounts.value.push({
      name: remaining[0].name,
      memberAccountId: remaining[0].memberAccountId,
      accountNumber: remaining[0].accountNumber,
      percentage: 0,
    });
  }
}

// 선택된 계좌 추가 (기존 함수 유지)
function addSelectedAccount(selectedAccount) {
  accounts.value.push({
    name: selectedAccount.name,
    memberAccountId: selectedAccount.memberAccountId,
    accountNumber: selectedAccount.accountNumber,
    percentage: 0,
  });
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
  return accountOptions.value.filter((option) => {
    // 기본 조건: 이미 선택되지 않았거나 현재 선택된 계좌
    const isAvailableForSelection =
      !selected.includes(option.name) || accounts.value[currentIndex].name === option.name;

    // 신규모드에서는 할당 가능한 계좌만 (remainingAmount > 0)
    const hasAvailableAmount = option.remainingAmount > 0;

    console.log(`🔍 드롭다운 계좌 필터링 ${option.name}:`, {
      isAvailableForSelection,
      hasAvailableAmount,
      remainingAmount: option.remainingAmount,
      final: isAvailableForSelection && hasAvailableAmount,
    });

    return isAvailableForSelection && hasAvailableAmount;
  });
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
    console.error("🚨 accountInfo를 찾을 수 없음:", account.name);
    return [];
  }

  const totalAmount = accountInfo.total || 0; // 전체 계좌 잔액 (만원)
  const currentAllocation = getAllocatedAmount(account) || 0; // 현재 설정한 할당 금액 (만원)

  console.log("📊 BarChart 데이터 계산:", {
    accountName: account.name,
    accountInfo,
    totalAmount,
    currentAllocation,
    percentage: account.percentage,
  });

  // 수정모드 확인 (고정된 모드 사용)
  // 처음 DB 조회 결과에 따라 결정된 모드를 사용

  // 다른 목표에 할당된 금액 계산
  let alreadyAllocated = 0;

  if (isEditMode.value) {
    // 수정모드: 현재 이 목표에 할당된 계좌의 경우,
    // 다른 목표에 할당된 금액만 "할당된 자산"으로 표시
    const currentAccount = accounts.value.find((acc) => acc.name === account.name);
    if (currentAccount) {
      // 수정모드에서는 remainingAmount에 현재 목표 할당분이 이미 포함되어 있음
      // 다른 목표에 할당된 금액 = 전체 - 현재 사용가능한 금액 (현재 목표 할당분 포함)
      alreadyAllocated = Math.max(0, accountInfo.total - accountInfo.remainingAmount);

      console.log(`🔍 수정모드 할당계산 ${account.name}:`, {
        total: accountInfo.total,
        remainingAmount: accountInfo.remainingAmount,
        alreadyAllocated,
        현재할당분포함여부: "remainingAmount에 이미 포함됨",
      });
    } else {
      // 이 계좌가 현재 목표에 할당되지 않은 경우 (계좌 추가할 때)
      alreadyAllocated = accountInfo.total - accountInfo.remainingAmount;
    }
  } else {
    // 신규모드: 전체 할당된 금액
    alreadyAllocated = accountInfo.total - accountInfo.remainingAmount;
  }

  console.log("📊 할당된 자산 계산:", {
    isEditMode: isEditMode.value,
    totalAmount,
    remainingAmount: accountInfo.remainingAmount,
    currentAllocation,
    alreadyAllocated,
  });

  const availableAmount = Math.max(0, accountInfo.remainingAmount - currentAllocation); // 남은 사용 가능 금액

  if (totalAmount === 0) {
    return [{ something: "데이터 없음", value: 100 }];
  }

  // 백분율로 변환 (전체 계좌 잔액 100% 기준)
  const alreadyAllocatedPercent = totalAmount > 0 ? Math.round((alreadyAllocated / totalAmount) * 100) : 0;
  const currentAllocationPercent = totalAmount > 0 ? Math.round((currentAllocation / totalAmount) * 100) : 0;
  const availableAmountPercent = totalAmount > 0 ? Math.round((availableAmount / totalAmount) * 100) : 0;

  console.log("📊 백분율 계산:", {
    alreadyAllocated,
    currentAllocation,
    availableAmount,
    totalAmount,
    alreadyAllocatedPercent,
    currentAllocationPercent,
    availableAmountPercent,
  });

  const result = [
    {
      something: "할당된 자산", // 다른 목표에 이미 할당된 자산
      value: Math.max(isNaN(alreadyAllocatedPercent) ? 0 : alreadyAllocatedPercent, 0),
    },
    {
      something: "선택된 자산", // 현재 슬라이더로 선택한 자산
      value: Math.max(isNaN(currentAllocationPercent) ? 0 : currentAllocationPercent, 0),
    },
    {
      something: "할당 가능자산", // 아직 할당되지 않은 남은 자산
      value: Math.max(isNaN(availableAmountPercent) ? 0 : availableAmountPercent, 0),
    },
  ];

  console.log("📊 최종 BarChart 데이터:", result);
  return result;
}

// 범례용 계산 함수들 (BarChart와 동일한 로직)
function getLegendAllocatedAmount(accountName) {
  const accountInfo = getAccountInfo(accountName);
  if (!accountInfo) return 0;

  // 전역 isEditMode 사용
  const currentAccount = accounts.value.find((acc) => acc.name === accountName);
  const currentAllocation = currentAccount ? getAllocatedAmount(currentAccount) : 0;

  if (isEditMode.value && currentAccount) {
    // 수정모드: 다른 목표에만 할당된 금액
    // remainingAmount에 현재 목표 할당분이 이미 포함되어 있으므로
    return Math.max(0, accountInfo.total - accountInfo.remainingAmount);
  } else {
    // 신규모드: 전체 할당된 금액
    return accountInfo.total - accountInfo.remainingAmount;
  }
}

function getLegendAvailableAmount(accountName) {
  const accountInfo = getAccountInfo(accountName);
  if (!accountInfo) return 0;

  const currentAccount = accounts.value.find((acc) => acc.name === accountName);
  const currentAllocation = currentAccount ? getAllocatedAmount(currentAccount) : 0;

  return Math.max(0, accountInfo.remainingAmount - currentAllocation);
}

// 네비게이션 함수들
function goToAccountLink() {
  // 계좌 연결 페이지로 이동 (실제 라우팅 경로에 맞게 수정 필요)
  router.push("/mypage/edit-account");
}

function goToGoalList() {
  // 목표 목록 페이지로 이동
  router.push("/goal");
}
</script>
