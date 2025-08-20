import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";
import { initGA } from "./analytics";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Google Analytics 초기화
initGA();

app.mount("#app");
