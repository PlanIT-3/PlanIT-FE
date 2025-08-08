export default [
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/auth/SignupView.vue"),
    meta: { layout: "noHeader" },
  },
  {
    path: "/agreement",
    name: "agreement",
    component: () => import("../views/auth/AgreementView.vue"),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/passwordfind",
    name: "passwordfind",
    component: () => import("../views/auth/PasswordFindView.vue"),
    meta: { layout: "noHeader", requiresAuth: true },
  },
  {
    path: "/passwordreset",
    name: "passwordreset",
    component: () => import("../views/auth/PasswordResetView.vue"),
    meta: { layout: "noHeader", requiresAuth: true },
  },
];
