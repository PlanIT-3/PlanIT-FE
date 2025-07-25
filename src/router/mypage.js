export default [
  {
    path: "/mypage",
    name: "Mypage",
    component: () => import("@/views/mypage/Mypage.vue"),
  },
  {
    path: "/mypage/delete-profile",
    name: "DeleteProfile",
    component: () => import("@/views/mypage/DeleteProfile.vue"),
  },
  {
    path: "/mypage/change-password",
    name: "ChangePassword",
    component: () => import("@/views/mypage/ChangePassword.vue"),
  },
];
