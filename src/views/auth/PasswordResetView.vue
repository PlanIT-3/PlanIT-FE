<template>
  <div class="min-h-screen bg-white px-6 py-4 flex flex-col">
    <div class="h-15">
      <goBackButton />
    </div>

    <h1 class="text-2xl font-semibold mt-6 mb-10">비밀번호 재설정</h1>

    <div class="mb-1 mt-8 relative">
      <BasePasswordInput placeholder="Enter your code" />
    </div>

    <div class="mb-1 mt-8 relative">
      <BasePasswordInput placeholder="Enter your code" />
    </div>

    <div class="mt-12"><Button label="Reset Password"></Button></div>
  </div>
</template>

<script setup>
import goBackButton from "@/components/base/GoBackButton.vue";
import Button from "@/components/base/Button.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
import BasePasswordInput from "@/components/base/BasePasswordInput.vue";
</script>
