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
import reportRoutes from "./report";
import { STORAGE_KEYS } from "@/utils/constants";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainView,
      meta: { requiresAuth: true },
    },
    {
      path: "/main",
      name: "main",
      component: MainView,
      meta: { requiresAuth: true },
    },

    {
      path: "/reward",
      name: "reward",
      component: RewardView,
      meta: { layout: "noHeader", requiresAuth: true },
    },

    ...authRoutes,
    ...onBoardingRoutes,
    ...goalRoutes,
    ...recommendationRoutes,
    ...mypageRoutes,
    ...alarmRoutes,
    ...reportRoutes,
  ],
});

// 인증이 필요한 페이지 접근 제어
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const isAuthenticated = !!token;

  // 루트 경로 접근시 로그인 상태에 따라 리다이렉트
  if (to.path === "/") {
    if (isAuthenticated) {
      next({ name: "main" });
    } else {
      next({ name: "onboardLoading" });
    }
    return;
  }

  // 인증이 필요한 페이지인데 로그인이 안되어 있으면 온보딩으로
  if (to.meta?.requiresAuth && !isAuthenticated) {
    next({ name: "onboardLoading" });
    return;
  }

  // 로그인 페이지에 이미 로그인된 상태로 접근하면 메인으로
  if (to.name === "login" && isAuthenticated) {
    next({ name: "main" });
    return;
  }

  next();
});

export default router;
