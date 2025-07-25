<template>
  <div>
    <DefaultLayout>
      <!-- 마이페이지 헤더 -->
      <div class="flex flex-col gap-4 w-full">
        <div class="flex justify-between items-center w-full px-0 mb-4">
          <h1 class="text-xl font-bold m-0">비밀번호 변경</h1>
        </div>

        <div class="flex flex-col gap-2 w-full">
          <div>기존 비밀번호</div>
        </div>
        <BaseTextInput placeholder="old password" type="password" />

        <div class="flex flex-col gap-2 w-full">
          <div>새 비밀번호</div>
        </div>
        <BaseTextInput placeholder="new password" type="password" v-model="newPassword" />

        <div class="flex flex-col gap-2 w-full">
          <div>새 비밀번호 확인</div>
        </div>
        <BaseTextInput placeholder="new password" type="password" v-model="confirmPassword" @blur="validatePassword" />

        <span v-if="error" class="block w-full text-left text-red-500 text-xs mt-0">{{ error }}</span>

        <Button label="변경하기" @click="onSubmit" />
        <Button label="돌아가기" color="#D1D5DB" hoverColor="#9CA3AF" @click="navigateTo('/mypage')" />
      </div>
    </DefaultLayout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import Button from "@/components/base/Button.vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const router = useRouter();

function validatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "비밀번호가 일치하지 않습니다.";
    console.log(error.value);
    return false;
  }
  error.value = "";
  return true;
}

function onSubmit() {
  if (validatePassword()) {
    // 비밀번호 변경 API 호출 등
    alert("비밀번호가 성공적으로 변경되었습니다!");
  }
}

function navigateTo(path) {
  router.push(path);
}
</script>
<style scoped></style>
