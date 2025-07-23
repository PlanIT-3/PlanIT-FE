<template>
  <div class="min-h-screen bg-white px-6 py-4 flex flex-col">
    <div class="h-15">
      <goBackButton />
    </div>

    <h1 class="text-2xl font-semibold mt-6 mb-20">비밀번호 찾기</h1>

    <div class="flex items-center gap-2 mb-4">
      <BaseTextInput placeholder="enter your email" />

      <button
        @click="sendLink"
        class="px-4 py-3 rounded-lg border border-gray-200 bg-[#c2c2c2] text-white hover:bg-[#9c9c9c]"
      >
        send
      </button>
    </div>

    <div class="mb-1 mt-8 relative">
      <BaseTextInput placeholder="Enter your code" />
    </div>

    <div class="mt-12"><Button label="Verify Code"></Button></div>
  </div>
</template>

<script setup>
import goBackButton from "@/components/base/GoBackButton.vue";
import Button from "@/components/base/Button.vue";
import BaseTextInput from "@/components/base/BaseTextInput.vue";
</script>
