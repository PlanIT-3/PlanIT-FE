// Firebase 설정
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Capacitor 플러그인 (동적 import)
let PushNotifications = null;
let Capacitor = null;

// Capacitor 환경 체크 및 플러그인 로드
const initCapacitor = async () => {
  try {
    if (typeof window !== 'undefined' && window.Capacitor) {
      const capacitorCore = await import('@capacitor/core');
      const pushNotifications = await import('@capacitor/push-notifications');
      
      Capacitor = capacitorCore.Capacitor;
      PushNotifications = pushNotifications.PushNotifications;
      
      return Capacitor.isNativePlatform();
    }
    return false;
  } catch (error) {
    console.log('Capacitor 플러그인 로드 실패 (웹 환경):', error.message);
    return false;
  }
};

// 환경 체크
const isCapacitorApp = async () => {
  return await initCapacitor();
};

// Firebase 설정 객체 (실제 Firebase Console에서 가져온 설정)
const firebaseConfig = {
  apiKey: "AIzaSyDSp9ALB76z9ji2ZVceXXLtIxDiGo-YFSw",
  authDomain: "plan-it-af398.firebaseapp.com",
  projectId: "plan-it-af398",
  storageBucket: "plan-it-af398.firebasestorage.app",
  messagingSenderId: "197940284583",
  appId: "1:197940284583:web:f131071c1cd9d1ab3c9f82",
  measurementId: "G-HGXWH97ZN3"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// FCM 인스턴스 (웹 환경에서만 초기화)
let messaging = null;

// 웹 환경에서만 Firebase messaging 초기화
const initFirebaseMessaging = async () => {
  const isNative = await isCapacitorApp();
  if (!isNative) {
    messaging = getMessaging(app);
  }
};

/**
 * 백엔드에서 VAPID 키 가져오기
 * @returns {Promise<string>} VAPID 키
 */
const getVapidKey = async () => {
  try {
    const response = await fetch('/auth/api/fcm/vapid-key', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 인증이 필요한 경우 Authorization 헤더 추가
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('VAPID 키 조회 실패');
    }
    
    const result = await response.json();
    console.log('VAPID 키 조회 성공:', result.data);
    return result.data; // Response<String> 형태이므로 data 필드에서 키 추출
  } catch (error) {
    console.error('VAPID 키 가져오기 실패:', error);
    throw error;
  }
};

/**
 * FCM 토큰 가져오기 (환경별 처리)
 * @returns {Promise<string>} FCM 토큰
 */
export const getFCMToken = async () => {
  try {
    const isNative = await isCapacitorApp();
    
    if (isNative && PushNotifications) {
      // iOS Capacitor 환경 - 네이티브 푸시 알림
      console.log('iOS Capacitor 환경에서 푸시 알림 토큰 요청');
      
      // 1. 푸시 알림 권한 요청
      const permissionResult = await PushNotifications.requestPermissions();
      
      if (permissionResult.receive !== 'granted') {
        console.log('푸시 알림 권한이 거부되었습니다.');
        return null;
      }
      
      // 2. iOS에서 토큰 등록
      await PushNotifications.register();
      
      // 3. 토큰 수신 대기 (Promise로 래핑)
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('토큰 수신 타임아웃'));
        }, 10000); // 10초 타임아웃
        
        PushNotifications.addListener('registration', (token) => {
          clearTimeout(timeoutId);
          console.log('iOS 푸시 토큰 수신:', token.value);
          resolve(token.value);
        });
        
        PushNotifications.addListener('registrationError', (error) => {
          clearTimeout(timeoutId);
          console.error('iOS 푸시 토큰 등록 실패:', error);
          reject(error);
        });
      });
      
    } else {
      // 웹 환경 - Firebase Web Push
      console.log('웹 환경에서 FCM 토큰 요청');
      
      // Firebase messaging 초기화
      await initFirebaseMessaging();
      
      if (!messaging) {
        throw new Error('Firebase messaging 초기화 실패');
      }
      
      // 1. 알림 권한 요청
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('알림 권한이 거부되었습니다.');
        return null;
      }

      // 2. 백엔드에서 VAPID 키 가져오기
      const vapidKey = await getVapidKey();
      
      // 3. FCM 토큰 생성
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM 토큰 생성 성공:', token);
      return token;
    }
    
  } catch (error) {
    console.error('FCM 토큰 가져오기 실패:', error);
    return null;
  }
};

