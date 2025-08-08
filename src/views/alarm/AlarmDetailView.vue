<template>
  <div>
    <div class="space-y-2">
      <AlarmItem v-for="(alarm, index) in alarms" :key="index" :message="alarm.message" :time="alarm.time" />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import AlarmItem from "@/components/alarm/AlarmItem.vue";

const alarms = ref([
  {
    message: "현재 수익률이 목표의 70%에 도달했어요.",
    time: "어제 16:18",
  },
  {
    message: "🐻 현재 수익률이 목표의 80%에 도달했어요.",
    time: "어제 16:15",
  },
  {
    message: "지정한 수익률에 도달했습니다. 확인해보세요!",
    time: "어제 16:15",
  },
]);
</script>
<style scoped></style>
