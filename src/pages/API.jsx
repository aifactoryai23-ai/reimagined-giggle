import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, Cpu, ArrowRight } from "lucide-react";
import useUnderlineEffect from "@/hooks/useUnderlineEffect";
import "@/styles/underline.css";
import { useTranslation } from "react-i18next";

export default function APIPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useUnderlineEffect();
  const { t } = useTranslation(["api", "common"]);

  const hero = t("hero", { ns: "api", returnObjects: true }) || {};
  const featuresRaw = t("features", { ns: "api", returnObjects: true }) || [];
  const code = t("code", { ns: "api", returnObjects: true }) || {};
  const useCases = t("useCases", { ns: "api", returnObjects: true }) || {};
  const cta = t("cta", { ns: "api", returnObjects: true }) || {};

  const iconMap = {
    zap: Zap,
    shield: Shield,
    cpu: Cpu
  };

  const features = Array.isArray(featuresRaw)
    ? featuresRaw.map((feature) => ({
        ...feature,
        Icon: iconMap[feature.icon] || SparkIconFallback
      }))
    : [];

  return (
    <div className="min-h-screen px-6 pb-16 pt-32 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl text-center">
        {/* HEADER */}
        <div className="mb-16">
          <p className="text-blue-600 font-medium uppercase tracking-wide">{hero.badge}</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">{hero.title}</h1>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">{hero.description}</p>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id || feature.title}
              className="transition-transform"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* === CODE EXAMPLE === */}
        <div className="mb-16 text-left">
          <Card className="p-8 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
            {/* Верхняя панель с точками */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm ml-4">{code.filename}</span>
            </div>

            {/* Сам код, с заменой \n на реальные переносы */}
            <pre className="whitespace-pre-wrap text-left">
              <code>{code.snippet?.replace(/\\n/g, "\n")}</code>
            </pre>
          </Card>
        </div>

        {/* USE CASES */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="underline--magical">{useCases.title}</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(useCases.items || []).map((item) => (
              <Card key={item.id} className="p-6">
                <h3 className="font-bold text-xl mb-3">
                  <span className="underline--magical">{item.title}</span>
                </h3>
                <p className="text-gray-600 mb-3">{item.subtitle}</p>
                <p className="text-gray-600 text-justify leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-16 text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">{cta.title}</h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">{cta.description}</p>
            <a href="https://t.me/geoava" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                {cta.button}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SparkIconFallback(props) {
  return <Code {...props} />;
}
