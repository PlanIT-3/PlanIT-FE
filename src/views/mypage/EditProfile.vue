<template>
  <div>
    <DefaultLayout>
      <div class="flex flex-col gap-4 w-full">
        <div class="flex justify-between items-center w-full px-0 mb-4">
          <h1 class="text-xl font-bold m-0">내 정보 수정</h1>
          <span
            class="flex items-center text-indigo-600 cursor-pointer text-sm"
            @click="navigateTo('/investment-survey')"
          >
            투자 성향 검사 다시 하기
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
          </span>
        </div>

        <div class="flex flex-col items-center justify-center">
          <div class="w-24 h-24 rounded-full bg-gray-200"></div>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <div>이름</div>
          <!-- 이름 받아오기 -->
          <BaseTextInput placeholder="username" />
        </div>

        <div class="flex flex-col gap-2 w-full">
          <div>이메일</div>
          <!-- 이메일 받아오기 / 수정 불가 -->
          <BaseTextInput placeholder="email" disabled />
        </div>

        <div class="flex flex-col gap-2 w-full">
          <div class="flex justify-between items-center">
            <div>비밀번호</div>
            <span class="text-indigo-600 cursor-pointer text-sm" @click="navigateTo('/mypage/change-password')">
              비밀번호 변경
            </span>
          </div>
          <!-- 비밀번호 받아오기 -->
          <BaseTextInput placeholder="password" type="password" />
        </div>

        <Button label="완료" @click="navigateTo('/mypage')" />
      </div>
    </DefaultLayout>
  </div>
</template>

<script setup>
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import CardContainer from "@/components/common/CardContainer.vue";
import Button from "@/components/base/Button.vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped></style>
