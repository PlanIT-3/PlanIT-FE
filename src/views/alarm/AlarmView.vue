<template>
  <DefaultLayout>
    <div class="w-full">
      <div class="relative top-[-1.3rem]">
        <div class="flex border-b border-gray-200 w-[343px] mx-auto">
          <button
            @click="activeTab = 'alarm'"
            :class="[
              'flex-1 py-4 px-4 text-sm font-semibold transition-all duration-200 relative',
              activeTab === 'alarm' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            최근 알림
            <div
              v-if="activeTab === 'alarm'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200"
            ></div>
          </button>
          <button
            @click="activeTab = 'alarmSetting'"
            :class="[
              'flex-1 py-4 px-4 text-sm font-semibold transition-all duration-200 relative',
              activeTab === 'alarmSetting' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            알림 설정
            <div
              v-if="activeTab === 'alarmSetting'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full transition-all duration-200"
            ></div>
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'alarm'">
        <AlarmDetailView />
      </div>

      <!-- 상품 리밸런싱 탭 -->
      <div v-if="activeTab === 'alarmSetting'">
        <AlarmSettingView />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";
import AlarmDetailView from "./AlarmDetailView.vue";
import AlarmSettingView from "./AlarmSettingView.vue";

const router = useRouter();
const activeTab = ref("alarm");
</script>
