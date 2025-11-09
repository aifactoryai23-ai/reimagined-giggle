import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useHighlightEffect from "@/hooks/useHighlightEffect";
import "@/styles/highlight.css";
import "@/styles/shine-buttons.css";
import {
  ArrowRight,
  Wand,
  Zap,
  Image,
  Check,
  Brain,
  Sparkles,
  Spotlight,
} from "lucide-react";
import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";

// ✅ Local images
import heroBg from "@/assets/images/background/hero-home.jpg";
import modernImg from "@/assets/images/styles/modern.jpg";
import scandinavianImg from "@/assets/images/styles/scandinavian.jpg";
import minimalImg from "@/assets/images/styles/minimal.jpg";
import cozyImg from "@/assets/images/styles/cozy.jpg";
import beforeImg from "@/assets/images/before-after/before.jpg";
import afterImg from "@/assets/images/before-after/after.jpg";

export default function HomePage() {
  useHighlightEffect();
  const { t } = useTranslation(["home", "common"]);

  const meta = t("meta", { ns: "home", returnObjects: true });
  const heroTitlePrefix = t("hero.titlePrefix", { ns: "home" });
  const heroTitleHighlight = t("hero.titleHighlight", { ns: "home" });
  const heroDescription = t("hero.description", { ns: "home" });
  const heroFree = t("hero.freeTransformations", { ns: "home" });
  const heroNoCard = t("hero.noCardRequired", { ns: "home" });

  const benefitIconMap = {
    zap: Zap,
    wand: Wand,
    spotlight: Spotlight,
  };

  const benefitsRaw = t("benefits.items", { ns: "home", returnObjects: true });
  const benefits = Array.isArray(benefitsRaw)
    ? benefitsRaw.map((item) => ({
        ...item,
        Icon: benefitIconMap[item.icon] || Sparkles,
      }))
    : [];

  const stylesRaw = t("styles.items", { ns: "home", returnObjects: true });
  const styleImages = {
    modern: modernImg,
    scandinavian: scandinavianImg,
    minimal: minimalImg,
    cozy: cozyImg,
  };
  const styles = Array.isArray(stylesRaw)
    ? stylesRaw.map((style) => ({
        ...style,
        image: styleImages[style.id] || modernImg,
      }))
    : [];

  const priceListItems = t("priceList.items", { ns: "home", returnObjects: true }) || [];
  const perfectForItems = t("perfectFor.items", { ns: "home", returnObjects: true }) || [];
  const transformation = t("transformation", { ns: "home", returnObjects: true });
  const cta = t("cta", { ns: "home", returnObjects: true });

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>{meta?.title}</title>
        <meta name="description" content={meta?.description} />
        <meta name="keywords" content={meta?.keywords} />
        <meta property="og:title" content={meta?.ogTitle} />
        <meta property="og:description" content={meta?.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homestaging-geoava.vercel.app" />
        <meta property="og:image" content={meta?.ogImage} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-12 sm:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-60" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl space-y-6 transition-all">
            <h1 className="text-4xl md:text-7xl font-bold mb-3 leading-snug sm:leading-tight">
              {heroTitlePrefix}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {heroTitleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-600 mb-4 sm:mb-8 max-w-2xl leading-relaxed sm:leading-normal">
              {heroDescription}
            </p>

            {/* ✅ Центрируем кнопки на мобильных и размещаем в одну строку на больших экранах */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to={createPageUrl("Transform")}>
                  <Button
                    size="lg"
                    className="try-free-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 text-lg px-8"
                  >
                    {t("buttons.tryForFree", { ns: "common" })}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <a href="#ai-transformation" className="no-underline">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    {t("buttons.viewExamples", { ns: "common" })}
                    <Image className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{heroFree}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>{heroNoCard}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("benefits.title", { ns: "home" })}</h2>
            <p className="text-xl text-gray-600">
              <Trans ns="home" i18nKey="benefits.subtitle" components={{ mark: <mark /> }} />
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <benefit.Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICE LIST */}
      <section className="py-8">
        <div className="flex justify-center">
          <div className="max-w-xl w-full p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-lg hover:shadow-blue-300/60 hover:scale-[1.02] transition-all duration-500 text-center shadow-blue-100/40">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg mx-auto">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">
              {t("priceList.title", { ns: "home" })} <br />
              <span className="text-gray-600 text-base font-normal">
                <Trans ns="home" i18nKey="priceList.subtitle" components={{ mark: <mark /> }} />
              </span>
            </h3>
            <div className="text-gray-700 text-sm leading-relaxed font-mono text-left bg-white/60 p-4 rounded-xl border border-gray-100 shadow-inner overflow-x-auto whitespace-pre">
              {priceListItems.map((item) => (
                <div key={item.id}>
                  {item.text}
                  {item.extra ? (
                    <span className="font-bold text-gray-800">{item.extra}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">{t("perfectFor.title", { ns: "home" })}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {perfectForItems.map((item, index) => (
              <Card key={item.id} className="p-6">
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-3">
                  <Trans ns="home" i18nKey={`perfectFor.items.${index}.desc1`} components={{ mark: <mark /> }} />
                </p>
                <p className="text-gray-600 text-justify leading-relaxed">
                  <Trans ns="home" i18nKey={`perfectFor.items.${index}.desc2`} components={{ mark: <mark /> }} />
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Style */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("styles.title", { ns: "home" })}</h2>
            <p className="text-xl text-gray-600">
              {t("styles.subtitle", { ns: "home" })}
              <br />
              <em>{t("styles.note", { ns: "home" })}</em>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {styles.map((style) => (
              <div
                key={style.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={style.image}
                  alt={style.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-bold">{style.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section id="ai-transformation" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{transformation?.title}</h2>
            <p className="text-xl text-gray-600">{transformation?.subtitle}</p>
          </div>

          <BeforeAfterSlider beforeImage={beforeImg} afterImage={afterImg} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl transition-transform">
            <h2 className="text-4xl font-bold text-white mb-4">{cta?.title}</h2>
            <p className="text-xl text-blue-100 mb-8">{cta?.subtitle}</p>
            <Link to={createPageUrl("Transform")}>
              <Button size="lg" variant="cta" className="try-free-button px-8">
                {t("buttons.tryForFree", { ns: "common" })}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


