<script setup lang="ts">
import BaseModal from "@/components/base/BaseModal.vue";
import Button from "@/components/base/Button.vue";
import { useRouter } from "vue-router";

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(["close"]);

const router = useRouter();

const goToISA = () => {
  router.push("/goal/isa");
};

const goToSavings = () => {
  router.push("/goal/deposit");
};
</script>

<template>
  <BaseModal
    :isModal="isOpen"
    @close="emit('close')"
    title="자산 할당"
    sub-title="목표에 할당 할 자산 유형을 선택하세요."
  >
    <div class="flex flex-col items-center gap-2">
      <Button label="ISA 계좌" @click="goToISA"></Button>
      <Button label="예적금 계좌" @click="goToSavings"></Button>
    </div>
  </BaseModal>
</template>
