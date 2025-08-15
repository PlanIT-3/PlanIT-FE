<template>
  <DefaultLayout>
    <div class="flex flex-col w-full">
      <!-- 상단 헤더 -->
      <div class="flex items-center mb-6">
        <div class="absolute left-5">
          <GoBackButton />
        </div>
        <h2 class="text-lg font-bold ml-12">ISA 계좌 할당</h2>
      </div>

      <!-- 목표 금액 입력 -->
      <div class="mb-4 w-full">
        <label class="block text-sm font-medium mb-1">ISA 계좌의 목표 금액(정확 비율의 금액)</label>
        <BaseTextInput
          :model-value="isaGoalAmountRaw.toLocaleString()"
          inputmode="numeric"
          readonly
          :placeholder="`${isaGoalAmountRaw.toLocaleString()}원`"
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
                :value="Number(item.id)"
                v-model="selectedProductIds"
                :disabled="isProductDisabled(item)"
              />
              <div class="flex-1">
                <div class="font-medium text-sm">{{ item.name }}</div>
                <div class="text-xs text-gray-500">{{ item.desc }}</div>
              </div>
              <span class="ml-2">{{ item.amount }}만원</span>
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
        @click="handleSubmit"
      >
        {{ isEditMode ? "ISA 할당 수정 완료 " : "ISA 계좌 할당 완료" }}
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
import { useRoute, useRouter } from "vue-router";
import isaApi from "@/api/isaApi";
import goal from "@/router/goal";
import GoBackButton from "@/components/base/GoBackButton.vue";
use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

const router = useRouter();
const route = useRoute();

const goalId = ref(null);
const isaGoalAmountRaw = ref(0); // 원 단위
const isaGoalAmount = computed(() => Math.round(isaGoalAmountRaw.value / 10000)); //만원 단위

onMounted(() => {
  goalId.value = Number(route.query.goalId);
  isaGoalAmountRaw.value = Number(route.query.amount);
  fetcuProductsPreferEdit(); //편집용 먼저 부르고 => 없으면 일반용
  fetchTaxExemption();
});

// 전체 상품 데이터 (할당/미할당)(API)
const products = ref([]);
// 체크된 상품 id
const selectedProductIds = ref([]);
// 비과세 금액 (API에서 받아옴)
const taxSavedAmount = ref(0);
// 검색어
const search = ref("");

//수정 모드 여부 확인하기
const isEditMode = ref(false);

// 처음 아무것도 을 때 등록 위한 상품 API 호출 및 세팅
async function fetchIsaProducts() {
  try {
    const data = await isaApi.getIsaProducts();
    if (data.status === "OK" && Array.isArray(data.data)) {
      const mapped = data.data.map(mapApiItem);
      products.value = dedupeProducts(mapped);
      normalizeSelectedIds();

      isEditMode.value = false;
    } else {
      console.error("ISA 상품 API 응답 비정상:", data?.message);
    }
  } catch (e) {
    console.error("ISA 상품 불러오기 실패:", e);
  }
}

//편집용 목록 (체크 목록) 우선로딩 => 없으면 일반목록
async function fetcuProductsPreferEdit() {
  try {
    const data = await isaApi.getIsaProductsForEdit(goalId.value);
    if (data.status === "OK" && Array.isArray(data.data)) {
      const mapped = data.data.map((item) => ({ ...mapApiItem(item), checked: !!item.checked }));
      products.value = dedupeProducts(mapped);
      selectedProductIds.value = products.value.filter((p) => p.checked).map((p) => p.id);
      normalizeSelectedIds();
      isEditMode.value = selectedProductIds.value.length > 0;
      return;
    }
    //체크 된 값 없으면 일반 목록으로 가기
    await fetchIsaProducts();
  } catch (e) {
    console.warn("수정용 목록 불러오기 실패 => 일반 목록으로 ", e);
    await fetchIsaProducts();
  }
}
// 비과세 현황 API 호출
async function fetchTaxExemption() {
  try {
    const data = await isaApi.getTaxExemption();
    if (data.status === "OK") {
      taxSavedAmount.value = Math.round(data.data.taxSavedAmount / 10000);
    } else {
      console.error("비과세 현황 응답 비정상:", data?.message);
    }
  } catch (e) {
    console.error("비과세 현황 불러오기 실패:", e);
  }
}

