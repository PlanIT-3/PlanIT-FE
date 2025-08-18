<!-- FCM 설정 컴포넌트 -->
<template>
  <div v-if="showError" class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
    <strong class="font-bold">알림 설정 실패:</strong>
    <span class="block sm:inline">{{ error }}</span>
    <button @click="retry" class="ml-2 text-red-500 hover:text-red-700">다시 시도</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useFCM } from '@/composables/useFCM';
import { useAuthStore } from '@/stores/auth'; // 인증 스토어 (예시)

const { initializeFCM, error, isSetupComplete } = useFCM();
const authStore = useAuthStore();

const showError = ref(false);

// 로그인 상태 변화 감지
watch(() => authStore.isLoggedIn, async (isLoggedIn) => {
  if (isLoggedIn && authStore.user?.memberId) {
    await setupFCMForUser();
  }
}, { immediate: true });

// 에러 표시 감지
watch(error, (newError) => {
  showError.value = !!newError;
  
  // 5초 후 에러 메시지 자동 숨김
  if (newError) {
    setTimeout(() => {
      showError.value = false;
    }, 5000);
  }
});

/**
 * 사용자 FCM 설정
 */
const setupFCMForUser = async () => {
  try {
    const memberId = authStore.user?.memberId;
    if (!memberId) {
      console.log('memberId가 없어서 FCM 설정을 건너뜁니다.');
      return;
    }

    console.log('FCM 설정 시작:', memberId);
    await initializeFCM(memberId);
    
    if (isSetupComplete.value) {
      console.log('FCM 설정 완료');
      // 선택사항: 설정 완료 토스트 표시
      // showToast('알림 설정이 완료되었습니다.', 'success');
    }
  } catch (err) {
    console.error('FCM 설정 중 오류:', err);
  }
};

/**
 * FCM 설정 재시도
 */
const retry = async () => {
  showError.value = false;
  await setupFCMForUser();
};

onMounted(() => {
  console.log('FCMSetup 컴포넌트 마운트됨');
});
</script>