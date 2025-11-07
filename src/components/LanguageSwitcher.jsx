import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "EN", nameKey: "languageSwitcher.english" },
  { code: "ru", flag: "🇷🇺", label: "RU", nameKey: "languageSwitcher.russian" },
  { code: "es", flag: "🇪🇸", label: "ES", nameKey: "languageSwitcher.spanish" },
  { code: "zh", flag: "🇨🇳", label: "中文", nameKey: "languageSwitcher.chinese" }
];

export default function LanguageSwitcher({ className }) {
  const { i18n, t } = useTranslation("common");
  const current = i18n.resolvedLanguage || i18n.language;

  const handleChange = (code) => {
    if (code === current) return;
    i18n.changeLanguage(code);
  };

  return (
    <div className={cn("flex items-center gap-2", className)} aria-label={t("languageSwitcher.label")}
    >
      {LANGUAGES.map((language) => {
        const isActive = current === language.code;
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => handleChange(language.code)}
            className={cn(
              "flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition-colors",
              isActive
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-transparent bg-white/40 text-gray-600 hover:border-gray-200 hover:bg-white"
            )}
            aria-pressed={isActive}
            title={t(language.nameKey)}
          >
            <span role="img" aria-hidden="true">
              {language.flag}
            </span>
            <span className="font-medium">{language.label}</span>
          </button>
        );
      })}
    </div>
  );
}
