// src/components/Layout.jsx
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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

// ✅ импортируем Toaster
import { Toaster } from "sonner";

const navItems = [
  { name: "Home", path: "Home", icon: Home },
  { name: "Transform", path: "Transform", icon: Wand },
  { name: "Gallery", path: "Gallery", icon: Image },
  { name: "Pricing", path: "Pricing", icon: CreditCard },
  { name: "API", path: "API", icon: Code },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                  Pro staging in seconds
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
                      {item.name}
                    </Link>
                  );
                })}
              </SignedIn>

              <SignedOut>
                {navItems
                  .filter((i) => i.name !== "Gallery" && i.name !== "Transform")
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
                        {item.name}
                      </Link>
                    );
                  })}
              </SignedOut>
            </div>

            {/* RIGHT SIDE (Chat + Auth) */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://t.me/geoava", "_blank")}
              >
                Chat with me
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
                    Sign in
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
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
                    {item.name}
                  </Link>
                );
              })}
            </SignedIn>

            <SignedOut>
              {navItems
                .filter((i) => i.name !== "Gallery" && i.name !== "Transform")
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
                      {item.name}
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
                Transform any property photo into a polished, professionally
                staged listing in just a few seconds.
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Product</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <Link to={createPageUrl("Transform")} className="block hover:text-gray-900">
                  Transform photos
                </Link>
                <Link to={createPageUrl("Gallery")} className="block hover:text-gray-900">
                  Gallery
                </Link>
                <Link to={createPageUrl("Pricing")} className="block hover:text-gray-900">
                  Pricing
                </Link>
                <Link to={createPageUrl("API")} className="block hover:text-gray-900">
                  API access
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Company</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <a
                  href="https://t.me/geoava"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-gray-900"
                >
                  Contact
                </a>
                <Link to={createPageUrl("Pricing")} className="block hover:text-gray-900">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 text-sm text-gray-500 md:flex-row">
            <span>
              © {new Date().getFullYear()} StageAI - Interior design AI app. All rights reserved.
            </span>
            <div className="flex gap-4">
              <a href="/privacy-policy.html" className="hover:text-gray-900">
                Privacy policy
              </a>
              <a href="/terms-of-services.html" className="hover:text-gray-900">
                Terms of services
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
