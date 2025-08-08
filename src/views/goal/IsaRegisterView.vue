<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 상단 헤더 -->
      <div class="flex items-center mb-6">
        <h2 class="text-lg font-bold">ISA 계좌 할당</h2>
      </div>

      <!-- 목표 금액 입력 -->
      <div class="mb-4 w-full">
        <label class="block text-sm font-medium mb-1">ISA 계좌의 목표 금액(정확 비율의 금액)</label>
        <BaseTextInput
          :model-value="isaGoalAmount"
          type="number"
          :placeholder="`${totalGoalAmount}만원`"
          class="w-full max-w-lg mb-3"
          disabled
        />
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>목표 남은 금액: {{ remainingAmount.toLocaleString() }}만원</span>
          <span>비과세 현황: {{ taxSavedAmount.toLocaleString() }} / {{ isaGoalAmount.toLocaleString() }}</span>
        </div>
      </div>

      <!-- 상품 선택 -->
      <div class="mb-4 w-full">
        <div class="flex items-center justify-between mb-2">
          <span class="font-semibold">상품 선택</span>
          <input type="text" v-model="search" placeholder="검색" class="border rounded px-2 py-1 text-xs w-32" />
        </div>
        <div class="max-h-40 overflow-y-auto rounded p-2">
          <template v-for="item in filteredProducts" :key="item.id">
            <label class="flex items-center py-1 cursor-pointer">
              <input
                type="checkbox"
                class="mr-2"
                :value="item.id"
                v-model="selectedProductIds"
                :disabled="isProductDisabled(item)"
              />
              <div class="flex-1">
                <div class="font-medium text-sm">{{ item.name }}</div>
                <div class="text-xs text-gray-500">{{ item.desc }}</div>
              </div>
              <span class="ml-2">{{ item.priceOnly }}만원</span>
            </label>
          </template>
          <div v-if="filteredProducts.length === 0" class="text-xs text-gray-400 text-center py-2">
            검색 결과가 없습니다.
          </div>
        </div>
      </div>

      <!-- 총 선택된 금액 -->
      <div class="mb-4 text-right">
        <span class="font-semibold">총 선택된 금액 </span>
        <span class="text-blue-600 font-bold">{{ selectedTotal.toLocaleString() }}만원</span>
      </div>

      <!-- 도넛 차트 -->
      <div class="relative flex justify-center mb-6" style="height: 160px">
        <v-chart :option="chartOption" autoresize style="width: 160px; height: 160px" />
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="text-3xl font-bold text-gray-400">{{ donutPercent }}%</span>
        </div>
      </div>

      <!-- 완료 버튼 -->
      <button
        class="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded font-bold text-base"
        :disabled="selectedTotal > isaGoalAmount"
        @click="handleIsaRegister"
      >
        ISA 계좌 할당 완료
      </button>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { useRouter } from "vue-router";

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);
// 전체 목표 금액(예: 3,000만원) - 실제로는 props로 받을 것
const totalGoalAmount = 3000;
// ISA 계좌 목표 금액 (전 페이지에서 넘어온 값, 원 단위 → 만원 단위로 변환)
const isaGoalAmountRaw = Number(localStorage.getItem("isaTargetAmount")) || 0; // 원 단위
const isaGoalAmount = ref(Math.round(isaGoalAmountRaw / 10000)); // 만원 단위
const router = useRouter();
// 상품 데이터 (API에서 받아옴)
const products = ref([]);
// 비과세 금액 (API에서 받아옴)
const taxSavedAmount = ref(0);
// 검색어
const search = ref("");
// 선택된 상품 id
const selectedProductIds = ref([]);

// 상품 API 호출 및 세팅
async function fetchIsaProducts() {
  try {
    const res = await fetch("http://localhost:8080/auth/api/account/isa");
    const json = await res.json();
    if (json.status === "OK" && Array.isArray(json.data)) {
      products.value = json.data.map((item) => ({
        id: item.memberProductId,
        name: item.itemName,
        desc: `수량: ${item.quantity}`,
        amount: Math.round((item.presentAmount * item.quantity) / 10000), // 계산용
        priceOnly: Math.round(item.presentAmount / 10000), // 표시용
        presentAmount: item.presentAmount, // 원본 가격(원)
        quantity: item.quantity, // 원본 수량
      }));
    }
  } catch (e) {
    // 에러 핸들링 (필요시)
    console.error("ISA 상품 불러오기 실패", e);
  }
}

