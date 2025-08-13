<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedBanks = ref([]);

const banks = [
  { name: "BNK경남은행", icon: "/src/assets/icons/bank/BNK.svg" },
  { name: "BNK부산은행", icon: "/src/assets/icons/bank/BNK.svg" },
  { name: "IBK기업은행", icon: "/src/assets/icons/bank/IBK.svg" },
  { name: "KB국민은행", icon: "/src/assets/icons/bank/KB.svg" },
  { name: "NH농협은행", icon: "/src/assets/icons/bank/농협.svg" },
  { name: "SC제일은행", icon: "/src/assets/icons/bank/SC제일.svg" },
  { name: "SH수협은행", icon: "/src/assets/icons/bank/Sh수협.svg" },
  { name: "iM뱅크", icon: "/src/assets/icons/bank/iM.svg" },
  { name: "광주은행", icon: "/src/assets/icons/bank/광주.svg" },
  { name: "농협", icon: "/src/assets/icons/bank/농협.svg" },
  { name: "대한민국", icon: "/src/assets/icons/bank/한국투자.svg" },
  { name: "새마을금고", icon: "/src/assets/icons/bank/MG새마을금고.svg" },
  { name: "신한은행", icon: "/src/assets/icons/bank/신한.svg" },
  { name: "신협", icon: "/src/assets/icons/bank/신협.svg" },
  { name: "씨티은행", icon: "/src/assets/icons/bank/씨티.svg" },
  { name: "우리은행", icon: "/src/assets/icons/bank/우리.svg" },
  { name: "우체국", icon: "/src/assets/icons/bank/우체국.svg" },
  { name: "전북은행", icon: "/src/assets/icons/bank/전북.svg" },
  { name: "제주은행", icon: "/src/assets/icons/bank/제주.svg" },
  { name: "지역농협", icon: "/src/assets/icons/bank/농협.svg" },
  { name: "카카오뱅크", icon: "/src/assets/icons/bank/카카오뱅크.svg" },
  { name: "케이뱅크", icon: "/src/assets/icons/bank/케이뱅크.svg" },
  { name: "토스뱅크", icon: "/src/assets/icons/bank/토스.svg" },
  { name: "하나은행", icon: "/src/assets/icons/bank/하나.svg" },
  { name: "한국산업은행", icon: "/src/assets/icons/bank/한국투자.svg" },
];

function selectBank(bank) {
  const idx = selectedBanks.value.findIndex((b) => b === bank.name);
  if (idx === -1) {
    selectedBanks.value.push(bank.name);
  } else {
    selectedBanks.value.splice(idx, 1);
  }
}

function onNext() {
  if (selectedBanks.value.length === 0) {
    alert("은행을 선택하세요.");
    return;
  }
  router.push({
    path: "/certificate-select",
    query: {
      selectedBanks: JSON.stringify(selectedBanks.value),
    },
  });
}
</script>

<template>
  <div class="w-full h-full bg-white flex flex-col">
    <!-- 헤더 -->
    <div class="text-center py-8 flex-shrink-0">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">은행선택</h1>
      <h2 class="text-lg text-gray-600 text-left ml-8">은행</h2>
    </div>

    <!-- 은행 선택 그리드 -->
    <div class="flex-1 px-8 pb-24 overflow-y-auto">
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="bank in banks"
          :key="bank.name"
          @click="selectBank(bank)"
          class="flex items-center p-4 rounded-lg transition-all duration-200 cursor-pointer"
          :class="selectedBanks.includes(bank.name) ? 'bg-[#433D8B]/5' : 'bg-white hover:bg-gray-50'"
        >
          <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
            <img :src="bank.icon" :alt="bank.name" class="w-8 h-8" />
          </div>
          <span class="text-sm font-medium text-gray-900 whitespace-nowrap">{{ bank.name }}</span>
        </div>
      </div>
    </div>

    <!-- 다음 버튼 -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
      <button
        @click="onNext"
        class="w-full bg-[#433D8B] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#433D8B]/90 transition-colors"
        :disabled="selectedBanks.length === 0"
        :class="selectedBanks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''"
      >
        다음
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
