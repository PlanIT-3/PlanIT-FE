<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-col items-start w-full px-0 mb-4">
          <h1 class="text-xl font-bold m-0">연결된 계좌 관리</h1>
        </div>

        <!-- 계좌 카드 -->
        <template v-for="(account, idx) in accounts" :key="account.accountNumber">
          <div class="relative flex items-center rounded-xl px-4 py-3 mb-3 shadow-sm w-full bg-gray-50">
            <div class="w-10 h-10 flex items-center justify-center rounded-full mr-3">
              <img :src="getBankIcon(account.bank)" :alt="account.bank" class="w-10 h-10" />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-base">{{ account.bank }}</div>
              <div class="text-gray-400 text-sm">{{ account.accountNumber }}</div>
            </div>
            <svg
              class="w-5 h-5 text-gray-400 cursor-pointer"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              @click="openDeleteModal(idx)"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
            </svg>

            <!-- 삭제 모달/툴팁 -->
            <div
              v-if="showDeleteIdx === idx"
              class="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 z-50 flex flex-col items-center"
              style="min-width: 120px"
            >
              <div class="flex gap-2">
                <button class="text-red-500 px-2 py-1 rounded hover:bg-red-50" @click="deleteAccount(idx)">삭제</button>
                <button class="text-gray-500 px-2 py-1 rounded hover:bg-gray-100" @click="closeDeleteModal">
                  취소
                </button>
              </div>
            </div>
          </div>
        </template>
        <!-- 새 계좌 연결하기 -->
        <div
          class="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition"
        >
          + 새 계좌 연결하기
        </div>
      </div>
    </DefaultLayout>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";

const accounts = ref([
  { bank: "국민", accountNumber: "****-****-1234" },
  { bank: "신한", accountNumber: "****-****-5678" },
  { bank: "카카오뱅크", accountNumber: "****-****-9012" },
  { bank: "하나", accountNumber: "****-****-3456" },
]);

const showDeleteIdx = ref(null);

const bankList = ["국민", "신한", "카카오뱅크", "하나"];
// 은행 아이콘 svg를 glob으로 모두 import
const bankIcons = import.meta.glob("@/assets/icons/bank/*.svg", { eager: true, as: "url" });

onMounted(async () => {
  await nextTick(); // accounts 렌더 후 실행
});

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

function getBankIcon(bank) {
  // 파일명과 bank명이 일치해야 함 (예: 국민.svg)
  const match = Object.entries(bankIcons).find(([path]) => path.includes(`/${bank}.svg`));
  if (match) return match[1];
  // 없으면 카카오뱅크 기본
  const fallback = Object.entries(bankIcons).find(([path]) => path.includes("/카카오뱅크.svg"));
  return fallback ? fallback[1] : "";
}
</script>
<style scoped></style>
