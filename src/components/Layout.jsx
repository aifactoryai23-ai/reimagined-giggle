// src/components/Layout.jsx
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Wand, Image, CreditCard, Code } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import LanguageSwitcher from "@/components/LanguageSwitcher.jsx";

// ✅ импортируем Toaster
import { Toaster } from "sonner";

const NAV_ITEMS = [
  { key: "home", path: "Home", icon: Home, requiresAuth: false },
  { key: "transform", path: "Transform", icon: Wand, requiresAuth: true },
  { key: "gallery", path: "Gallery", icon: Image, requiresAuth: true },
  { key: "pricing", path: "Pricing", icon: CreditCard, requiresAuth: false },
  { key: "api", path: "API", icon: Code, requiresAuth: false }
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const { t } = useTranslation("common");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = React.useMemo(() => NAV_ITEMS, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-gray-900">
      <style>{`
        :root {
          --primary-50: #f0f9ff;
          --primary-100: #e0f2fe;
          --primary-500: #0ea5e9;
          --primary-600: #0284c7;
          --primary-700: #0369a1;
        }
      `}</style>

      {/* NAVIGATION */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 text-gray-900"
            >
              <img
                src="/interiordesignbot_logo.png"
                className="h-10 w-10 object-contain rounded-lg"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold">StageAI</span>
                <span className="text-xs text-gray-500">
                  {t("layout.tagline")}
                </span>
              </div>
            </Link>

            {/* NAVIGATION LINKS */}
            <div className="hidden items-center gap-1 md:flex">
              <SignedIn>
                {navItems.map((item) => {
                  const isActive = location.pathname === createPageUrl(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
                {navItems
                  .filter((i) => !i.requiresAuth)
                  .map((item) => {
                    const isActive = location.pathname === createPageUrl(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={createPageUrl(item.path)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

            {/* RIGHT SIDE (Chat + Auth) */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher className="hidden sm:flex" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://t.me/geoava", "_blank")}
              >
                {t("buttons.chat")}
              </Button>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    size="sm"
                  >
                    {t("buttons.signIn")}
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
            <LanguageSwitcher />
            <SignedIn>
              {navItems.map((item) => {
                const isActive = location.pathname === createPageUrl(item.path);
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
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
              {navItems
                .filter((i) => !i.requiresAuth)
                .map((item) => {
                  const isActive = location.pathname === createPageUrl(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${
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
        </div>
      </nav>

      {/* MAIN */}
      <main className="pt-24">
        <Outlet />
      </main>

      {/* 🔔 TOASTER */}
      <Toaster position="top-right" richColors closeButton />

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <img
                  src="/interiordesignbot_logo.png"
                  className="h-8 w-8 object-contain rounded-lg"
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

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500 md:flex-row">
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