// 상품 필터링
const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  return products.value.filter((item) => item.name.includes(search.value) || item.desc.includes(search.value));
});

// 선택된 상품의 총 금액 (만원 단위)
const selectedTotal = computed(() => {
  return products.value
    .filter((item) => selectedProductIds.value.includes(item.id))
    .reduce((sum, item) => {
      const present = Number(item.presentAmount);
      const qty = Number(item.quantity);
      const amount = Math.round((present * qty) / 10000);
      return sum + amount;
    }, 0);
});

// 목표 남은 금액 (만원 단위)
const remainingAmount = computed(() => {
  // 원 단위에서 선택된 상품 합(원 단위) 빼고 만원 단위로 변환
  const selectedSum = products.value
    .filter((item) => selectedProductIds.value.includes(item.id))
    .reduce((sum, item) => sum + item.presentAmount * item.quantity, 0);
  return Math.round((isaGoalAmountRaw.value - selectedSum) / 10000);
});

// 상품 선택 시 ISA 목표 금액을 초과하지 않도록 체크박스 비활성화
function isProductDisabled(item) {
  // 이미 선택된 경우는 항상 활성
  if (selectedProductIds.value.includes(item.id)) return false;
  // 선택 시 총합이 ISA 목표 금액을 초과하면 비활성
  return selectedTotal.value + Math.round((item.presentAmount * item.quantity) / 10000) > isaGoalAmount.value;
}

// ISA 계좌 할당 완료 버튼 클릭 시 API 호출
async function handleSubmit() {
  try {
    if (isEditMode.value) {
      //수정모드 => 상태 put으로 전달
      const data = await isaApi.editIsaAllocation(
        goalId.value,
        products.value, //전부
        selectedProductIds.value // 선택 된 것들
      );
      if (data.status === "OK") {
        alert("ISA 계좌 할당이 수정되었습니다!");
        router.push({ path: "/goal/edit", query: { goalId: goalId.value } });
      } else {
        alert("오류: " + (data.message || "알 수 없는 오류"));
      }
    }
    //수정 모드 X => 일반모드 => post
    else {
      const data = await isaApi.registerIsaAllocation(goalId.value, selectedProductIds.value);
      if (data.status === "OK") {
        alert("ISA 계좌 할당 완료 !");
        localStorage.removeItem("amount");
        router.push({
          path: "/goal/edit",
          query: { goalId: goalId.value },
        });
      } else {
        alert("오류 : " + data.message);
      }
    }
  } catch (e) {
    alert("API 요청 실패 " + e);
  }
}

/*                       차트들                       */

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

// --- dedupe helpers (추가) ---
const toNum = (v) => Number(v ?? 0);

function mapApiItem(item) {
  return {
    id: toNum(item.memberProductId ?? item.id),
    name: item.itemName ?? item.name,
    desc: `수량: ${toNum(item.quantity)}`,
    presentAmount: toNum(item.presentAmount),
    quantity: toNum(item.quantity),
    amount: Math.round((toNum(item.presentAmount) * toNum(item.quantity)) / 10000),
    checked: !!item.checked,
  };
}
//중복이슈 발생 해결
function dedupeProducts(list) {
  const m = new Map();
  for (const p of list) {
    const prev = m.get(p.id);
    if (!prev) m.set(p.id, p);
    else m.set(p.id, { ...prev, ...p, checked: prev.checked || p.checked }); // 체크는 OR
  }
  return Array.from(m.values());
}

function normalizeSelectedIds() {
  // 숫자화 + 고유화
  selectedProductIds.value = Array.from(new Set(selectedProductIds.value.map((x) => Number(x))));
}
</script>
