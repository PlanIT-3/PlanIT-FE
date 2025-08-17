<template>
  <div class="w-full">
    <!-- 상단 탭 -->
    <!-- <div class="flex justify-around -mt-6">
        <button @click="goToAlarm" class="flex flex-col items-center">
          <span class="font-bold">최근 알림</span>
          <div class="mt-4 h-[3px] w-[160px] bg-gray-300"></div>
        </button>
        <button class="flex flex-col items-center">
          <span class="font-bold">알림설정</span>
          <div class="mt-4 h-[3px] w-[160px] bg-[#433D8B] rounded-full"></div>
        </button>
      </div> -->

    <!-- 알림 콘텐츠-->
    <div class="">
      <!-- 기본설정알림 -->
      <div class="flex justify-between items-center border-b border-gray-300 pb-2">
        <p class="text-sm font-semibold text-gray-600">기본설정</p>
      </div>
      <AlarmToggle title="푸시 알림 받기" v-model="pushEnabled" />

      <!-- 목표 달성 알림 설정 -->
      <div class="flex justify-between items-center border-b border-gray-300 pb-2 mt-6">
        <p class="text-sm font-semibold text-gray-600">목표 달성 알림 설정</p>
      </div>
      <AlarmToggle title="목표 달성 알림 받기" v-model="goalAchievementEnabled" />

      <!-- 달성률 설정 아코디언 버튼 -->

      <!-- 상품 알림 설정 -->
      <div class="flex justify-between items-center border-b border-gray-300 pb-2 mt-6">
        <p class="text-sm font-semibold text-gray-600">상품 알림 설정</p>
      </div>
      <AlarmToggle title="목표금액 달성 알림 받기" v-model="productAlertEnabled" />

      <!-- 상품별 목표가 설정 -->
      <div v-if="productAlertEnabled" class="ml-4 mt-6 space-y-3">
        <button
          @click="showProductOptions = !showProductOptions"
          class="flex items-center gap-1 text-sm text-[#433D8B]"
        >
          <svg
            v-if="showProductOptions"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 15.75L12 8.25 4.5 15.75" />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 8.25L12 15.75 19.5 8.25" />
          </svg>

          <span class="text-xs text-gray-400">보유 상품의 목표가를 설정하세요</span>
        </button>

        <!-- 토클 열면 보유 상품 목록 -->
        <div v-if="showProductOptions" class="space-y-2">
          <div v-for="product in ownedProducts" :key="product.code" class="border border-gray-300 rounded-lg p-4">
            <!-- 상품 정보 및 토글 -->
            <div class="flex justify-between items-center mb-2">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold">{{ product.name }}</span>
                  <label class="relative inline-block w-8 h-4 cursor-pointer">
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      :checked="selectedProducts.includes(product.code)"
                      @change="toggleProduct(product.code, $event.target.checked)"
                    />
                    <div class="w-8 h-4 bg-gray-300 peer-checked:bg-[#433D8B] rounded-full transition-colors"></div>
                    <div
                      class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4"
                    ></div>
                  </label>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{{ product.code }}</span>
                  <span>현재가: {{ product.currentPrice.toLocaleString() }}원</span>
                </div>
              </div>
            </div>

            <!-- 목표가 입력 (선택된 상품만 표시) -->
            <div v-if="selectedProducts.includes(product.code)" class="mt-3 pt-3 border-t border-gray-200">
              <div class="flex items-center space-x-2">
                <label class="text-xs text-gray-600 whitespace-nowrap">목표가:</label>
                <div class="flex-1 relative">
                  <input
                    type="number"
                    :value="productTargets[product.code] || ''"
                    @input="updateProductTarget(product.code, $event.target.value)"
                    placeholder="목표가 입력"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#433D8B]"
                  />
                  <span class="absolute right-3 top-2 text-xs text-gray-500">원</span>
                </div>
              </div>

              <!-- 목표가 대비 현재가 비교 -->
              <div v-if="productTargets[product.code]" class="mt-2 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">현재가 대비:</span>
                  <span
                    :class="getTargetDifferenceClass(product.currentPrice, productTargets[product.code])"
                    class="font-medium"
                  >
                    {{ getTargetDifferenceText(product.currentPrice, productTargets[product.code]) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 선택된 상품이 없을 때 메시지 -->
          <div v-if="selectedProducts.length === 0" class="text-center py-4 text-gray-500 text-sm">
            상품을 선택하여 목표가를 설정하세요
          </div>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="mt-8 mb-6">
        <button
          @click="saveSettings"
          class="w-full bg-[#433D8B] text-white py-3 rounded-lg font-medium hover:bg-[#716BBE] transition-colors"
        >
          설정 저장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import AlarmToggle from "@/components/alarm/AlarmSettingItem.vue";

const router = useRouter();

// 기본 설정
const pushEnabled = ref(true);
const showMilestoneOptions = ref(true);
const showProductOptions = ref(true);

// 목표 달성 알림 설정
const goalAchievementEnabled = ref(true);
const milestones = ref([10, 20, 30, 50, 70, 100]);
const selectedMilestones = ref([10, 20, 30]);

// 상품 알림 설정
const productAlertEnabled = ref(true);

// 보유 상품 목록 (실제로는 API에서 가져옴)
const ownedProducts = ref([
  {
    code: "005930",
    name: "삼성전자",
    currentPrice: 74500,
    quantity: 10,
  },
  {
    code: "000660",
    name: "KODEX 200 ETF",
    currentPrice: 89200,
    quantity: 5,
  },
  {
    code: "035420",
    name: "NAVER",
    currentPrice: 185000,
    quantity: 3,
  },
]);

// 선택된 상품들과 목표가
const selectedProducts = ref(["005930", "035420"]);
const productTargets = ref({
  "005930": 80000,
  "035420": 200000,
});

// watch 설정
watch(goalAchievementEnabled, (newValue) => {
  if (newValue) {
    showMilestoneOptions.value = true;
  }
});

watch(productAlertEnabled, (newValue) => {
  if (newValue) {
    showProductOptions.value = true;
  }
});

// 메서드
const goToAlarm = () => {
  router.push("/alarm");
};

const toggleMilestone = (milestone, checked) => {
  if (checked) {
    selectedMilestones.value.push(milestone);
  } else {
    selectedMilestones.value = selectedMilestones.value.filter((m) => m !== milestone);
  }
};

const toggleProduct = (productCode, checked) => {
  if (checked) {
    selectedProducts.value.push(productCode);
  } else {
    selectedProducts.value = selectedProducts.value.filter((p) => p !== productCode);
    // 선택 해제시 목표가도 삭제
    delete productTargets.value[productCode];
  }
};

const updateProductTarget = (productCode, value) => {
  if (value && !isNaN(value)) {
    productTargets.value[productCode] = parseInt(value);
  } else {
    delete productTargets.value[productCode];
  }
};

const getTargetDifferenceText = (currentPrice, targetPrice) => {
  const difference = targetPrice - currentPrice;
  const percentage = ((difference / currentPrice) * 100).toFixed(1);

  if (difference > 0) {
    return `+${difference.toLocaleString()}원 (+${percentage}%)`;
  } else if (difference < 0) {
    return `${difference.toLocaleString()}원 (${percentage}%)`;
  } else {
    return "목표가 달성";
  }
};

const getTargetDifferenceClass = (currentPrice, targetPrice) => {
  const difference = targetPrice - currentPrice;

  if (difference > 0) {
    return "text-red-600"; // 목표가가 더 높음 (상승 필요)
  } else if (difference < 0) {
    return "text-blue-600"; // 목표가가 더 낮음 (이미 초과)
  } else {
    return "text-green-600"; // 목표가 달성
  }
};

const saveSettings = () => {
  const settings = {
    pushEnabled: pushEnabled.value,
    goalAchievement: {
      enabled: goalAchievementEnabled.value,
      milestones: selectedMilestones.value,
    },
    productAlert: {
      enabled: productAlertEnabled.value,
      products: selectedProducts.value
        .map((code) => ({
          code,
          targetPrice: productTargets.value[code],
        }))
        .filter((p) => p.targetPrice),
    },
  };

  console.log("저장된 설정:", settings);
  alert("알림 설정이 저장되었습니다.");
};
</script>
