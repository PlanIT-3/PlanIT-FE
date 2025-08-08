export default [
  {
    path: "/mypage",
    name: "Mypage",
    component: () => import("@/views/mypage/Mypage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage/delete-profile",
    name: "DeleteProfile",
    component: () => import("@/views/mypage/DeleteProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage/change-password",
    name: "ChangePassword",
    component: () => import("@/views/mypage/ChangePassword.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage/edit-profile",
    name: "EditProfile",
    component: () => import("@/views/mypage/EditProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/mypage/edit-account",
    name: "EditAccount",
    component: () => import("@/views/mypage/EditAccount.vue"),
    meta: { requiresAuth: true },
  },
];
