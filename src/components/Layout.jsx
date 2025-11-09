// src/components/Layout.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Wand, Image, CreditCard, Code } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import LanguageSwitcher from "@/components/LanguageSwitcher.jsx";
import { Toaster } from "sonner";

const NAV_ITEMS = [
  { key: "home", path: "Home", icon: Home, requiresAuth: false },
  { key: "transform", path: "Transform", icon: Wand, requiresAuth: true },
  { key: "gallery", path: "Gallery", icon: Image, requiresAuth: true },
  { key: "pricing", path: "Pricing", icon: CreditCard, requiresAuth: false },
  { key: "api", path: "API", icon: Code, requiresAuth: false },
];

export default function Layout() {
  const location = useLocation();
  const { t } = useTranslation("common");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openChat = () => window.open("https://t.me/geoava", "_blank");

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-gray-900">
      {/* === HEADER === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-[#FAFAF9]/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between w-full px-4 py-3 gap-2">
          {/* === 1️⃣ Верхняя часть для мобильных / левая часть для десктопа === */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            {/* ЛОГОТИП */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/interiordesignbot_logo.png"
                alt="StageAI Logo"
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-lg font-bold text-gray-900">StageAI</span>
            </Link>

            {/* Правая часть (только для мобильных) */}
            <div className="flex items-center gap-2 sm:hidden">
              <LanguageSwitcher />
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "h-8 w-8",
                      userButtonAvatarBox: "h-8 w-8",
                    },
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3"
                  >
                    {t("buttons.signIn")}
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          {/* === 2️⃣ Навигация (на мобильных — вторая строка, на десктопе — центр) === */}
          <div className="flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-4 order-last sm:order-none">
            <SignedIn>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === createPageUrl(item.path);
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(`layout.nav.${item.key}`)}
                  </Link>
                );
              })}
            </SignedIn>

            <SignedOut>
              {NAV_ITEMS.filter((i) => !i.requiresAuth).map((item) => {
                const isActive = location.pathname === createPageUrl(item.path);
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(`layout.nav.${item.key}`)}
                  </Link>
                );
              })}
            </SignedOut>
          </div>

          {/* === 3️⃣ Правая часть (только для десктопа) === */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={openChat}
            >
              {t("buttons.chat")}
            </Button>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonBox: "h-8 w-8 sm:h-9 sm:w-9",
                    userButtonAvatarBox: "h-8 w-8 sm:h-9 sm:w-9",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4"
                >
                  {t("buttons.signIn")}
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* === MAIN === */}
      <main className="pt-[9.5rem] sm:pt-[7rem] pb-24">
        <Outlet />
      </main>

      {/* === TOASTER === */}
      <Toaster position="top-right" richColors closeButton />

      {/* === FOOTER === */}
      <footer className="mt-20 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <img
                  src="/interiordesignbot_logo.png"
                  alt="logo"
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-lg font-bold">StageAI</span>
              </div>
              <p className="max-w-sm text-sm text-gray-600">
                {t("layout.footer.description")}
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">{t("layout.footer.product")}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link to={createPageUrl("Transform")} className="block hover:text-gray-900">
                  {t("layout.footer.transform")}
                </Link>
                <Link to={createPageUrl("Gallery")} className="block hover:text-gray-900">
                  {t("layout.footer.gallery")}
                </Link>
                <Link to={createPageUrl("Pricing")} className="block hover:text-gray-900">
                  {t("layout.footer.pricing")}
                </Link>
                <Link to={createPageUrl("API")} className="block hover:text-gray-900">
                  {t("layout.footer.api")}
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">{t("layout.footer.company")}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <a
                  href="https://t.me/geoava"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-gray-900"
                >
                  {t("layout.footer.contact")}
                </a>
                <Link to={createPageUrl("Pricing")} className="block hover:text-gray-900">
                  {t("layout.footer.upgrade")}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500">
            <span>{t("layout.footer.rights", { year: new Date().getFullYear() })}</span>
            <div className="flex gap-4">
              <a href="/privacy-policy.html" className="hover:text-gray-900">
                {t("layout.footer.privacy")}
              </a>
              <a href="/terms-of-services.html" className="hover:text-gray-900">
                {t("layout.footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
