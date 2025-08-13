<template>
  <div :class="['p-5 rounded-xl shadow-sm w-full', bgColor]">
    <!-- shadow-md → shadow-sm -->
    <div class="space-y-2">
      <div v-if="title" class="text-base font-semibold">{{ title }}</div>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span>원금</span>
          <span class="text-black">{{ formatNumber(principal) }} 원</span>
        </div>
        <div class="flex justify-between">
          <span>- 세금</span>
          <span class="text-black">{{ formatNumber(tax) }} 원</span>
        </div>

        <!-- 총액 위 구분선 -->
        <div class="border-t border-gray-300 my-1"></div>

        <div class="flex justify-between font-semibold">
          <span>최종</span>
          <span :class="finalAmountColor">{{ formatNumber(finalAmount) }} 원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  principal: { type: Number, required: true },
  tax: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
  finalAmountColor: { type: String, default: "text-black font-bold" },
  bgColor: { type: String, default: "bg-white" },
});

const formatNumber = (num) => {
  if (num == null || isNaN(num)) return "0";
  return num.toLocaleString("ko-KR");
};
</script>
