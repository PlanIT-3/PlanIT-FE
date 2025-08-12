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
  const auth = useAuthStore();
  const token = auth.getaccessToken();
  const isAuthenticated = !!token;

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

export default router;
