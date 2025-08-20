import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";
import { initializePushNotifications } from "./services/pushNotifications";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// iOS Capacitor 푸시 알림 초기화
initializePushNotifications();

app.mount("#app");
