import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InvestmentSurveyView from "../views/onBoarding/InvestmentSurveyView.vue";

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
  ],
});

export default router;
