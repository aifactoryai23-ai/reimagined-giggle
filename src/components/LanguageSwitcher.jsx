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
    <div
      ref={ref}
      className={cn("relative inline-block text-left", className)}
      aria-label={t(currentLang.nameKey)}
    >
      {/* Кнопка текущего языка */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-md border border-gray-300 bg-transparent px-1.5 py-1.5 text-gray-700 transition hover:bg-gray-50 sm:gap-2 sm:px-3 sm:py-2"
        aria-haspopup="listbox"
        aria-expanded={open}
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
        <span className="hidden text-sm font-medium sm:inline">
          {t(currentLang.nameKey)}
        </span>
        <svg
          className={cn(
            "ml-1 hidden h-4 w-4 text-gray-500 transition-transform sm:block",
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
        <div className="absolute right-0 z-50 mt-1 w-36 sm:w-48 animate-fade-in rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <ul className="py-1 text-sm text-gray-700">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleChange(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-2 transition hover:bg-gray-100",
                    normalizedCurrent === lang.code
                      ? "font-semibold text-blue-600"
                      : ""
                  )}
                  aria-label={t(lang.nameKey)}
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
                  <span className="inline text-sm">{t(lang.nameKey)}</span>
                  {normalizedCurrent === lang.code && (
                    <svg
                      className="ml-auto hidden h-4 w-4 text-blue-500 sm:block"
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
