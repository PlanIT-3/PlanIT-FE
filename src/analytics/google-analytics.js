// Google Analytics 설정 및 추적 함수들

// Google Analytics 설정 ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// Google Analytics 초기화
export const initGA = () => {
  // 이미 로드되었는지 확인
  if (window.gtag) {
    console.log('Google Analytics already initialized')
    return
  }

  // gtag 스크립트 로드
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // gtag 초기화
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    // 개인정보 보호 설정
    anonymize_ip: true,
    send_page_view: false, // 수동으로 페이지뷰 추적
    // 쿠키 만료 시간 (90일)
    cookie_expires: 90 * 24 * 60 * 60
  })

  console.log('Google Analytics initialized:', GA_MEASUREMENT_ID)
}

// 페이지뷰 추적
export const trackPageView = (page_title, page_location = window.location.href) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_title,
      page_location
    })
    console.log('GA Page View:', page_title, page_location)
  }
}

// 커스텀 이벤트 추적
export const trackEvent = (action, category = 'engagement', label = '', value = 0) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
    console.log('GA Event:', action, category, label, value)
  }
}

// 로그인 이벤트
export const trackLogin = (method = 'email') => {
  trackEvent('login', 'auth', method)
}

// 회원가입 이벤트  
export const trackSignup = (method = 'email') => {
  trackEvent('sign_up', 'auth', method)
}

// 목표 생성 이벤트
export const trackGoalCreated = (goalType, amount = 0) => {
  trackEvent('goal_created', 'goal', goalType, amount)
}

// ISA 계좌 등록 이벤트
export const trackIsaRegistration = () => {
  trackEvent('isa_registration', 'account', 'isa_account')
}

// 예적금 등록 이벤트
export const trackDepositRegistration = () => {
  trackEvent('deposit_registration', 'account', 'deposit_account')
}

// 투자 추천 클릭 이벤트
export const trackInvestmentRecommendation = (recommendationType) => {
  trackEvent('investment_recommendation_click', 'recommendation', recommendationType)
}

// 리포트 조회 이벤트
export const trackReportView = (reportType) => {
  trackEvent('report_view', 'report', reportType)
}

// 에러 추적
export const trackError = (errorMessage, errorLocation = '') => {
  trackEvent('error', 'error', `${errorLocation}: ${errorMessage}`)
}

// 사용자 행동 추적
export const trackUserAction = (action, section, details = '') => {
  trackEvent(action, 'user_interaction', `${section}_${details}`)
}