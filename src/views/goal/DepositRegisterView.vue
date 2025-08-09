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
        :model-value="totalGoalAmount"
        type="number"
        :placeholder="`${totalGoalAmount}만원`"
        class="w-full max-w-lg mb-3"
        disabled
      />

      <p class="mt-1 text-sm text-gray-400">목표 남은 금액: {{ leftGoalAmount.toLocaleString() }}만원</p>
    </div>

    <!-- 계좌 목록 -->
    <div v-if="!loading && !error && accounts.length > 0">
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
          <span>총액: {{ formatMoney(getAccountTotal(account.name)) }}</span>
          <span>할당: {{ formatMoney(getAllocatedAmount(account)) }}</span>
        </div>
      </div>

      <!-- 할당 상태 바차트 -->
      <BarChart
        :data="[
          { name: '식비', value: 40 },
          { name: '교통비', value: 30 },
          { name: '여가', value: 20 },
          { name: '기타', value: 10 },
        ]"
      />
    </GraphsContainer>

    <!-- 계좌 추가 버튼 -->
    <button
      @click="addAccount"
      :disabled="accounts.length >= accountOptions.length || loading"
      class="w-full mb-6 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ＋ 계좌 추가
    </button>
    </div>

    <!-- 완료 버튼 -->
    <div v-if="!loading && !error && accounts.length > 0">
      <Button 
        :label="loading ? '저장 중...' : '예치금 자산 할당 완료'"
        :disabled="loading"
        @click="saveDepositAllocation"
      />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import BarChart from "@/components/graph/BarChart.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import Button from "@/components/base/Button.vue";
import GraphsContainer from "@/components/graph/GraphsContainer.vue";
import { depositService, depositUtils } from "@/services/deposit/depositService.js";

const route = useRoute();
const router = useRouter();

// URL 파라미터에서 goalId와 memberId 가져오기
const goalId = ref(route.params.goalId || route.query.goalId);
const memberId = ref(1); // 임시로 하드코딩, 실제로는 로그인 사용자 정보에서 가져와야 함

const totalGoalAmount = ref(1000); // 전체 목표 금액 (만원 단위)
const loading = ref(false);
const error = ref(null);

// API에서 가져올 데이터들
const accountOptions = ref([]);
const availableAccounts = ref([]);

// 현재 선택된 계좌들
const accounts = ref([]);

// API 호출 함수들
async function loadAvailableAccounts() {
  console.log('🔍 loadAvailableAccounts 시작:', { goalId: goalId.value, memberId: memberId.value });
  
  if (!goalId.value) {
    error.value = 'Goal ID가 필요합니다.';
    console.error('❌ Goal ID 없음');
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    console.log('📡 API 호출 중...', `/account/deposit/available/${memberId.value}?goalId=${goalId.value}`);
    const response = await depositService.getAvailableDeposits(memberId.value, goalId.value);
    console.log('✅ API 응답:', response);
    
    if (response.data.data) {
      availableAccounts.value = response.data.data;
      console.log('📊 받은 계좌 데이터:', availableAccounts.value);
      
      // accountOptions를 API 데이터로 변환
      accountOptions.value = availableAccounts.value.map(account => ({
        name: account.accountName,
        accountNumber: account.accountNumber, 
        memberAccountId: account.memberAccountId,
        total: Math.floor(account.presentAmount / 10000), // 원 단위를 만원 단위로 변환
        remainingAmount: Math.floor(account.remainingAmount / 10000)
      }));
      console.log('🔄 변환된 계좌 옵션:', accountOptions.value);

      // 첫 번째 계좌를 기본으로 선택
      if (accountOptions.value.length > 0) {
        accounts.value = [{ 
          name: accountOptions.value[0].name,
          memberAccountId: accountOptions.value[0].memberAccountId,
          accountNumber: accountOptions.value[0].accountNumber,
          percentage: 0 
        }];
        console.log('✅ 기본 계좌 선택:', accounts.value);
      } else {
        console.log('⚠️ 사용 가능한 계좌 없음');
      }
    } else {
      console.log('❌ 응답 데이터 구조 문제:', response);
    }
  } catch (err) {
    console.error('계좌 정보 로딩 실패:', err);
    error.value = '계좌 정보를 불러오는데 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

async function saveDepositAllocation() {
  if (!goalId.value) {
    alert('Goal ID가 필요합니다.');
    return;
  }

  try {
    loading.value = true;
    
    // API 요청 형식에 맞게 데이터 변환
    const requestData = {
      depositAccountRegisterReqs: accounts.value.map(account => {
        const accountInfo = accountOptions.value.find(opt => opt.name === account.name);
        const allocatedAmount = getAllocatedAmount(account) * 10000; // 만원을 원 단위로 변환
        
        return {
          goalId: parseInt(goalId.value),
          memberAccountId: account.memberAccountId,
          accountNumber: account.accountNumber,
          accountType: '예적금',
          amount: allocatedAmount,
          allocatedRate: account.percentage,
          accountAllocatedRate: 100, // 기본값
          actionType: 'DEPOSIT'
        };
      })
    };

    const response = await depositService.registerDeposits(memberId.value, requestData);
    
    if (response.data.code === 'GEN-000') {
      alert('예적금 할당이 완료되었습니다.');
      router.back(); // 이전 페이지로 돌아가기
    } else {
      throw new Error(response.data.message || '알 수 없는 오류가 발생했습니다.');
    }
  } catch (err) {
    console.error('예적금 할당 실패:', err);
    alert(err.message || '예적금 할당에 실패했습니다.');
  } finally {
    loading.value = false;
  }
}

// 컴포넌트 마운트 시 데이터 로딩
onMounted(() => {
  loadAvailableAccounts();
});

// 총액 가져오기
function getAccountTotal(accountName) {
  const account = accountOptions.value.find((a) => a.name === accountName);
  return account?.total ?? 0;
}

// 개별 할당 금액 계산
function getAllocatedAmount(account) {
  const total = getAccountTotal(account.name);
  return (total * account.percentage) / 100;
}

// 전체 할당 금액
const totalAllocated = computed(() => accounts.value.reduce((sum, acc) => sum + getAllocatedAmount(acc), 0));

// 💡 목표 잔액 계산 (전체 목표 - 할당된 금액)
const leftGoalAmount = computed(() => {
  return totalGoalAmount.value - totalAllocated.value;
});

// 퍼센트 업데이트
function updatePercentage(index, value) {
  const newPercent = Number(value);
  const currentAccount = accounts.value[index];
  const accountTotal = getAccountTotal(currentAccount.name);
  const newAllocation = (accountTotal * newPercent) / 100;

  const otherTotal = accounts.value.reduce((sum, acc, i) => {
    return i === index ? sum : sum + getAllocatedAmount(acc);
  }, 0);

  const maxAllowed = totalGoalAmount.value - otherTotal;
  const maxPercent = Math.floor((maxAllowed / accountTotal) * 100);

  accounts.value[index].percentage = Math.min(newPercent, maxPercent);
}

// 계좌 추가
function addAccount() {
  const remainingOptions = accountOptions
    .map((a) => a.name)
    .filter((name) => !accounts.value.map((a) => a.name).includes(name));
  if (remainingOptions.length > 0) {
    accounts.value.push({ name: remainingOptions[0], percentage: 0 });
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
</script>
