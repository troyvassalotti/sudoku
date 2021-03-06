import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import App from "./App.vue";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

createApp(App).mount("#app");
