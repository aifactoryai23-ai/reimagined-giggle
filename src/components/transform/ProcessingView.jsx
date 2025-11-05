import React from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function ProcessingView() {
  const steps = ["Analyzing image...", "Applying style...", "Enhancing details..."];

  return (
    <div>
      <Card className="p-12 text-center">
        <div
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-spin"
          style={{ animationDuration: "2.5s" }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold mb-3">Creating Magic...</h2>
        <p className="text-xl text-gray-600 mb-8">
          Our AI is transforming your property photo
        </p>

        <div className="max-w-md mx-auto space-y-3">
          {steps.map((step) => (
            <div key={step} className="flex items-center gap-3 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-8">
          This usually takes 10-20 seconds
        </p>
      </Card>
    </div>
  );

}
