import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "../locales/en/common.json";
import enHome from "../locales/en/home.json";
import enAuth from "../locales/en/auth.json";

import ruCommon from "../locales/ru/common.json";
import ruHome from "../locales/ru/home.json";
import ruAuth from "../locales/ru/auth.json";

import esCommon from "../locales/es/common.json";
import esHome from "../locales/es/home.json";
import esAuth from "../locales/es/auth.json";

import zhCommon from "../locales/zh/common.json";
import zhHome from "../locales/zh/home.json";
import zhAuth from "../locales/zh/auth.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    auth: enAuth
  },
  ru: {
    common: ruCommon,
    home: ruHome,
    auth: ruAuth
  },
  es: {
    common: esCommon,
    home: esHome,
    auth: esAuth
  },
  zh: {
    common: zhCommon,
    home: zhHome,
    auth: zhAuth
  }
};

const defaultLanguage = (() => {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = window.localStorage.getItem("appLanguage");
  if (stored && resources[stored]) {
    return stored;
  }

  const browserLanguage = navigator.language?.toLowerCase() || "";
  if (browserLanguage.startsWith("ru")) return "ru";
  if (browserLanguage.startsWith("es")) return "es";
  if (browserLanguage.startsWith("zh")) return "zh";
  return "en";
})();

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  ns: ["common", "home", "auth"],
  defaultNS: "common",
  returnObjects: true
});

i18n.on("languageChanged", (lng) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("appLanguage", lng);
});

export default i18n;
