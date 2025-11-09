import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { cn } from "@/utils";

const LANGUAGES = [
  { code: "ru", countryCode: "RU", nameKey: "languageSwitcher.russian" },
  { code: "en", countryCode: "GB", nameKey: "languageSwitcher.english" },
  { code: "es", countryCode: "ES", nameKey: "languageSwitcher.spanish" },
  { code: "cn", countryCode: "CN", nameKey: "languageSwitcher.chinese" },
];

export default function LanguageSwitcher({ className }) {
  const { i18n, t } = useTranslation("common");
  const current = i18n.resolvedLanguage || i18n.language;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedCurrent = current.startsWith("zh")
    ? "cn"
    : current.split("-")[0];

  const currentLang =
    LANGUAGES.find((l) => l.code === normalizedCurrent) || LANGUAGES[0];

  const handleChange = async (code) => {
    if (code === normalizedCurrent) return;
    await i18n.changeLanguage(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", code);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative inline-block text-left", className)}>
      {/* Кнопка текущего языка */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
      >
        <ReactCountryFlag
          countryCode={currentLang.countryCode}
          svg
          style={{
            width: "1.4em",
            height: "1.4em",
            borderRadius: "2px",
          }}
          title={t(currentLang.nameKey)}
        />
        <span>{t(currentLang.nameKey)}</span>
        <svg
          className={cn(
            "h-4 w-4 ml-1 text-gray-500 transition-transform",
            open ? "rotate-180" : ""
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Выпадающий список */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-50 animate-fade-in">
          <ul className="py-1 text-sm text-gray-700">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleChange(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 transition",
                    normalizedCurrent === lang.code
                      ? "text-blue-600 font-semibold"
                      : ""
                  )}
                >
                  <ReactCountryFlag
                    countryCode={lang.countryCode}
                    svg
                    style={{
                      width: "1.4em",
                      height: "1.4em",
                      borderRadius: "2px",
                    }}
                    title={t(lang.nameKey)}
                  />
                  <span>{t(lang.nameKey)}</span>
                  {normalizedCurrent === lang.code && (
                    <svg
                      className="ml-auto h-4 w-4 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
