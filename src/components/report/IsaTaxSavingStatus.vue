<template>
  <div class="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div>
          <h3 class="text-base font-bold text-gray-800">ISA 비과세 한도 사용 현황</h3>
          <p class="text-xs text-gray-600">
            2024년 연간 한도 {{ formatAmount(taxData.maxTaxSavingLimit) }} 중 사용 현황
          </p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">데이터를 불러오는 중...</span>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 mb-2">⚠️ 데이터를 불러오는데 실패했습니다</p>
      <button @click="fetchTaxData" class="text-blue-600 hover:text-blue-800 underline">다시 시도</button>
    </div>

    <div v-else class="space-y-4">
      <!-- 사용 금액 라벨 -->
      <div class="mb-2 flex justify-between items-center">
        <span class="text-xs font-medium text-gray-700">사용 금액</span>
        <span class="text-xs font-semibold">{{ formatAmount(taxData.currentTaxSaving) }}</span>
      </div>

      <!-- 진행률 바 -->
      <div class="relative w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
          class="bg-gray-800 h-4 rounded-full transition-all duration-700 ease-out"
          :style="{ width: Math.min(usagePercentage, 100) + '%' }"
        ></div>
        <!-- 진행률 텍스트 (바 안에) -->
        <div
          v-if="usagePercentage > 15"
          class="absolute inset-0 flex items-center justify-start pl-4 text-white text-xs font-semibold"
        >
          {{ Math.round(usagePercentage) }}%
        </div>
        <!-- 진행률 텍스트 (바 밖에) -->
        <div
          v-else
          class="absolute inset-0 flex items-center justify-start text-gray-600 text-xs font-semibold"
          :style="{ paddingLeft: usagePercentage + 2 + '%' }"
        >
          {{ Math.round(usagePercentage) }}%
        </div>
      </div>

      <!-- 하단 정보 -->
      <div class="flex justify-between items-center text-xs">
        <span class="text-gray-600"
          >사용률: <strong class="text-gray-800">{{ Math.round(usagePercentage) }}%</strong></span
        >
        <span class="text-gray-600"
          >남은 한도: <strong class="text-gray-800">{{ formatAmount(taxData.remainingTaxSaving) }}</strong></span
        >
      </div>

      <!-- 안내 메시지 -->
      <div class="flex items-start mt-4 p-3 bg-blue-100 rounded-lg">
        <div class="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-0.5 mr-2">
          <span class="text-white text-xs font-bold flex items-center justify-center w-full h-full">i</span>
        </div>
        <p class="text-xs text-gray-700">
          연말까지 <strong>{{ formatAmount(taxData.remainingTaxSaving) }}</strong> 더 투자하면<br />
          비과세 한도를 최대한 활용할 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api";
import { ref, computed, onMounted } from "vue";

const loading = ref(false);
const error = ref(false);
const taxData = ref({
  maxTaxSavingLimit: 0,
  currentTaxSaving: 0,
  remainingTaxSaving: 0,
  usageRate: 0,
});

const usagePercentage = computed(() => {
  return taxData.value.usageRate || 0;
});

const formatAmount = (amount) => {
  if (!amount) return "0원";

  const num = Number(amount);
  if (isNaN(num)) return "0원";

  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억원`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}만원`;
  } else {
    return `${num.toLocaleString()}원`;
  }
};

const fetchTaxData = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await api.get("/api/isa/reports/tax-saving-status");
    console.log("API 응답:", response);

    // response.data.data에서 실제 데이터 추출
    taxData.value = response.data.data || {
      maxTaxSavingLimit: 0,
      currentTaxSaving: 0,
      remainingTaxSaving: 0,
      usageRate: 0,
    };
    console.log("ISA 비과세 한도 데이터:", taxData.value);
  } catch (err) {
    console.error("ISA 비과세 한도 데이터 가져오기 실패:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTaxData();
});
</script>
