import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import i18n from "@/i18n";

import Layout from "@/components/Layout.jsx";
import Home from "@/pages/Home.jsx";
import Transform from "@/pages/Transform.jsx";
import Gallery from "@/pages/Gallery.jsx";
import Pricing from "@/pages/Pricing.jsx";
import API from "@/pages/API.jsx";
import SignInPage from "@/pages/SignInPage.jsx";
import SignUpPage from "@/pages/SignUpPage.jsx";
import ToastTest from "@/pages/ToastTest.jsx";
import ProtectedRoute from "@/routes/ProtectedRoute.jsx";

// ✅ Добавим NotFound
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-4">404 — Page Not Found</h1>
      <a href="/" className="text-blue-600 hover:underline">
        Go Home
      </a>
    </div>
  );
}

import "@/styles/external/vendors.css";
import "@/styles/external/main.css";
import "@/index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) throw new Error("Missing Clerk Publishable Key");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ✅ Главная — без защиты
      { path: "/", element: <Home /> },

      // ✅ Страницы с защитой (требуют входа)
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "transform",
        element: (
          <ProtectedRoute>
            <Transform />
          </ProtectedRoute>
        ),
      },
      {
        path: "gallery",
        element: (
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        ),
      },

      // ✅ Публичные страницы
      { path: "pricing", element: <Pricing /> },
      { path: "api", element: <API /> },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "toast-test", element: <ToastTest /> },

      // ✅ Fallback
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/home"
      afterSignUpUrl="/home"
      afterSignOutUrl="/"
    >
      <HelmetProvider>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center text-lg">
              {i18n.t("loading")}
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
        <Analytics />
      </HelmetProvider>
    </ClerkProvider>
  </React.StrictMode>
);
