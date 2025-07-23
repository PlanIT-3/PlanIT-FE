const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/main",
      name: "main",
      component: MainView,
    },
    {
      path: "/investment-survey",
      name: "InvestmentSurvey",
      component: InvestmentSurveyView,
    },
    {
      path: "/investment-survey/result",
      name: "InvestmentSurveyResult",
      component: InvestmentSurveyResult,
    },
    {
      path: "/bank-select",
      name: "bankSelect",
      component: BankSelectView,
    },
    {
      path: "/bank-login",
      name: "bankLogin",
      component: BankLoginView,
    },
    {
      path: "/bank-linking-success",
      name: "bankLinkingSuccess",
      component: BankLinkingSuccessView,
    },
    {
      path: "/recommend",
      name: "recommend",
      component: RecommendView,
    },
  ],
});

export default router;