// 비과세 현황 API 호출
async function fetchTaxExemption() {
  try {
    const res = await fetch("http://localhost:8080/auth/api/account/isa/tax");
    const json = await res.json();
    if (json.status === "OK") {
      taxSavedAmount.value = Math.round(json.data.taxSavedAmount / 10000); // 만원 단위로 변환
    }
  } catch (e) {
    console.error("비과세 현황 불러오기 실패", e);
  }
}

onMounted(() => {
  fetchIsaProducts();
  fetchTaxExemption();
});

// 상품 필터링
const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  return products.value.filter((item) => item.name.includes(search.value) || item.desc.includes(search.value));
});

// 선택된 상품의 총 금액 (만원 단위)
const selectedTotal = computed(() => {
  return products.value
    .filter((item) => selectedProductIds.value.includes(item.id))
    .reduce((sum, item) => sum + Math.round((item.presentAmount * item.quantity) / 10000), 0);
});

// 목표 남은 금액 (만원 단위)
const remainingAmount = computed(() => {
  // 원 단위에서 선택된 상품 합(원 단위) 빼고 만원 단위로 변환
  const selectedSum = products.value
    .filter((item) => selectedProductIds.value.includes(item.id))
    .reduce((sum, item) => sum + item.presentAmount * item.quantity, 0);
  return Math.round((isaGoalAmountRaw - selectedSum) / 10000);
});

// 도넛 차트 비율 (만원 단위 기준)
const donutPercent = computed(() => {
  if (!isaGoalAmount.value) return 0;
  return Math.round((selectedTotal.value / isaGoalAmount.value) * 100);
});

// 차트 색상 팔레트
const chartColors = [
  "#1e3a8a", // 진한 파랑
  "#2563eb", // 파랑
  "#0ea5e9", // 하늘
  "#38bdf8", // 밝은 하늘
  "#6366f1", // 보라
  "#f59e42", // 주황
  "#10b981", // 초록
];

// 도넛 차트 데이터 (만원 단위 기준)
const selectedChartData = computed(() => {
  const selected = products.value
    .filter((item) => selectedProductIds.value.includes(item.id))
    .map((item, idx) => ({
      value: Math.round((item.presentAmount * item.quantity) / 10000),
      name: item.name,
      itemStyle: { color: chartColors[idx % chartColors.length] },
    }));
  const total = selected.reduce((sum, item) => sum + item.value, 0);
  if (isaGoalAmount.value > total) {
    selected.push({
      value: isaGoalAmount.value - total,
      name: "미할당",
      itemStyle: { color: "#e5e7eb" },
      label: { show: false },
      tooltip: { show: false },
    });
  }
  return selected;
});
// ECharts 옵션
const chartOption = computed(() => ({
  tooltip: {
    trigger: "item",
    formatter: (params) => `${params.name}: ${params.value}만원 (${params.percent}%)`,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderColor: "#ccc",
    borderWidth: 1,
    textStyle: { color: "#fff", fontSize: 13 },
  },
  series: [
    {
      name: "ISA 종목별 비중",
      type: "pie",
      radius: ["60%", "85%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: "#fff",
        borderWidth: 2,
        shadowBlur: 8,
        shadowColor: "rgba(0, 0, 0, 0.08)",
      },
      label: { show: false },
      data: selectedChartData.value,
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: (idx) => Math.random() * 200,
    },
  ],
}));

// 상품 선택 시 ISA 목표 금액을 초과하지 않도록 체크박스 비활성화
function isProductDisabled(item) {
  // 이미 선택된 경우는 항상 활성
  if (selectedProductIds.value.includes(item.id)) return false;
  // 선택 시 총합이 ISA 목표 금액을 초과하면 비활성
  return selectedTotal.value + Math.round((item.presentAmount * item.quantity) / 10000) > isaGoalAmount.value;
}

// ISA 계좌 할당 완료 버튼 클릭 시 API 호출
async function handleIsaRegister() {
  // goalId는 예시로 1로 고정(필요시 동적으로 변경)
  const goalId = 1;
  const reqBody = {
    isaAccountProductRegisterReqs: selectedProductIds.value.map((id) => {
      return {
        goalId,
        memberProductId: id,
        accountType: "ISA",
      };
    }),
  };
  try {
    const res = await fetch("http://localhost:8080/auth/api/account/isa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });
    const json = await res.json();
    if (json.status === "OK") {
      alert("ISA 계좌 할당이 완료되었습니다!");
      // 완료 시 로컬 스토리지 정리 및 이동
      localStorage.removeItem("goalId");
      localStorage.removeItem("isaTargetAmount");
      router.push("/goal/edit");
      // 필요시 라우팅 등 추가
    } else {
      alert("오류: " + (json.message || "알 수 없는 오류"));
    }
  } catch (e) {
    alert("API 요청 실패: " + e);
  }
}
</script>
