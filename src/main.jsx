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

import ProtectedRoute from "@/routes/ProtectedRoute.jsx";

import "@/styles/external/vendors.css";
import "@/styles/external/main.css";
import "@/index.css";
import ToastTest from "@/pages/ToastTest";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) throw new Error("Missing Clerk Publishable Key");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )
      },
      { path: "pricing", element: <Pricing /> },
      { path: "api", element: <API /> },
      { path: "sign-in", element: <SignInPage /> },
      { path: "sign-up", element: <SignUpPage /> },
      { path: "toast-test", element: <ToastTest /> },

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
            <div className="flex h-screen items-center justify-center">
              {i18n.t("common:loading")}
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


