export default [
  {
    path: '/bank-select',
    name: 'bank-select',
    component: () => import('../views/onBoarding/BankSelectView.vue'),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/bank-login",
    name: "bankLogin",
    component: () => import('../views/onBoarding/BankLoginView.vue'),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/bank-linking-success",
    name: "bankLinkingSuccess",
    component: () => import('../views/onBoarding/BankLinkingSuccessView.vue'),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import('../views/onBoarding/LoginPage.vue'),
    meta: { layout: "noHeader" },
  },
  {
    path: "/investment-survey",
    name: "investmentSurvey",
    component: () => import('../views/onBoarding/InvestmentSurveyView.vue'),
    meta: { layout: "onboardHeader", requiresAuth: true },
  },
  {
    path: "/investment-survey/result",
    name: "investmentSurveyResult",
    component: () => import('../views/onBoarding/InvestmentSurveyResult.vue'),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/onboard-loading",
    name: "onboardLoading",
    component: () => import('../views/onBoarding/OnboardLoadingView.vue'),
    meta: { layout: "noHeader" },
  },
  {
    path: "/survey-loading",
    name: "surveyLoading",
    component: () => import('../views/onBoarding/SurveyLoadingView.vue'),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/survey-result",
  }
];

