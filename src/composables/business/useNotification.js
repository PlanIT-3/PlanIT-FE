import { ref, onMounted } from 'vue';
import { getFCMToken, onForegroundMessage } from '@/config/firebase';
import { authApi } from '@/api/authApi';

/**
 * FCM 알림 관리 컴포저블
 */
export function useNotification() {
  const fcmToken = ref(null);
  const isNotificationEnabled = ref(false);

  /**
   * FCM 초기화 및 토큰 등록
   */
  const initializeFCM = async () => {
    try {
      // FCM 토큰 가져오기
      const token = await getFCMToken();
      
      if (token) {
        fcmToken.value = token;
        isNotificationEnabled.value = true;
        
        // 서버에 토큰 등록
        await registerTokenToServer(token);
        
        // 포그라운드 메시지 수신 설정
        setupForegroundMessageListener();
        
        console.log('FCM 초기화 완료');
      } else {
        console.log('FCM 토큰 획득 실패');
      }
    } catch (error) {
      console.error('FCM 초기화 오류:', error);
    }
  };

  /**
   * 서버에 FCM 토큰 등록
   */
  const registerTokenToServer = async (token) => {
    try {
      // 백엔드 API로 토큰 전송
      await authApi.registerFCMToken({
        token: token,
        deviceType: 'web'
      });
      console.log('FCM 토큰 서버 등록 완료');
    } catch (error) {
      console.error('FCM 토큰 서버 등록 실패:', error);
    }
  };

  /**
   * 포그라운드 메시지 수신 리스너 설정
   */
  const setupForegroundMessageListener = () => {
    onForegroundMessage((payload) => {
      console.log('포그라운드 알림 수신:', payload);
      
      // 여기서 앱 내 알림 UI 표시 가능
      // 예: Toast, Modal, Badge 업데이트 등
      showInAppNotification(payload);
    });
  };

  /**
   * 앱 내 알림 표시
   */
  const showInAppNotification = (payload) => {
    // 실제 구현에서는 Toast 컴포넌트나 알림 스토어 사용
    const { title, body } = payload.notification || {};
    
    if (title && body) {
      // 간단한 알림 표시 (실제로는 더 세련된 UI 구현)
      alert(`${title}\n${body}`);
    }
  };

  /**
   * 알림 권한 요청
   */
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        await initializeFCM();
        return true;
      } else {
        console.log('알림 권한 거부됨');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      return false;
    }
  };

  /**
   * 알림 끄기
   */
  const disableNotification = async () => {
    try {
      if (fcmToken.value) {
        // 서버에서 토큰 제거
        await authApi.unregisterFCMToken(fcmToken.value);
      }
      
      fcmToken.value = null;
      isNotificationEnabled.value = false;
      console.log('알림 비활성화 완료');
    } catch (error) {
      console.error('알림 비활성화 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 자동 초기화 (권한이 있는 경우)
  onMounted(() => {
    if (Notification.permission === 'granted') {
      initializeFCM();
    }
  });

  return {
    fcmToken,
    isNotificationEnabled,
    initializeFCM,
    requestNotificationPermission,
    disableNotification,
    registerTokenToServer
  };
}