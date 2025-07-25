<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-6 w-full">
        <!-- 상단 헤더 -->
        <div class="flex items-center justify-between mb-4">
          <button @click="goBack" aria-label="뒤로가기" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="font-bold text-xl">탈퇴하기</h1>
          <div class="w-6"></div>
        </div>

        <!-- 안내 문구 -->
        <div class="mb-4">
          <div class="font-bold text-lg mb-1">정말 탈퇴하시겠어요? 너무 아쉬워요.</div>
          <div class="text-gray-500 text-sm">
            계정을 삭제하면 자산 정보, 목표, 투자 내역 등 모든 데이터가 삭제됩니다.<br />
            계정 삭제 후 7일간 재가입이 불가합니다.
          </div>
        </div>

        <!-- 탈퇴 사유 선택 -->
        <div class="mb-2 font-semibold">탈퇴 사유를 선택해 주세요.</div>
        <div class="mb-6">
          <select
            v-model="selectedReason"
            class="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option disabled value="">선택해 주세요.</option>
            <option v-for="reason in reasons" :key="reason" :value="reason">{{ reason }}</option>
          </select>
        </div>

        <!-- 탈퇴 버튼 -->
        <button
          class="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
          :disabled="!selectedReason"
          @click="withdraw"
        >
          탈퇴하기
        </button>
      </div>
    </DefaultLayout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";

const router = useRouter();
const selectedReason = ref("");
const reasons = [
  "너무 자주 사용하지 않아요",
  "원하는 목표를 달성했어요",
  "서비스가 기대에 못 미쳐요",
  "사용이 불편해요",
  "개인정보가 걱정돼요",
  "새 계정을 만들고 싶어요",
  "기타",
];

function goBack() {
  router.back();
}

function withdraw() {
  // 실제 탈퇴 처리 로직 (API 호출 등)
  alert(`탈퇴 사유: ${selectedReason.value}\n정상적으로 탈퇴 처리되었습니다.`);
  router.push("/");
}
</script>
<style scoped></style>
