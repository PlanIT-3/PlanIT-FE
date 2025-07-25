<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col items-start w-full px-0 gap-2">
          <h1 class="text-xl font-bold m-0">마이페이지</h1>
        </div>

        <div class="flex flex-row items-center justify-between mb-4 w-full px-6">
          <div class="flex flex-col items-center justify-center">
            <div class="w-24 h-24 rounded-full bg-gray-200"></div>
          </div>
          <div class="flex flex-col justify-center gap-1">
            <h2 class="text-base font-semibold text-gray-800">{{ name }}님 환영합니다!</h2>
            <p class="text-sm text-gray-500">오늘도 자산 관리, 함께해요!</p>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-gray-400 mb-2">계정 설정</div>
          <router-link
            to="/mypage/edit-profile"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            내 정보 수정
          </router-link>
          <router-link
            to="/mypage/edit-account"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            연결된 계좌 관리
          </router-link>

          <div class="border-t my-4 border-gray-200"></div>

          <div class="text-sm text-gray-400 mb-2">서비스 설정</div>
          <router-link
            to="/alarm/setting"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            알림 설정
          </router-link>
          <router-link to="/agreement" class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600">
            이용 약관 및 개인정보 처리방침
          </router-link>
          <router-link
            to="/mypage/delete-profile"
            class="block py-2 text-base text-gray-800 hover:font-bold hover:text-indigo-600"
          >
            회원 탈퇴
          </router-link>
        </div>

        <button
          @click="logout"
          class="text-base text-indigo-600 hover:underline text-right flex items-center justify-end"
        >
          로그아웃
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </DefaultLayout>
  </div>
</template>
<script setup>
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import { ref } from "vue";
// import { useUserStore } from "@/stores/user";

// const userStore = useUserStore();
// const name = userStore.user.name;

const name = ref("User");

const logout = () => {
  // 토큰 삭제, 유저 상태 초기화 등
  alert("로그아웃 되었습니다.");
};
</script>
<style scoped></style>
