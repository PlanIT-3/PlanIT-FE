import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InvestmentSurveyView from "../views/onBoarding/InvestmentSurveyView.vue";
import InvestmentSurveyResult from "../views/onBoarding/InvestmentSurveyResult.vue";
import BankSelectView from "../views/onBoarding/BankSelectView.vue";
import BankLoginView from "../views/onBoarding/BankLoginView.vue";
import BankLinkingSuccessView from "../views/onBoarding/BankLinkingSuccessView.vue";
import BankSelectView from "../views/onBoarding/BankSelectView.vue";
import BankLoginView from "../views/onBoarding/BankLoginView.vue";
import RecommendView from "../views/recommendation/RecommendView.vue";
import MainView from "../views/MainView.vue";
import LoginPage from "@/views/onBoarding/LoginPage.vue";
import GoalEditView from "../views/goal/GoalEditView.vue";


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
    {
      path: "/main",
      name: "main",
      component: MainView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/goal/edit",
      name: "GoalEditView",
      component: GoalEditView,
    },
  ],
});

export default router;
