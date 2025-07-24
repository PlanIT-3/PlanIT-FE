import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MainView from "../views/MainView.vue";

import RewardView from "@/views/reward/RewardView.vue";
import authRoutes from "./auth";
import onBoardingRoutes from "./onBoarding";
import goalRoutes from "./goal";
import recommendationRoutes from "./recommendation";
import mypageRoutes from "./mypage";
import alarmRoutes from "./alarm";
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
      path: "/reward",
      name: "reward",
      component: RewardView,
      meta: { layout: "noHeader" },
    },

    ...authRoutes,
    ...onBoardingRoutes,
    ...goalRoutes,
    ...recommendationRoutes,
    ...mypageRoutes,
    ...alarmRoutes,
  ],
});

export default router;
