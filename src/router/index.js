import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InvestmentSurveyView from "../views/onBoarding/InvestmentSurveyView.vue";
import InvestmentSurveyResult from "../views/onBoarding/InvestmentSurveyResult.vue";
import SignupView from "@/views/auth/SignupView.vue";
import LoginView from "@/views/auth/LoginView.vue";

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

    { path: "/signup", name: "signup", component: SignupView },

    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
