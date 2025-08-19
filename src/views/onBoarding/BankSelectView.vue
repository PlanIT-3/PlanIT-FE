<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedBanks = ref([]);

const banks = [
  { name: "경남은행", icon: "/src/assets/icons/bank/경남은행.svg", code: "0039" },
  { name: "광주은행", icon: "/src/assets/icons/bank/광주은행.svg", code: "0034" },
  { name: "대구은행", icon: "/src/assets/icons/bank/대구은행.svg", code: "0031" },
  { name: "부산은행", icon: "/src/assets/icons/bank/부산은행.svg", code: "0032" },
  { name: "새마을금고", icon: "/src/assets/icons/bank/새마을금고.svg", code: "0045" },
  { name: "신협은행", icon: "/src/assets/icons/bank/신협.svg", code: "0048" },
  { name: "신한은행", icon: "/src/assets/icons/bank/신한은행.svg", code: "0088" },
  { name: "우리은행", icon: "/src/assets/icons/bank/우리은행.svg", code: "0020" },
  { name: "우체국", icon: "/src/assets/icons/bank/우체국.svg", code: "0071" },
  { name: "전북은행", icon: "/src/assets/icons/bank/전북은행.svg", code: "0037" },
  { name: "제주은행", icon: "/src/assets/icons/bank/제주은행.svg", code: "0035" },
  { name: "하나은행", icon: "/src/assets/icons/bank/하나은행.svg", code: "0081" },
  { name: "한국산업은행", icon: "/src/assets/icons/bank/한국산업은행.svg", code: "0002" },
  { name: "한국씨티은행", icon: "/src/assets/icons/bank/한국씨티은행.svg", code: "0027" },
  { name: "IBK기업은행", icon: "/src/assets/icons/bank/IBK기업은행.svg", code: "0003" },
  { name: "KB국민은행", icon: "/src/assets/icons/bank/KB국민은행.svg", code: "0004" },
  { name: "SC제일은행", icon: "/src/assets/icons/bank/SC제일은행.svg", code: "0023" },
  { name: "수협은행", icon: "/src/assets/icons/bank/수협은행.svg", code: "0007" },
  { name: "농협은행", icon: "/src/assets/icons/bank/농협은행.svg", code: "0011" },
  { name: "케이뱅크", icon: "/src/assets/icons/bank/케이뱅크.svg", code: "0089" },
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

  // 선택된 은행들을 한국어순으로 정렬
  const sortedSelectedBanks = [...selectedBanks.value].sort((a, b) => {
    // 한국어가 영어보다 앞에 오도록
    const aIsKorean = /[가-힣]/.test(a);
    const bIsKorean = /[가-힣]/.test(b);

    if (aIsKorean && !bIsKorean) return -1;
    if (!aIsKorean && bIsKorean) return 1;

    // 둘 다 한국어이거나 둘 다 영어인 경우 사전순 정렬
    return a.localeCompare(b, "ko");
  });

  router.push({
    path: "/certificate-select",
    query: {
      selectedBanks: JSON.stringify(sortedSelectedBanks),
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
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="bank in banks"
          :key="bank.name"
          @click="selectBank(bank)"
          class="flex items-center p-2 rounded-lg transition-all duration-200 cursor-pointer mb-2"
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
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-white">
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
