import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useHighlightEffect from "@/hooks/useHighlightEffect";
import "@/styles/highlight.css";
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

// Clerk
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";

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

  const benefits = [
    {
      icon: Zap,
      title: "Instant Home Glow up",
      desc: "Turn cluttered rooms into magazine-worthy listings instantly — no designers needed.",
    },
    {
      icon: Wand,
      title: "AI Magic Wand",
      desc: "Automatically remove clutter, enhance lighting, and redesign any room with a single click.",
    },
    {
      icon: Spotlight,
      title: "Sell Homes Faster",
      desc: "Stop waiting months — staged homes sell 40% faster.",
    },
  ];

  const styles = [
    { name: "Modern", image: modernImg },
    { name: "Scandinavian", image: scandinavianImg },
    { name: "Minimal", image: minimalImg },
    { name: "Cozy", image: cozyImg },
  ];

  return (
    <div className="overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          AI Home Staging App | Sell & Rent Properties Faster with Virtual Design
        </title>
        <meta
          name="description"
          content="AI-powered home staging app for private sellers, Airbnb hosts, and DIY homeowners. Instantly enhance property photos, remove clutter, and create stunning real estate visuals to sell or rent faster."
        />
        <meta
          name="keywords"
          content="AI home staging, virtual staging, real estate photo enhancement, property photo AI, home listing optimization, Airbnb photo improvement, DIY home seller, sell house faster"
        />
        <meta property="og:title" content="AI Home Staging App | Sell & Rent Faster" />
        <meta
          property="og:description"
          content="Transform property photos with AI. Remove clutter, improve lighting, and virtually stage interiors in seconds."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homestaging-geoava.vercel.app" />
        <meta
          property="og:image"
          content="https://interiordesignbot.com/interiordesignbot_logo.png"
        />
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Properties,
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Sell Faster, Save Your Time
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Turn any interior or exterior photo into a stunning, professionally staged
              listing in seconds. No renovation needed. No designer costs.{" "}
              Just AI-Powered Home Staging.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("Transform")}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 text-lg px-8"
                  >
                    Try for free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <a href="#ai-transformation" className="no-underline">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    View Examples
                    <Image className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>2 free transformations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Home Staging Pro App. Stage Your Listing in a Click, Sell It in a Week
            </h2>
            <p className="text-xl text-gray-600">
              <mark>Professional staging without the wait or cost</mark>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
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
              PRICE LIST <br />
              <span className="text-gray-600 text-base font-normal">
                <mark>for those who don’t use InteriorDesign app</mark>
              </span>
            </h3>
            <div className="text-gray-700 text-sm leading-relaxed font-mono text-left bg-white/60 p-4 rounded-xl border border-gray-100 shadow-inner overflow-x-auto whitespace-pre">
              <div>
                AI does everything .......... $5{" "}
                <span className="font-bold text-gray-800">+ time on your hands</span>
              </div>
              <div>
                You stage it yourself ................. $500{" "}
                <span className="font-bold text-gray-800">+ stress</span>
              </div>
              <div>You hire a designer ................... $1500</div>
              <div>You hire a designer, they wait ........ $2500</div>
              <div>You hire a designer, you disagree ..... $4000</div>
              <div>
                You redesign again after feedback ..... $6000{" "}
                <span className="font-bold text-gray-800">+ tears</span>
              </div>
              <div>
                You do everything again and again ..... $8000{" "}
                <span className="font-bold text-gray-800">+ tears</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Homeowners Selling Their Homes Privately",
                desc1: (
                  <>
                    <mark>Easily prepare your home photos for online listings</mark> — no
                    agents, no expensive staging.
                  </>
                ),
                desc2:
                  "Upload your photos, describe what you'd like changed, and let AI instantly declutter, brighten, and restyle your rooms.",
              },
              {
                title: "DIY Home Sellers on Real Estate Marketplaces",
                desc1: "Make your property stand out among thousands of listings.",
                desc2: (
                  <>
                    Even if you're selling your home on your own,{" "}
                    <mark>AI virtual staging transforms ordinary photos into{" "}
                    professional, magazine-quality images</mark>.
                  </>
                ),
              },
              {
                title:
                  "Short-Term Rental Hosts (Airbnb, Booking, Hotels, Cian, Avito, Trivago, Expedia, Agoda)",
                desc1: "Get more bookings with stunning, well-staged photos.",
                desc2: (
                  <>
                    <mark>AI staging declutters, brightens, and styles interiors</mark> — helping your property look cozy, welcoming, and
                    guest-ready.
                  </>
                ),
              },
              {
                title: "Families Preparing to Move",
                desc1: "Show your home's full potential before you relocate.",
                desc2: (
                  <>
                    Whether your rooms are empty or packed with moving boxes,{" "}
                    <mark>AI staging can virtually refurnish and decorate</mark> them —
                    helping buyers imagine themselves living there.
                  </>
                ),
              },
              {
                title: "Homeowners After Renovation or Redecoration",
                desc1:
                  "Highlight your renovation results with professionally staged visuals.",
                desc2: (
                  <>
                    Use AI {" "}
                    <mark>to visualize your space in styles</mark> —
                    like Scandinavian, modern, or minimalist — and make your listing photos shine.
                  </>
                ),
              },
            ].map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.desc1}</p>
                <p className="text-gray-600 text-justify leading-relaxed">
                  {item.desc2}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Choose Your Style */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Style</h2>
            <p className="text-xl text-gray-600">
              From modern minimalism to cozy warmth — create a style that
              matches your property.
              <br />
              <em>Photography, all 4 in a row, by Nicole Franzen - she is great!</em>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {styles.map((style) => (
              <div
                key={style.name}
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
            <h2 className="text-4xl font-bold mb-4">Look at the AI Transformation</h2>
            <p className="text-xl text-gray-600">One Prompt, Endless Properties</p>
          </div>

          <BeforeAfterSlider beforeImage={beforeImg} afterImage={afterImg} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl transition-transform">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Listings?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start with 2 free transformations. No credit card required.
            </p>
            <Link to={createPageUrl("Transform")}>
              <Button size="lg" variant="cta" className="px-8">
                Try for free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

