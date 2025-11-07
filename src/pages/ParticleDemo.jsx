// src/pages/ParticleDemo.jsx
import React from "react";
import ProcessingView from "@/components/transform/ProcessingView";
import { Helmet } from "react-helmet-async";

export default function ParticleDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-10">
      <Helmet>
        <title>Particle Demo | InteriorDesignBot</title>
      </Helmet>

      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Particle Text Effect Demo
      </h1>
      <p className="text-gray-600 mb-8 max-w-xl text-center">
        Здесь можно протестировать анимацию частиц, используемую во время AI-генерации.
        Двигай мышкой по блоку — частицы реагируют на курсор.
      </p>

      <div className="w-full max-w-4xl">
        <ProcessingView />
      </div>

      <p className="text-sm text-gray-400 mt-6">
        Press <b>GUI</b> (справа сверху), чтобы открыть настройки.
      </p>
    </div>
  );
}
