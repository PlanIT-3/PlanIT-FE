import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InvestmentSurveyView from "../views/onBoarding/InvestmentSurveyView.vue";
import InvestmentSurveyResult from "../views/onBoarding/InvestmentSurveyResult.vue";
import BankSelectView from "../views/onBoarding/bankSelectView.vue";
import BankLoginView from "../views/onBoarding/bankLoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/onBoarding/investment-survey",
      name: "InvestmentSurvey",
      component: InvestmentSurveyView,
    },
    {
      path: "/onBoarding/investment-survey/result",
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
  ],
});

export default router;
