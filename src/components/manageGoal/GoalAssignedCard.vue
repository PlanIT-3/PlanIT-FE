<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-between bg-white rounded-2xl shadow px-10 py-4 w-11/12 max-w-2xl">
    <!-- 은행 로고 -->
    <img :src="imgUrl" alt="은행 로고" class="w-10 h-10 mr-4" />
    <!-- 은행명/상품명 -->
    <div class="flex flex-col flex-1 min-w-0">
      <span class="font-medium text-base truncate">{{ bankName }}</span>
      <span class="text-gray-400 text-sm font-normal">{{ productName }}</span>
    </div>
    <!-- 전체 대비 퍼센트 -->
    <span class="text-blue-600 font-normal text-sm mr-6 whitespace-nowrap"> 전체 대비 {{ percent }}% </span>
    <!-- 금액 -->
    <span class="font-medium text-base whitespace-nowrap">{{ amount }}만원</span>
  </div>
</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  bankName: { type: String, required: true },
  productName: { type: String, required: true },
  percent: { type: [String, Number], required: true },
  amount: { type: [String, Number], required: true },
});

const logos = import.meta.glob('@/assets/icons/bank/*.svg', {
  eager: true,
  import: 'default',
});

const imgUrl = computed(() => {
  const path = `/src/assets/icons/bank/${props.bankName}.svg`;
  return logos[path] || '';
});

</script>
<style scoped></style>