/**
 * 포그라운드 메시지 수신 설정 (환경별 처리)
 * @param {Function} callback 메시지 수신 시 실행할 콜백 함수
 */
export const onForegroundMessage = async (callback) => {
  const isNative = await isCapacitorApp();
  
  if (isNative && PushNotifications) {
    // iOS Capacitor 환경 - 네이티브 푸시 알림 리스너
    console.log('iOS Capacitor 포그라운드 메시지 리스너 설정');
    
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('iOS 포그라운드 알림 수신:', notification);
      
      // 콜백 함수 실행 (Firebase 형태로 변환)
      if (callback) {
        const payload = {
          notification: {
            title: notification.title,
            body: notification.body
          },
          data: notification.data || {}
        };
        callback(payload);
      }
    });
    
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('iOS 알림 액션 수행:', action);
      
      // 알림 클릭 시 처리
      if (callback) {
        const payload = {
          notification: {
            title: action.notification.title,
            body: action.notification.body
          },
          data: action.notification.data || {}
        };
        callback(payload);
      }
    });
    
  } else {
    // 웹 환경 - Firebase Web Push
    console.log('웹 환경 포그라운드 메시지 리스너 설정');
    
    // Firebase messaging 초기화
    await initFirebaseMessaging();
    
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);
        
        // 브라우저 알림 표시
        if (payload.notification) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/favicon.ico'
          });
        }
        
        // 콜백 함수 실행
        if (callback) {
          callback(payload);
        }
      });
    } else {
      console.warn('Firebase messaging이 초기화되지 않아 웹 푸시 알림을 설정할 수 없습니다.');
    }
  }
};

/**
 * FCM 토큰을 백엔드에 등록
 * @param {string} token FCM 토큰
 * @param {number} memberId 회원 ID
 * @returns {Promise<boolean>} 등록 성공 여부
 */
export const registerFCMToken = async (token, memberId) => {
  try {
    const response = await fetch('/auth/api/fcm/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        token: token,
        memberId: memberId
      })
    });
    
    if (!response.ok) {
      throw new Error('FCM 토큰 등록 실패');
    }
    
    const result = await response.json();
    console.log('FCM 토큰 등록 성공:', result);
    return true;
    
  } catch (error) {
    console.error('FCM 토큰 등록 중 오류:', error);
    return false;
  }
};

/**
 * 전체 FCM 설정 프로세스 (토큰 생성 + 백엔드 등록) - 환경별 처리
 * @param {number} memberId 회원 ID
 * @returns {Promise<string|null>} FCM 토큰 또는 null
 */
export const setupFCM = async (memberId) => {
  try {
    const isNative = await isCapacitorApp();
    console.log(`FCM 설정 시작... (환경: ${isNative ? 'iOS Capacitor' : '웹'})`);
    
    // 1. FCM 토큰 생성 (환경별)
    const token = await getFCMToken();
    if (!token) {
      throw new Error('FCM 토큰 생성 실패');
    }
    
    // 2. 백엔드에 토큰 등록
    const registered = await registerFCMToken(token, memberId);
    if (!registered) {
      throw new Error('FCM 토큰 등록 실패');
    }
    
    // 3. 로컬 스토리지에 저장 (선택사항)
    localStorage.setItem('fcmToken', token);
    localStorage.setItem('fcmEnvironment', isNative ? 'capacitor' : 'web');
    
    console.log(`FCM 설정 완료! (${isNative ? 'iOS 네이티브' : '웹'} 환경)`);
    return token;
    
  } catch (error) {
    console.error('FCM 설정 실패:', error);
    return null;
  }
};

export { messaging };