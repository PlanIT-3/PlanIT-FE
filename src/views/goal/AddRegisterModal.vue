<script setup lang="ts">
import BaseModal from "@/components/base/BaseModal.vue";
import Button from "@/components/base/Button.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isOpen: Boolean,
  isaAmount: Number, //
  depositAmount: Number,
});

const emit = defineEmits(["close"]);
const router = useRouter();

const goToISA = () => {
  const goalId = localStorage.getItem("currentGoalId");
  if (goalId) {
    router.push({
      path: "/goal/isa",
      query: { goalId: goalId, amount: props.isaAmount },
    });
  }
};

const goToSavings = () => {
  const goalId = localStorage.getItem("currentGoalId");
  router.push({
    path: "/goal/deposit",
    query: { goalId: goalId, amount: props.depositAmount },
  });
  emit("close");
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
