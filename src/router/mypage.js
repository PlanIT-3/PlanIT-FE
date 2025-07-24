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
];
