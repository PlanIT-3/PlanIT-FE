// Google Analytics 4 간단 구현

const GA_ID = 'G-KP0NDR0HLP'

// 초기화
export const initGA = () => {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() { window.dataLayer.push(arguments) }
  
  gtag('js', new Date())
  gtag('config', GA_ID)
}

// 페이지 조회
export const trackPage = (page) => {
  if (window.gtag) {
    gtag('event', 'page_view', { page_title: page })
  }
}

// 이벤트 추적
export const trackEvent = (action, category = 'general') => {
  if (window.gtag) {
    gtag('event', action, { event_category: category })
  }
}

// 금융 앱 특화 이벤트들
export const trackGoalCreated = (goalType, amount) => {
  if (window.gtag) {
    gtag('event', 'goal_created', {
      event_category: 'goal',
      goal_type: goalType,
      goal_amount: amount
    })
  }
}

export const trackAccountLinked = (accountType, bank) => {
  if (window.gtag) {
    gtag('event', 'account_linked', {
      event_category: 'account',
      account_type: accountType,
      bank_name: bank
    })
  }
}

export const trackInvestmentRecommendation = (productType, amount) => {
  if (window.gtag) {
    gtag('event', 'investment_recommendation_view', {
      event_category: 'investment',
      product_type: productType,
      recommended_amount: amount
    })
  }
}

export const trackReportView = (reportType) => {
  if (window.gtag) {
    gtag('event', 'report_viewed', {
      event_category: 'report',
      report_type: reportType
    })
  }
}

export const trackTaxSavingsView = (savingsAmount) => {
  if (window.gtag) {
    gtag('event', 'tax_savings_viewed', {
      event_category: 'report',
      savings_amount: savingsAmount
    })
  }
}