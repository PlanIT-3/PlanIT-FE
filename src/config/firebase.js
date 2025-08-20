// Firebase 설정
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase 설정 객체 (실제 Firebase Console 값)
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

// FCM 인스턴스
const messaging = getMessaging(app);

/**
 * 백엔드에서 VAPID 키 가져오기
 * @returns {Promise<string>} VAPID 키
 */
const getVapidKey = async () => {
  try {
    // auth 객체에서 accessToken 가져오기
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = authData?.token?.accessToken;
    
    const response = await fetch("https://srv.woojooin.site/api/fcm/vapid-key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 인증이 필요한 경우 Authorization 헤더 추가
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("VAPID 키 조회 실패");
    }

    const result = await response.json();
    console.log("VAPID 키 조회 성공:", result.data);
    return result.data; // Response<String> 형태이므로 data 필드에서 키 추출
  } catch (error) {
    console.error("VAPID 키 가져오기 실패:", error);
    throw error;
  }
};

/**
 * FCM 토큰 가져오기 (백엔드 VAPID 키 사용)
 * @returns {Promise<string>} FCM 토큰
 */
export const getFCMToken = async () => {
  try {
    //  알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("알림 권한이 거부되었습니다.");
      return null;
    }

    // Firebase Console에서 확인한 실제 VAPID 키 사용
    const vapidKey = "BJgUcYv9TLfUczNXJw9b9DndNQCYKZT3fONXti2ykjQVdPNVAtJgr75OdIQDtppCiGOQuYP1JKUfMFuj-4SA9w8";
    
    console.log("사용 중인 VAPID 키:", vapidKey);
    console.log("Firebase 설정:", firebaseConfig);

    //  FCM 토큰 생성
    const token = await getToken(messaging, { vapidKey });
    console.log("FCM 토큰 생성 성공:", token);
    return token;
  } catch (error) {
    console.error("FCM 토큰 가져오기 실패:", error);
    return null;
  }
};

/**
 * 포그라운드 메시지 수신 설정
 * @param {Function} callback 메시지 수신 시 실행할 콜백 함수
 */
export const onForegroundMessage = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("포그라운드 메시지 수신:", payload);

    // 브라우저 알림 표시
    if (payload.notification) {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
      });
    }

    // 콜백 함수 실행
    if (callback) {
      callback(payload);
    }
  });
};

/**
 * FCM 토큰을 백엔드에 등록
 * @param {string} token FCM 토큰
 * @param {number} memberId 회원 ID
 * @returns {Promise<boolean>} 등록 성공 여부
 */
export const registerFCMToken = async (token, memberId) => {
  try {
    // auth 객체에서 accessToken 가져오기
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const accessToken = authData?.token?.accessToken;
    
    if (!accessToken) {
      throw new Error("Access token이 없습니다");
    }

    console.log("FCM 토큰 등록 요청:", {
      url: "https://srv.woojooin.site/api/fcm/register",
      memberId: memberId,
      token: token,
      hasAccessToken: !!accessToken
    });

    const response = await fetch("https://srv.woojooin.site/api/fcm/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        token: token,
        memberId: memberId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FCM 토큰 등록 실패 응답:", errorText);
      throw new Error(`FCM 토큰 등록 실패: ${response.status}`);
    }

    const result = await response.json();
    console.log("FCM 토큰 등록 성공:", result);
    return true;
  } catch (error) {
    console.error("FCM 토큰 등록 중 오류:", error);
    return false;
  }
};

/**
 * 전체 FCM 설정 프로세스 (토큰 생성 + 백엔드 등록)
 * @param {number} memberId 회원 ID
 * @returns {Promise<string|null>} FCM 토큰 또는 null
 */
export const setupFCM = async (memberId) => {
  try {
    console.log("FCM 설정 시작...");

    // 1. FCM 토큰 생성
    const token = await getFCMToken();
    if (!token) {
      throw new Error("FCM 토큰 생성 실패");
    }

    // 2. 백엔드에 토큰 등록
    const registered = await registerFCMToken(token, memberId);
    if (!registered) {
      throw new Error("FCM 토큰 등록 실패");
    }

    // 3. 로컬 스토리지에 저장 (선택사항)
    localStorage.setItem("fcmToken", token);

    console.log("FCM 설정 완료!");
    return token;
  } catch (error) {
    console.error("FCM 설정 실패:", error);
    return null;
  }
};

export { messaging };
