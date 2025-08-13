<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const selectedSecurities = ref([]);
const selectedBanks = ref([]);

const securities = [
  { name: "유안타증권", icon: "/src/assets/icons/securities/유안타.svg" },
  { name: "KB증권", icon: "/src/assets/icons/securities/KB.svg" },
  { name: "미래에셋증권", icon: "/src/assets/icons/securities/미래에셋.svg" },
  { name: "삼성증권", icon: "/src/assets/icons/securities/삼성.svg" },
  { name: "한국투자증권", icon: "/src/assets/icons/securities/한국투자.svg" },
  { name: "NH투자증권", icon: "/src/assets/icons/securities/NH투자.svg" },
  { name: "교보증권", icon: "/src/assets/icons/securities/교보.svg" },
  { name: "키움증권", icon: "/src/assets/icons/securities/키움.svg" },
  { name: "LS증권", icon: "/src/assets/icons/securities/LS.svg" },
  { name: "SK증권", icon: "/src/assets/icons/securities/SK.svg" },
  { name: "대신증권", icon: "/src/assets/icons/securities/대신.svg" },
  { name: "한화투자증권", icon: "/src/assets/icons/securities/한화.svg" },
  { name: "하나금융투자", icon: "/src/assets/icons/securities/하나.svg" },
  { name: "신한금융투자", icon: "/src/assets/icons/securities/신한투자.svg" },
  { name: "DB금융투자", icon: "/src/assets/icons/securities/DB.svg" },
  { name: "유진투자증권", icon: "/src/assets/icons/securities/유진.svg" },
  { name: "메리츠종합금융증권", icon: "/src/assets/icons/securities/메리츠.svg" },
  { name: "IBK투자증권", icon: "/src/assets/icons/securities/IBK투자.svg" },
  { name: "다올투자증권", icon: "/src/assets/icons/securities/다올.svg" },
  { name: "하이투자증권", icon: "/src/assets/icons/securities/하이투자.svg" },
];

onMounted(() => {
  console.log("CertificateSelectView 마운트됨");
  // BankSelectView에서 선택한 은행 배열 받기
  if (route.query.selectedBanks) {
    try {
      selectedBanks.value = JSON.parse(route.query.selectedBanks);
      console.log("선택된 은행들:", selectedBanks.value);
    } catch (error) {
      console.error("은행 데이터 파싱 오류:", error);
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

  console.log("선택된 은행:", selectedBanks.value);
  console.log("선택된 증권사:", selectedSecurities.value);

  router.push({
    path: "/bank-login",
    query: {
      selectedBanks: JSON.stringify(selectedBanks.value),
      selectedSecurities: JSON.stringify(selectedSecurities.value),
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
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="security in securities"
          :key="security.name"
          @click="selectSecurity(security)"
          class="flex items-center px-6 py-4 rounded-lg transition-all duration-200 cursor-pointer"
          :class="selectedSecurities.includes(security.name) ? 'bg-[#433D8B]/5' : 'bg-white hover:bg-gray-50'"
        >
          <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
            <img :src="security.icon" :alt="security.name" class="w-8 h-8" />
          </div>
          <span class="text-sm font-medium text-gray-900 whitespace-nowrap">{{ security.name }}</span>
        </div>
      </div>
    </div>

    <!-- 다음 버튼 -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
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
