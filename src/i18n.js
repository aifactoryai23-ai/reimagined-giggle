import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ✅ путь теперь указывает на /src/locales/
const translationModules = import.meta.glob("./locales/*/*.json", {
  eager: true,
  import: "default",
});

const resources = Object.entries(translationModules).reduce((acc, [path, module]) => {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) return acc;
  const [, lng, ns] = match;
  acc[lng] = acc[lng] || {};
  acc[lng][ns] = module;
  return acc;
}, {});

const supportedLanguages = Object.keys(resources);
const namespaces = Array.from(
  new Set(Object.values(resources).flatMap((lngNamespaces) => Object.keys(lngNamespaces)))
);

const getDefaultLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }
  const stored = window.localStorage.getItem("lang");
  if (stored && supportedLanguages.includes(stored)) {
    return stored;
  }
  const browserLanguage = navigator.language?.toLowerCase() || "";
  if (browserLanguage.startsWith("ru")) return "ru";
  if (browserLanguage.startsWith("es")) return "es";
  if (browserLanguage.startsWith("zh") || browserLanguage.startsWith("cn")) return "cn";
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDefaultLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  ns: namespaces,
  defaultNS: "common",
  returnObjects: true,
  interpolation: { escapeValue: false },
});

if (import.meta.env.DEV) {
  console.log("🌍 Loaded i18n resources:", resources);
  console.log("✅ Supported languages:", supportedLanguages);
  console.log("📦 Namespaces detected:", namespaces);
  console.log("🌐 Default language:", getDefaultLanguage());
}

i18n.on("languageChanged", (lng) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("lang", lng);
  if (import.meta.env.DEV) {
    console.log(`🌀 Language changed to: ${lng}`);
  }
});

export default i18n;
