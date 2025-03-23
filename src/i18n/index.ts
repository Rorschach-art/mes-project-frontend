import { createI18n } from "vue-i18n";
import zh from "./zh";
import en from "./en";
import ja from "./ja";
import ar from "./ar";
import fr from "./fr";

const messages = {
  zh,
  en,
  ja,
  ar,
  fr,
};

const i18n = createI18n({
  legacy: false, // 禁用传统模式
  locale: "zh",
  fallbackLocale: "en",
  messages,
});

export default i18n;
