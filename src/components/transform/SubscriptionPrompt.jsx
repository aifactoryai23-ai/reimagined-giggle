import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Rocket, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICON_MAP = {
  crown: Crown,
  zap: Zap,
  rocket: Rocket,
};

export default function SubscriptionPrompt({ onClose, onUpgrade }) {
  const [billing, setBilling] = useState("monthly");
  const { t } = useTranslation(["transform", "common"]);

  const pricing = t("pricing", { ns: "common", returnObjects: true }) || {};
  const planSets = pricing.plans || {};
  const activePlans = planSets[billing] || [];
  const billingLabels = pricing.billing || {};
  const subscriptionTexts = t("subscription", { ns: "transform", returnObjects: true }) || {};
  const badgeLabel = subscriptionTexts.badge || pricing.badge;
  const popularLabel = subscriptionTexts.popular || pricing.badge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-6xl"
      >
        <Card className="relative rounded-3xl shadow-[0_12px_60px_rgba(0,0,0,0.18)] bg-gradient-to-b from-white via-gray-50 to-gray-100">
          <div className="max-h-[85vh] overflow-y-auto rounded-3xl">
            {/* Close */}
            <div className="flex items-center justify-between px-6 sm:px-10 pt-6">
              <button
                onClick={onClose}
                aria-label={subscriptionTexts.close}
                className="text-gray-500 hover:text-gray-700 p-2 -ml-2"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-600 font-medium shadow-sm">
                <Crown className="w-4 h-4" />
                {badgeLabel}
              </div>

              <div className="w-5 h-5 opacity-0" />
            </div>

            {/* Header */}
            <div className="text-center px-6 sm:px-10 mt-2">
              <h2 className="text-[28px] sm:text-4xl font-bold text-gray-900">
                {subscriptionTexts.title}
              </h2>
              <p className="text-gray-600 mt-3 text-base sm:text-lg">
                {subscriptionTexts.description}
              </p>

              {/* Toggle */}
              <div className="mt-6 mb-6 flex items-center justify-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    billing === "monthly" ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {subscriptionTexts.toggle?.monthly || billingLabels.monthly}
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
                        ? "rgb(37,99,235)"
                        : "rgb(229,231,235)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow"
                    animate={{ x: billing === "yearly" ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </motion.div>
                <span
                  className={`text-sm font-medium ${
                    billing === "yearly" ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {subscriptionTexts.toggle?.yearly || billingLabels.yearly}
                </span>
              </div>
            </div>

            {/* Plans */}
            <div className="px-4 sm:px-8 md:px-10 pb-8">
              <div className="grid md:grid-cols-2 gap-8 md:gap-10">
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
                    <Card
                      key={`${billing}-${plan.id}`}
                      className={`h-full flex flex-col rounded-2xl border transition-all duration-300 ${
                        plan.popular
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                        <div className="flex items-start gap-4 mb-6">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              plan.popular
                                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <h3 className="text-xl font-bold">{plan.name}</h3>
                              {plan.popular && (
                                <span className="inline-flex items-center rounded-full bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5">
                                  {popularLabel}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <span className="text-5xl font-bold text-gray-900">
                            {plan.price}
                          </span>
                          {plan.price !== "by request" && plan.period && (
                            <span className="text-sm text-gray-500">/{plan.period}</span>
                          )}
                        </div>

                        <ul className="text-left space-y-3 mb-8">
                          {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-blue-500 mt-1" />
                              <span className={`text-sm text-gray-700 ${feature.highlight ? "font-semibold" : ""}`}>
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          className={`mt-auto w-full rounded-xl py-5 text-base font-semibold ${
                            plan.popular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-900 hover:bg-gray-800 text-white"
                          }`}
                          onClick={() => onUpgrade?.(plan.id)}
                        >
                          {subscriptionTexts.action}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Maybe Later */}
              <div className="text-center mt-10">
                <button
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 text-base font-semibold text-gray-600 hover:text-gray-800 hover:border-gray-400 px-8 py-3 transition-all duration-200"
                >
                  {subscriptionTexts.later}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6 mb-2">
                {subscriptionTexts.secure}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
