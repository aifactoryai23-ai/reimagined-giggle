import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Zap, Shield, Cpu, ArrowRight } from "lucide-react";
import useUnderlineEffect from "@/hooks/useUnderlineEffect";
import "@/styles/underline.css";

export default function APIPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useUnderlineEffect();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Process thousands of property photos hourly with our optimized AI infrastructure, ensuring same-day delivery for even the largest real estate portfolios"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "With SOC 2 compliance and end-to-end encryption, your property data and client information remain completely secure"
    },
    {
      icon: Cpu,
      title: "Auto-Scaling",
      desc: "Handle high volumes of photographs seamlessly without performance loss - from 10 to 10,000+ images daily with consistent speed"
    }
  ];

  const codeExample = `// Simple API Integration
try {
  const response = await fetch('https://api.interiordesignbot.com/v1/transform', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY', // Replace with real key
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_url: 'https://...', // Replace with real URL
      style: 'modern',
      prompt: 'Transform to luxury apartment'
    })
  });

  if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);

  const result = await response.json();
  
  if (result.staged_image_url) {
    console.log('Transformed image:', result.staged_image_url);
  } else {
    console.error('No staged_image_url in response:', result);
  }
  
} catch (error) {
  console.error('API request failed:', error);
}`;

  return (
    <div className="min-h-screen px-6 pb-16 pt-32 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl text-center">
        {/* HEADER */}
        <div className="mb-16">
          <p className="text-blue-600 font-medium uppercase tracking-wide">// API</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
            Scale Your Platform with Our API
          </h1>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Integrate AI-powered home staging directly into your real estate platform,
            marketplace, or agency workflow — process unlimited images at scale.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={feature.title} className="transition-transform" style={{ transitionDelay: `${index * 50}ms` }}>
              <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="mb-16 text-left">
          <Card className="p-8 bg-gray-900">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm ml-4">api_example.js</span>
            </div>

            <pre className="text-green-400 text-sm overflow-x-auto text-left">
              <code>{codeExample}</code>
            </pre>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="underline--magical">Perfect For Companies</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-3">
                <span className="underline--magical">Real Estate Platforms</span>
              </h3>
              <p className="text-gray-600 mb-3">
                Automate real estate photo enhancement for listing platforms.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed">
                Tired of inconsistent, low-quality listings that hurt your platform's credibility? Integrate AI-powered staging to instantly upgrade every property photo uploaded by your users. Boost listing quality at scale, increase user engagement, and make your marketplace more visually appealing to serious buyers.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-xl mb-3">
                <span className="underline--magical">Real Estate Agencies</span>
              </h3>
              <p className="text-gray-600 mb-3">
                Give your agents powerful staging tools integrated into their workflow.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed">
                Empower your agents to win more listings and sell faster. Instead of expensive physical staging, provide a cost-effective digital staging tool that helps them transform cluttered photos into dream homes in seconds, directly within their workflow.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-xl mb-3">
                <span className="underline--magical">Property Marketplaces</span>
              </h3>
              <p className="text-gray-600 mb-3">
                Offer premium staging as a value-added service to your sellers.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed">
                Differentiate your marketplace and create a new revenue stream. Offer premium AI staging as an upsell service to your sellers. A beautifully staged home sells faster, making your platform more effective and generating commission-sharing opportunities for you.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-xl mb-3">
                <span className="underline--magical">Photography Studios</span>
              </h3>
              <p className="text-gray-600 mb-3">
                Add AI staging to your real estate photography packages.
              </p>
              <p className="text-gray-600 text-justify leading-relaxed">
                Expand your service portfolio and increase your average order value. Add AI virtual staging to your photography packages to offer clients a complete "shoot-and-stage" solution, saving them time and money on traditional staging.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-16 text-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              Need high-volume or customized API access?
            </p>
            <a href="https://t.me/geoava" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Get Custom Pricing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


