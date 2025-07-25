<template>
  <DefaultLayout>
    <!-- Header -->
    <div class="relative flex items-center py-4">
      <div class="absolute left-0">
        <GoBackButton />
      </div>
      <h1 class="mx-auto text-lg font-semibold">예적금 계좌 할당</h1>
    </div>

    <!-- 목표 할당 금액 -->
    <div class="mb-6">
      <label class="block mb-2 font-medium text-gray-700">목표에 할당할 금액</label>
      <BaseTextInput
        :model-value="isaGoalAmount"
        type="number"
        :placeholder="`${totalGoalAmount}만원`"
        class="w-full max-w-lg mb-3"
        disabled
      />

      <p class="mt-1 text-sm text-gray-400">목표 남은 금액: {{ leftGoalAmount.toLocaleString() }}만원</p>
    </div>

    <!-- 계좌 목록 -->
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
      :disabled="accounts.length >= accountOptions.length"
      class="w-full mb-6 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      ＋ 계좌 추가
    </button>

    <!-- 완료 버튼 -->
    <Button label="예치금 자산 할당 완료"></Button>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import GoBackButton from "@/components/base/GoBackButton.vue";
import BarChart from "@/components/graph/BarChart.vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import Button from "@/components/base/Button.vue";
import GraphsContainer from "@/components/graph/GraphsContainer.vue";

const totalGoalAmount = ref(1000); // 전체 목표 금액 (만원 단위)

// 계좌 옵션 데이터
const accountOptions = [
  { name: "국민 통장", total: 100 },
  { name: "신한 통장", total: 80 },
  { name: "카카오뱅크", total: 120 },
];

// 현재 선택된 계좌들
const accounts = ref([{ name: "국민 통장", percentage: 20 }]);

// 총액 가져오기
function getAccountTotal(accountName) {
  return accountOptions.find((a) => a.name === accountName)?.total ?? 0;
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
  return accountOptions.filter(
    (option) => !selected.includes(option.name) || accounts.value[currentIndex].name === option.name
  );
}

// 금액 포맷
function formatMoney(totalGoalAmount) {
  return totalGoalAmount.toLocaleString() + "만원";
}
</script>
