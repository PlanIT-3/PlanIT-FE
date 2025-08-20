// FCM 관련 컴포저블
import { ref, onMounted } from 'vue';
import { setupFCM, onForegroundMessage } from '@/fcm/firebase';

export const useFCM = () => {
  const fcmToken = ref(null);
  const isSetupComplete = ref(false);
  const error = ref(null);

  /**
   * FCM 초기화 (로그인 후 호출)
   * @param {number} memberId 회원 ID  
   */
  const initializeFCM = async (memberId) => {
    try {
      error.value = null;
      
      // FCM 설정 (토큰 생성 + 백엔드 등록)
      const token = await setupFCM(memberId);
      
      if (token) {
        fcmToken.value = token;
        isSetupComplete.value = true;
        
        // 포그라운드 메시지 수신 설정
        await setupForegroundMessage();
        
        console.log('FCM 초기화 완료:', token);
      } else {
        throw new Error('FCM 토큰 설정 실패');
      }
    } catch (err) {
      error.value = err.message;
      console.error('FCM 초기화 실패:', err);
    }
  };

  /**
   * 포그라운드 메시지 수신 설정 (async 함수로 변경)
   */
  const setupForegroundMessage = async () => {
    await onForegroundMessage((payload) => {
      console.log('알림 수신:', payload);
      
      // 토스트 알림이나 모달 표시
      // 예: showToast(payload.notification?.title, payload.notification?.body);
      
      // 사용자 정의 처리 로직 추가 가능
      if (payload.data?.type === 'goal_achievement') {
        // 목표 달성 알림 처리
        handleGoalAchievementNotification(payload);
      } else if (payload.data?.type === 'rebalancing') {
        // 리밸런싱 알림 처리
        handleRebalancingNotification(payload);
      }
    });
  };

  /**
   * 목표 달성 알림 처리
   */
  const handleGoalAchievementNotification = (payload) => {
    // 목표 상세 페이지로 이동하거나 축하 모달 표시
    console.log('목표 달성 알림:', payload);
  };

  /**
   * 리밸런싱 알림 처리
   */
  const handleRebalancingNotification = (payload) => {
    // 리밸런싱 페이지로 이동
    console.log('리밸런싱 알림:', payload);
  };

  return {
    fcmToken,
    isSetupComplete,
    error,
    initializeFCM
  };
};