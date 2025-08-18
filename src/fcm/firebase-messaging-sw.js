// Firebase 서비스 워커 (백그라운드 메시지 처리)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase 설정 (메인 설정과 동일해야 함)
const firebaseConfig = {
  apiKey: "AIzaSyDSp9ALB76z9ji2ZVceXXLtIxDiGo-YFSw",
  authDomain: "plan-it-af398.firebaseapp.com",
  projectId: "plan-it-af398",
  storageBucket: "plan-it-af398.firebasestorage.app",
  messagingSenderId: "197940284583",
  appId: "1:197940284583:web:f131071c1cd9d1ab3c9f82",
  measurementId: "G-HGXWH97ZN3"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// FCM 메시징 인스턴스
const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload);

  const notificationTitle = payload.notification?.title || 'PlanIT 알림';
  const notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 있습니다.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'planit-notification',
    requireInteraction: true, // 사용자가 직접 닫을 때까지 유지
    actions: [
      {
        action: 'open',
        title: '앱 열기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  // 백그라운드 알림 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리
self.addEventListener('notificationclick', (event) => {
  console.log('알림 클릭:', event);
  
  event.notification.close();

  if (event.action === 'open') {
    // 앱 열기
    event.waitUntil(
      clients.openWindow('/') // PlanIT 앱 메인 페이지로 이동
    );
  }
});