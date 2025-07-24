export default [
    {
      path: "/alarm",
      name: "Alarm",
      component: () => import("@/views/alarm/AlarmView.vue"),
    },
    {
      path: "/alarm/setting",
      name: "AlarmSetting",
      component: () => import("@/views/alarm/AlarmSettingView.vue"),
    },
  ];
  