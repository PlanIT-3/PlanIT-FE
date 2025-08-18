<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-col items-start w-full px-0 mb-4">
          <h1 class="text-xl font-bold m-0">연결된 계좌 관리</h1>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#433D8B]"></div>
        </div>

        <!-- 계좌 카드 -->
        <template v-for="(account, idx) in accounts" :key="account.accountNumber">
          <div class="relative flex items-center rounded-xl px-4 py-3 mb-3 shadow-sm w-full bg-gray-50">
            <div class="w-10 h-10 flex items-center justify-center rounded-full mr-3">
              <img :src="getBankIcon(account.organization)" :alt="account.organization" class="w-10 h-10" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-base">{{ account.organization }}</div>
              <div class="text-gray-400 text-sm">{{ account.accountNumber }}</div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 cursor-pointer"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              @click="openDeleteModal(idx)"
            ></svg>
          </div>
        </template>
        <!-- 새 계좌 연결하기 -->
        <router-link
          to="/bank-select"
          class="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition"
        >
          + 새 계좌 연결하기
        </router-link>
      </div>
    </DefaultLayout>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import { getAccounts } from "@/api/accountApi.js";

const accounts = ref([]);
const showDeleteIdx = ref(null);
const isLoading = ref(false);

// 은행 아이콘 svg를 glob으로 모두 import
const bankIcons = import.meta.glob("@/assets/icons/bank/*.svg", { eager: true, as: "url" });
// 증권사 아이콘도 import
const securityIcons = import.meta.glob("@/assets/icons/securities/*.{svg,png}", { eager: true, as: "url" });

onMounted(async () => {
  await nextTick(); // accounts 렌더 후 실행
  await fetchAccounts();
});

// API에서 계좌 정보 가져오기
async function fetchAccounts() {
  try {
    isLoading.value = true;
    const result = await getAccounts();

    if (result.success) {
      accounts.value = result.accounts.map((account) => ({
        organization: account.organization,
        accountNumber: account.accountNumber,
      }));
      console.log("✅ 계좌 정보 로드 성공:", accounts.value);
    } else {
      console.error("❌ 계좌 정보 로드 실패:", result.error);
    }
  } catch (error) {
    console.error("❌ 계좌 정보 로드 중 오류:", error);
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(idx) {
  // 이미 열려있는 경우 닫기(토글)
  if (showDeleteIdx.value === idx) {
    showDeleteIdx.value = null;
  } else {
    showDeleteIdx.value = idx;
  }
}
function closeDeleteModal() {
  showDeleteIdx.value = null;
}
function deleteAccount(idx) {
  accounts.value.splice(idx, 1);
  closeDeleteModal();
}

function getBankIcon(organization) {
  // 은행 아이콘 먼저 찾기
  let match = Object.entries(bankIcons).find(([path]) => {
    const fileName = path
      .split("/")
      .pop()
      .replace(/\.(svg|png)$/, "");
    return organization.includes(fileName) || fileName.includes(organization);
  });

  if (match) return match[1];

  // 증권사 아이콘 찾기
  match = Object.entries(securityIcons).find(([path]) => {
    const fileName = path
      .split("/")
      .pop()
      .replace(/\.(svg|png)$/, "");
    return organization.includes(fileName) || fileName.includes(organization);
  });

  if (match) return match[1];

  // 없으면 기본 아이콘 (KB국민은행)
  const fallback = Object.entries(bankIcons).find(([path]) => path.includes("/KB국민은행.svg"));
  return fallback ? fallback[1] : "";
}
</script>
<style scoped></style>
