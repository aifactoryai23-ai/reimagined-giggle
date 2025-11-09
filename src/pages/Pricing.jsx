import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Zap, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useHighlightEffectDelay from "@/hooks/useHighlightEffectDelay";
import "@/styles/highlightDelayed.css";
import { useTranslation } from "react-i18next";

const ICON_MAP = {
  crown: Crown,
  zap: Zap,
  rocket: Rocket,
};

// 🔹 Компонент подсветки фразы с задержкой
function HighlightFeature({ children }) {
  const ref = useRef(null);
  useHighlightEffectDelay(ref, 2000);
  return (
    <span
      ref={ref}
      className="highlight-delayed text-gray-700 text-sm inline-block"
    >
      {children}
    </span>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");

  const refHeader = useRef(null);
  useHighlightEffectDelay(refHeader, 2000);

  useEffect(() => setMounted(true), []);

  const pricing = t("pricing", { returnObjects: true }) || {};
  const planSets = pricing.plans || {};
  const activePlans = planSets[billing] || [];

  const monthlyLabel = pricing.billing?.monthly || "Monthly";
  const yearlyLabel = pricing.billing?.yearly || "Yearly";

  return (
    <div className="min-h-screen px-6 pb-16 pt-32 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl text-center">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-blue-600 font-medium uppercase tracking-wide">
            {pricing.label}
          </p>

          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
            {pricing.title}
          </h1>

          {/* ✅ Highlighted Subheading with delay */}
          <p
            ref={refHeader}
            className="highlight-delayed mt-3 text-lg text-gray-600 inline-block"
          >
            {pricing.subtitle}
          </p>

          {/* ✅ Animated Monthly/Yearly switch */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-medium ${
                billing === "monthly" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {monthlyLabel}
            </span>

            <motion.div
              className="relative w-14 h-8 rounded-full cursor-pointer"
              onClick={() =>
                setBilling(billing === "monthly" ? "yearly" : "monthly")
              }
              initial={false}
              animate={{
                backgroundColor:
                  billing === "yearly"
                    ? "rgb(37, 99, 235)"
                    : "rgb(229, 231, 235)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow"
                animate={{
                  x: billing === "yearly" ? 24 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>

            <span
              className={`text-sm font-medium ${
                billing === "yearly" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {yearlyLabel}
            </span>
          </div>
        </div>

          {/* PRICING GRID */}
          <motion.div
            className={`grid gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch 
              grid-cols-1 sm:grid-cols-2 lg:${
                activePlans.length === 4 ? "grid-cols-4" : "grid-cols-3"
              }`}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.15, duration: 0.6 },
              },
            }}
          >
            {activePlans.map((plan) => {
              const Icon = ICON_MAP[plan.icon] || Crown;
              const features = Array.isArray(plan.features)
                ? plan.features.map((feature) =>
                    typeof feature === "string"
                      ? { text: feature, highlight: false }
                      : {
                          text: feature.text,
                          highlight: Boolean(feature.highlight),
                        }
                  )
                : [];
              return (
                <motion.div
                  key={plan.id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 30 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 12 }}
                >
                <Card
                  className={`relative flex flex-col h-full p-8 shadow-lg hover:shadow-2xl
                    transition-all duration-300 rounded-2xl ${
                      plan.popular
                        ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white"
                        : "border border-gray-200 bg-white"
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {pricing.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon & title */}
                  <div className="mb-6 flex items-center justify-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        plan.popular
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>
          
                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.showPeriod !== false && plan.period && (
                      <span className="text-sm text-gray-500">/{plan.period}</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="text-left space-y-3 mb-8 flex-1">
                    {features.map((feature, idx) => {
                      const highlight = feature.highlight;
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-blue-500 mt-1" />
                          {highlight ? (
                            <HighlightFeature>{feature.text}</HighlightFeature>
                          ) : (
                            <span className="text-gray-700 text-sm">{feature.text}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* Button */}
                  <Button
                    className={`mt-auto w-full rounded-xl py-6 text-base font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      if (plan.id === "custom") {
                        window.location.href =
                          "mailto:sales@interiordesignbot.com?subject=Custom%20Plan%20Request";
                      } else {
                        window.location.href = "/checkout";
                      }
                    }}
                  >
                    {pricing.button}
                  </Button>
                </Card>
              </motion.div>
            );
            })}
          </motion.div>
      </div>
    </div>
  );
}


