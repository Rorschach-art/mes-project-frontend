import "./assets/main.css";

import { createApp } from "vue";
import { createHead } from "@unhead/vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // 注入插件

import i18n from "./i18n";
const app = createApp(App);
const head = createHead();
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.use(head);
app.use(pinia);
app.mount("#app");
