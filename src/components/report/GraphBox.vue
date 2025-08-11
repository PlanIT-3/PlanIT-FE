<template>
  <div ref="root" class="bg-white rounded-2xl shadow p-4">
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold text-sm">{{ title }}</span>
      <div class="relative">
        <button @click="showDropdown = !showDropdown" class="text-xs text-gray-400 flex items-center gap-1 select-none">
          {{ periodLabel }}
          <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="showDropdown" class="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow z-10">
          <div
            v-for="opt in periodOptions"
            :key="opt.value"
            @click="selectPeriod(opt.value)"
            class="px-3 py-1 text-xs cursor-pointer hover:bg-gray-100"
            :class="{ 'text-blue-600 font-semibold': period === opt.value }"
          >
            {{ opt.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="h-32 flex items-center justify-center text-gray-300">
      <slot>[그래프 영역]</slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { onMounted, onBeforeUnmount } from "vue";

function useClickOutside(elRef, handler) {
  const listener = (event) => {
    if (!elRef.value || elRef.value.contains(event.target)) return;
    handler(event);
  };
  onMounted(() => document.addEventListener("mousedown", listener));
  onBeforeUnmount(() => document.removeEventListener("mousedown", listener));
}

const props = defineProps({
  title: { type: String, required: true },
  period: { type: String, default: "weekly" },
});
const emit = defineEmits(["update:period"]);

const showDropdown = ref(false);
const periodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];
const periodLabel = computed(() => {
  const found = periodOptions.find((opt) => opt.value === props.period);
  return found ? found.label + " ▾" : "Weekly ▾";
});
function selectPeriod(val) {
  emit("update:period", val);
  showDropdown.value = false;
}
// 드롭다운 외부 클릭 시 닫기
const root = ref();
useClickOutside(root, () => {
  showDropdown.value = false;
});
</script>

<style scoped>
.relative {
  position: relative;
}
</style>
