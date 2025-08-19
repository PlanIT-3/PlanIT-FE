<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const selectedSecurities = ref([]);
const selectedBanks = ref([]);

const securities = [
  { name: "유안타증권", icon: "/src/assets/icons/securities/유안타.svg", code: "0209" },
  { name: "미래에셋증권", icon: "/src/assets/icons/securities/미래에셋.svg", code: "0238" },
  { name: "한국투자증권", icon: "/src/assets/icons/securities/한국투자.svg", code: "0243" },
  { name: "교보증권", icon: "/src/assets/icons/securities/교보.png", code: "0261" },
  { name: "LS증권", icon: "/src/assets/icons/securities/LS.svg", code: "0265" },
  { name: "대신증권", icon: "/src/assets/icons/securities/대신.svg", code: "0267" },
  { name: "한화투자증권", icon: "/src/assets/icons/securities/한화.svg", code: "0269" },
  { name: "신한금융투자", icon: "/src/assets/icons/securities/신한투자.png", code: "0278" },
  { name: "유진투자증권", icon: "/src/assets/icons/securities/유진.svg", code: "0280" },
  { name: "NH투자증권", icon: "/src/assets/icons/securities/NH투자.png", code: "0247" },
  { name: "IBK투자증권", icon: "/src/assets/icons/securities/IBK투자.svg", code: "0225" },
  { name: "KB증권", icon: "/src/assets/icons/securities/KB.png", code: "0218" },
  { name: "삼성증권", icon: "/src/assets/icons/securities/삼성.png", code: "0240" },
  { name: "키움증권", icon: "/src/assets/icons/securities/키움.svg", code: "0264" },
  { name: "SK증권", icon: "/src/assets/icons/securities/SK.svg", code: "0266" },
  { name: "하나금융투자", icon: "/src/assets/icons/securities/하나.svg", code: "0270" },
  { name: "DB금융투자", icon: "/src/assets/icons/securities/DB.svg", code: "0279" },
  { name: "메리츠종합금융증권", icon: "/src/assets/icons/securities/메리츠.png", code: "0287" },
  { name: "하이투자증권", icon: "/src/assets/icons/securities/하이투자.png", code: "0262" },
  { name: "다올투자증권", icon: "/src/assets/icons/securities/다올.png", code: "0227" },
];

onMounted(() => {
  console.log("CertificateSelectView 마운트됨");
  // BankSelectView에서 선택한 은행 배열 받기
  if (route.query.selectedBanks) {
    try {
      selectedBanks.value = JSON.parse(route.query.selectedBanks);
      console.log("선택된 은행들:", selectedBanks.value);
    } catch (error) {
      console.error("selectedBanks 파싱 오류:", error);
      // 기존 방식으로도 시도 (하위 호환성)
      if (Array.isArray(route.query.selectedBanks)) {
        selectedBanks.value = route.query.selectedBanks;
      } else {
        selectedBanks.value = [route.query.selectedBanks];
      }
    }
  }
});

function selectSecurity(security) {
  const idx = selectedSecurities.value.findIndex((s) => s === security.name);
  if (idx === -1) {
    selectedSecurities.value.push(security.name);
  } else {
    selectedSecurities.value.splice(idx, 1);
  }
  console.log("선택된 증권사:", selectedSecurities.value);
}

function onComplete() {
  const totalSelected = selectedBanks.value.length + selectedSecurities.value.length;
  if (totalSelected === 0) {
    alert("은행 또는 증권사를 선택하세요.");
    return;
  }

  // 선택된 증권사들을 한국어순으로 정렬
  const sortedSelectedSecurities = [...selectedSecurities.value].sort((a, b) => {
    // 한국어가 영어보다 앞에 오도록
    const aIsKorean = /[가-힣]/.test(a);
    const bIsKorean = /[가-힣]/.test(b);

    if (aIsKorean && !bIsKorean) return -1;
    if (!aIsKorean && bIsKorean) return 1;

    // 둘 다 한국어이거나 둘 다 영어인 경우 사전순 정렬
    return a.localeCompare(b, "ko");
  });

  console.log("선택된 은행:", selectedBanks.value);
  console.log("선택된 증권사:", sortedSelectedSecurities);

  router.push({
    path: "/bank-login",
    query: {
      selectedBanks: JSON.stringify(selectedBanks.value),
      selectedSecurities: JSON.stringify(sortedSelectedSecurities),
    },
  });
}
</script>

<template>
  <div class="w-full h-full bg-white flex flex-col">
    <!-- 헤더 -->
    <div class="text-center py-8 flex-shrink-0">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">증권사선택</h1>
      <h2 class="text-lg text-gray-600 text-left ml-8">증권사</h2>
    </div>

    <!-- 증권사 선택 그리드 -->
    <div class="flex-1 px-8 pb-24 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="security in securities"
          :key="security.name"
          @click="selectSecurity(security)"
          class="flex items-center p-2 rounded-lg transition-all duration-200 cursor-pointer mb-2"
          :class="selectedSecurities.some((s) => s === security.name) ? 'bg-[#433D8B]/5' : 'bg-white hover:bg-gray-50'"
        >
          <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
            <img :src="security.icon" :alt="security.name" class="w-8 h-8" />
          </div>
          <span class="text-sm font-medium text-gray-900 whitespace-nowrap">{{ security.name }}</span>
        </div>
      </div>
    </div>

    <!-- 다음 버튼 -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-white">
      <button
        @click="onComplete"
        class="w-full bg-[#433D8B] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#433D8B]/90 transition-colors"
      >
        연동하기
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
