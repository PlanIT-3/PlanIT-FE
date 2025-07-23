<template>
  <div class="flex items-center justify-between bg-white rounded-2xl shadow px-6 py-4 w-full max-w-2xl">
    <!-- 은행 로고 -->
    <img :src="imgUrl" alt="은행 로고" class="w-12 h-12 mr-4" />
    <!-- 은행명/상품명 -->
    <div class="flex flex-col flex-1 min-w-0">
      <span class="font-semibold text-lg truncate">{{ bankName }}</span>
      <span class="text-gray-400 text-base">{{ productName }}</span>
    </div>
    <!-- 전체 대비 퍼센트 -->
    <span class="text-blue-600 font-medium text-base mr-6 whitespace-nowrap"> 전체 대비 {{ percent }}% </span>
    <!-- 금액 -->
    <span class="font-semibold text-lg whitespace-nowrap">{{ amount }}만원</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

defineProps({
  // bankLogo: { type: String, required: true },
  bankName: { type: String, required: true },
  productName: { type: String, required: true },
  percent: { type: [String, Number], required: true },
  amount: { type: [String, Number], required: true },
});

const imgUrl = computed(() => {
  return new URL(`@/assets/icons/bank/${props.bankName}.svg`, import.meta.url).href;
});
</script>
<style scoped></style>
