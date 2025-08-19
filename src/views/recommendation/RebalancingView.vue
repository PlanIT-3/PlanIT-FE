<template>
  <div class="space-y-4">
    <!-- 헤더 (항상 표시) -->
    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">리밸런싱 제안</h1>
          <p class="text-xs text-gray-500 mt-1">포트폴리오 최적화</p>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">총 제안</div>
          <div class="text-sm font-bold text-gray-900">{{ apiData.length }}건</div>
        </div>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="w-8 h-8 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>

    <!-- 데이터 로딩 완료 시 화면 -->
    <div v-else class="space-y-4">
      <div
        v-for="(items, goalName) in groupedData"
        :key="goalName"
        class="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <!-- 목표 헤더 -->
        <div class="bg-gray-50 p-2 border-b border-gray-200 rounded-t-lg">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">{{ goalName }}</h2>
            <span class="text-xs text-gray-500">{{ items.length }}개</span>
          </div>
        </div>

        <!-- 제안 카드 -->
        <div class="p-3 space-y-3">
          <div
            v-for="item in items"
            :key="item.mpCode"
            class="border border-gray-200 rounded-lg p-3 hover:shadow transition-shadow bg-white"
          >
            <!-- 카드 헤더 -->
            <div class="flex items-center justify-between mb-3">
              <div
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium text-white',
                  item.action === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500',
                ]"
              >
                {{ item.action === "BUY" ? "매수" : "매도" }}
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-semibold text-gray-900">{{ item.mpName }}</h3>
                <p class="text-[10px] text-gray-500">{{ item.mpCode }}</p>
              </div>
            </div>

            <!-- 금액 정보 -->
            <div class="grid grid-cols-2 gap-2 mb-3">
              <InfoCard title="현재 투자금액" :value="item.mpTotal" />
              <InfoCard title="ISA 목표금액" :value="item.targetIsaAmount" />
              <InfoCard :title="item.action === 'BUY' ? '매수 필요금액' : '매도 필요금액'" :value="item.tradeAmount" />
              <InfoCard title="사용가능 현금" :value="item.deposit" />
            </div>

            <!-- 제안 이유 -->
            <div class="bg-blue-50 border border-gray-200 rounded-lg p-2">
              <p class="text-xs text-gray-600">{{ item.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 푸터 -->
    <div class="text-center text-[9px] text-gray-400">* 리밸런싱 제안은 시장 상황에 따라 변경될 수 있습니다.</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import InfoCard from "@/components/rebalance/InfoCard.vue";
import { getRebalance } from "@/api/rebalanceApi";

const apiData = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const result = await getRebalance();
    apiData.value = result;
  } catch (error) {
    console.error("리밸런싱 데이터 불러오기 실패:", error);
  } finally {
    loading.value = false;
  }
});

const groupedData = computed(() => {
  return apiData.value.reduce((acc, item) => {
    if (!acc[item.goalName]) acc[item.goalName] = [];
    acc[item.goalName].push(item);
    return acc;
  }, {});
});
</script>
