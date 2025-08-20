// iOS Capacitor 푸시 알림 서비스
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * iOS Capacitor 환경 체크
 */
const isCapacitorApp = () => {
  return Capacitor.isNativePlatform();
};

/**
 * iOS 푸시 알림 초기화
 */
export const initializePushNotifications = async () => {
  console.log('푸시 알림 초기화 시작...');
  
  if (!isCapacitorApp()) {
    console.log('웹 환경에서는 Capacitor 푸시 알림을 사용하지 않습니다.');
    return null;
  }

  try {
    // 1. 푸시 알림 권한 요청
    const permissionStatus = await PushNotifications.requestPermissions();
    
    if (permissionStatus.receive !== 'granted') {
      console.warn('푸시 알림 권한이 거부되었습니다.');
      return null;
    }

    console.log('푸시 알림 권한 승인됨');

    // 2. 푸시 알림 등록
    await PushNotifications.register();
    console.log('푸시 알림 등록 완료');

    // 3. 이벤트 리스너 설정
    setupPushNotificationListeners();

    return true;
  } catch (error) {
    console.error('푸시 알림 초기화 실패:', error);
    return null;
  }
};

/**
 * 푸시 알림 이벤트 리스너 설정
 */
const setupPushNotificationListeners = () => {
  // FCM 토큰 수신
  PushNotifications.addListener('registration', (token) => {
    console.log('FCM 토큰 수신:', token.value);
    
    // 백엔드에 토큰 등록
    registerTokenWithBackend(token.value);
  });

  // 토큰 등록 오류
  PushNotifications.addListener('registrationError', (error) => {
    console.error('FCM 토큰 등록 오류:', error);
  });

  // 앱이 포그라운드일 때 푸시 알림 수신
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('포그라운드 푸시 알림 수신:', notification);
    
    // 앱 내 알림 UI 표시 (선택사항)
    showInAppNotification(notification);
  });

  // 푸시 알림 탭 시 (백그라운드에서 앱 열림)
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('푸시 알림 액션 수행:', notification);
    
    // 특정 페이지로 이동 등 처리
    handleNotificationAction(notification);
  });
};

/**
 * 백엔드에 FCM 토큰 등록
 */
const registerTokenWithBackend = async (fcmToken) => {
  try {
    // localStorage에서 인증 정보 가져오기
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const accessToken = authData?.token?.accessToken;
    const memberId = authData?.user?.id;

    if (!accessToken || !memberId) {
      console.error('인증 정보가 없습니다. 로그인이 필요합니다.');
      return;
    }

    // API 기본 URL (환경에 따라 변경)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    
    const response = await fetch(`${apiBaseUrl}/api/fcm/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        token: fcmToken,
        memberId: memberId,
      }),
    });

    if (response.ok) {
      console.log('FCM 토큰 백엔드 등록 성공');
      
      // 로컬 스토리지에 토큰 저장 (선택사항)
      localStorage.setItem('fcmToken', fcmToken);
    } else {
      console.error('FCM 토큰 백엔드 등록 실패:', response.status);
    }
  } catch (error) {
    console.error('FCM 토큰 등록 중 오류:', error);
  }
};

/**
 * 앱 내 알림 표시 (포그라운드에서 푸시 수신 시)
 */
const showInAppNotification = (notification) => {
  console.log('앱 내 알림 표시:', notification.title, notification.body);
  
  // 여기서 Vue 컴포넌트나 토스트 메시지 등으로 알림 UI 표시
  // 예: Toast, Modal, Banner 등
};

/**
 * 푸시 알림 액션 처리 (사용자가 알림 탭 시)
 */
const handleNotificationAction = (notification) => {
  console.log('푸시 알림 액션 처리:', notification);
  
  // 알림 데이터에 따라 특정 페이지로 이동
  const data = notification.notification?.data;
  
  if (data?.route) {
    // Vue Router를 통한 페이지 이동
    // 이 함수는 main.js나 다른 곳에서 router 인스턴스와 함께 호출해야 함
    console.log('페이지 이동 요청:', data.route);
  }
};

/**
 * 푸시 알림 권한 상태 확인
 */
export const checkPushPermissionStatus = async () => {
  if (!isCapacitorApp()) {
    return null;
  }

  try {
    const status = await PushNotifications.checkPermissions();
    return status;
  } catch (error) {
    console.error('푸시 권한 상태 확인 오류:', error);
    return null;
  }
};

/**
 * 푸시 알림 비활성화
 */
export const disablePushNotifications = async () => {
  if (!isCapacitorApp()) {
    return;
  }

  try {
    await PushNotifications.removeAllListeners();
    console.log('푸시 알림 리스너 제거 완료');
  } catch (error) {
    console.error('푸시 알림 비활성화 오류:', error);
  }
};

/**
 * 현재 등록된 FCM 토큰 가져오기
 */
export const getCurrentFCMToken = () => {
  return localStorage.getItem('fcmToken');
};