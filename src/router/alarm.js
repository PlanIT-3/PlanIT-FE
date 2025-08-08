export default [
    {
      path: "/alarm",
      name: "Alarm",
      component: () => import("@/views/alarm/AlarmView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/alarm/setting",
      name: "AlarmSetting",
      component: () => import("@/views/alarm/AlarmSettingView.vue"),
      meta: { requiresAuth: true },
    },
  ];
  