<template>
  <div class="flex items-center border border-gray-200 rounded-xl p-4 h-14">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center">
        <div class="rounded-full flex items-center justify-center mr-2">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span class="text-white text-xs font-bold">ISA</span>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-800">{{ itemName }}</p>
          <p class="text-xs text-gray-600">{{ quantity }}주 보유</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs text-blue-600 font-medium">목표 대비 {{ percent }}%</p>
        <p class="text-base font-medium text-gray-800">{{ formattedIsaBalance }}원</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  itemName: { type: String, required: true },
  presentAmount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  isaBalance: { type: Number, required: true },
  percent: { type: [String, Number], required: true },
});

const formattedIsaBalance = computed(() => {
  return Math.round(props.isaBalance).toLocaleString();
});
</script>

<style scoped></style>
