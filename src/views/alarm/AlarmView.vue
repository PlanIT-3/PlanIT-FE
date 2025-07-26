<template>
  <DefaultLayout>
    <div class="w-full">
      <!-- 상단 탭 -->
      <div class="flex justify-around -mt-6">
        <button class="flex flex-col items-center">
          <span class="font-bold">최근 알림</span>
          <div class="mt-4 h-[3px] w-[160px] bg-[#433D8B] rounded-full"></div>
        </button>

        <button @click="gotoSetting" class="flex flex-col items-center">
          <span class="font-bold">알림설정</span>
          <div class="mt-4 h-[3px] w-[160px] bg-gray-300"></div>
        </button>
      </div>

      <!--알림내용 -->
      <div class="mt-4">
        <div class="space-y-2 mt-4">
          <AlarmItem v-for="(alarm, index) in alarms" :key="index" :message="alarm.message" :time="alarm.time" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import AlarmItem from "@/components/alarm/AlarmItem.vue";

const router = useRouter();

const gotoSetting = () => {
  router.push("/alarm/setting");
};

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
