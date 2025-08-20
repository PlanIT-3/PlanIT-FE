// iOS Capacitor 푸시 알림 초기화 서비스
import { setupFCM } from '@/fcm/firebase';

/**
 * 푸시 알림 초기화 (Capacitor 환경에서만)
 */
export const initializePushNotifications = async () => {
  try {
    // Capacitor 환경 체크
    if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
      console.log('Capacitor 네이티브 환경에서 푸시 알림 초기화 준비');
      
      // 로그인 상태 확인 후 FCM 설정은 useFCM에서 처리
      // 여기서는 환경만 확인하고 준비
      return true;
    } else {
      console.log('웹 환경 - 푸시 알림은 FCM에서 처리');
      return false;
    }
  } catch (error) {
    console.error('푸시 알림 초기화 오류:', error);
    return false;
  }
};