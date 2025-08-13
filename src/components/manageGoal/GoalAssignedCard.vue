<template>
  <div class="flex items-center border border-gray-200 rounded-xl p-4 h-14">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden bg-white">
          <img :src="imgUrl" alt="은행 로고" class="w-8 h-8 object-contain" />
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">{{ bankName }}</p>
          <p class="text-xs text-gray-600">{{ productName }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-blue-600 font-medium">전체 대비 {{ percent }}%</p>
        <p class="text-base font-medium text-gray-800">{{ amount }}원</p>
      </div>
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

const logos = import.meta.glob("@/assets/icons/bank/*.svg", {
  eager: true,
  import: "default",
});

const imgUrl = computed(() => {
  const path = `/src/assets/icons/bank/${props.bankName}.svg`;
  return logos[path] || "";
});
</script>
<style scoped></style>
