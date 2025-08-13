<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <TaxSavingSummaryCard
        title="ISA 계좌"
        :bgColor="'bg-green-50'"
        :principal="summary.principal"
        :tax="summary.isaTax"
        :finalAmount="summary.isaTotalAmount"
        finalAmountColor="text-green-700 font-bold"
      />

      <TaxSavingSummaryCard
        title="일반 계좌"
        :bgColor="'bg-red-50'"
        :principal="summary.principal"
        :tax="summary.generalTax"
        :finalAmount="summary.generalTotalAmount"
        finalAmountColor="text-red-700 font-bold"
      />
    </div>

    <!-- 절세율 요약 카드 -->
    <div class="p-5 rounded-xl shadow-sm w-full bg-blue-50">
      <!-- shadow-md → shadow-sm -->
      <div class="text-base font-semibold mb-2">절세율 요약</div>
      <div class="flex justify-between text-sm">
        <span>절세 금액</span>
        <span class="font-bold text-blue-700">{{ formatNumber(summary.taxSaved) }} 원</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>절세율</span>
        <span class="font-bold text-blue-700">{{ summary.taxSavingRate }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/reprotApi";
import TaxSavingSummaryCard from "./TaxSavingSummaryCard.vue";

const summary = ref({});

const load = async () => {
  try {
    const res = await api.getTaxSavingSummary();
    summary.value = res;
  } catch (err) {
    console.error("getTaxSavingSummary API 호출 실패", err);
  }
};

onMounted(load);

// 3자리마다 콤마 표시, undefined/null 안전 처리
const formatNumber = (num) => {
  if (num == null || isNaN(num)) return "0";
  return num.toLocaleString("ko-KR");
};
</script>
