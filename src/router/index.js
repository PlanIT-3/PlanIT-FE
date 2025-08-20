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
import { useAuthStore } from "@/stores/auth";
import { trackPage } from "@/analytics";

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
  // 로컬스토리지에서 직접 토큰 확인
  const authStr = localStorage.getItem("auth");
  let isAuthenticated = false;

  if (authStr) {
    try {
      const auth = JSON.parse(authStr);
      console.log("🔍 auth:", auth);
      isAuthenticated = !!auth.token?.accessToken;
    } catch (error) {
      console.error("Auth parsing error:", error);
      isAuthenticated = false;
    }
  }

  console.log("🔍 라우터 가드:", {
    to: to.path,
    isAuthenticated,
    hasAuth: !!authStr,
    authData: authStr ? JSON.parse(authStr) : null,
  });

  if (to.path === "/") {
    if (isAuthenticated) {
      next({ name: "main" });
    } else {
      next({ name: "onboardLoading" });
    }
    return;
  }

  if (to.meta?.requiresAuth && !isAuthenticated) {
    next({ name: "onboardLoading" });
    return;
  }

  if (to.name === "login" && isAuthenticated) {
    next({ name: "main" });
    return;
  }

  next();
});

// 페이지 뷰 추적
router.afterEach((to) => {
  trackPage(to.name || to.path);
});

export default router;
