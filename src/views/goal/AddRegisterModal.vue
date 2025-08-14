<script setup lang="ts">
import BaseModal from "@/components/base/BaseModal.vue";
import Button from "@/components/base/Button.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  isaAmount: Number, //
  depositAmount: Number,
  goalId: [Number, String],
});

const emit = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();

// goalId  : props -> url => localstorage 순
const safeGoalId = computed(() => {
  return String(props.goalId ?? route.query.goalId ?? localStorage.getItem("currentGoalId") ?? "");
});

const goToISA = () => {
  const gid = safeGoalId.value;
  if (gid) {
    router.push({
      path: "/goal/isa",
      query: { goalId: gid, amount: props.isaAmount },
    });
  } else {
    console.log("goalID 찾기 실패 ");
    return;
  }
};

const goToSavings = () => {
  const gid = safeGoalId.value;
  if (!gid) {
    console.log("goalId를 찾기 실패.");
    return;
  }
  router.push({
    path: "/goal/deposit",
    query: { goalId: gid, amount: props.depositAmount ?? 0 },
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
