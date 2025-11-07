import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Poline, positionFunctions } from "poline";
import "./ProcessingView.css"; 
import ElectricBorder from "@/components/ElectricBorder";

export default function ProcessingView() {
  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const polineRef = useRef(null);
  const animationRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const steps = ["Analyzing image...", "Applying style...", "Enhancing details..."];

  useEffect(() => {
    const initPoline = () => {
      const $scene = sceneRef.current;
      const $world = worldRef.current;
      if (!$scene || !$world) return;

      let poline = new Poline({ numPoints: 10 });
      polineRef.current = poline;

      let hueSection = 10;
      let lightnessLevels = 3;
      let isSmoothGradient = true;
      let invertLight = false;
      let speed = 0.75;
      let direction = 1;
      let rndPerSection = [];

      const createLabels = (steps) => {
        const $labels = document.createElement("div");
        $labels.classList.add("labels");
        for (let i = 0; i < steps; i++) {
          const $label = document.createElement("div");
          $label.classList.add("labels__label");
          $label.style.setProperty("--i", i / steps);
          $labels.appendChild($label);
        }
        return $labels;
      };

      const newSettings = () => {
        direction = Math.random() < 0.5 ? 1 : -1;
        hueSection = 3 + Math.round(Math.random() * 45);
        if (Math.random() < 0.15) hueSection = 100 + Math.round(Math.random() * 240);
        lightnessLevels = 3 + Math.floor(Math.random() * 10);
        isSmoothGradient = Math.random() < 0.5;
        invertLight = Math.random() < 0.5;

        poline = new Poline({
          numPoints: 10,
          positionFunctionX:
            Math.random() < 0.5
              ? positionFunctions.smoothStepPosition
              : positionFunctions.sinusoidalPosition,
        });

        polineRef.current = poline;

        const additionalAnchors = Math.random() < 0.3 ? Math.round(Math.random() * 2) : 2;
        for (let i = 0; i < additionalAnchors; i++) {
          poline.addAnchorPoint({
            xyz: [Math.random(), Math.random(), Math.random()],
          });
        }

        // Сброс всех классов
        $scene.className = "scene";
        if (Math.random() < 0.5) $scene.classList.add("dark");
        if (Math.random() < 0.1) $scene.classList.add("trans");
        if (Math.random() < 0.5) $scene.classList.add("show-rings");
        if (invertLight && Math.random() < 0.2) $scene.classList.add("blur");
        if (Math.random() < 0.25 && isSmoothGradient && !$scene.classList.contains("dark"))
          $scene.classList.add("notches");
        if (Math.random() < 0.1) $scene.classList.add("invert-scale");

        speed = Math.random();
        $scene.style.setProperty("--s", Math.random() < 0.75 ? 1 : 0.5 + Math.random() * 0.5);
        rndPerSection = new Array(lightnessLevels).fill("").map(() => Math.random());
      };

      const gradientStepsForSegment = (colorSegments) => {
        const l = colorSegments.length;
        const gradStops = colorSegments.map((colors, i) => {
          const nextStep = (i + 1) / l;
          const currentStep = i / l;
          const segmentRange = nextStep - currentStep;

          if (!colors) {
            return isSmoothGradient
              ? `var(--bgc)`
              : `var(--bgc) ${currentStep * 100}% ${nextStep * 100}%`;
          } else {
            const cl = colors.length;
            return colors
              .map((c, j) => {
                const nextSubStep = (j + 1) / cl;
                const currentSubStep = j / cl;
                return isSmoothGradient
                  ? `${c.css}`
                  : `${c.css} ${
                      (currentStep + currentSubStep * segmentRange) * 100
                    }% ${(currentStep + segmentRange - currentSubStep * segmentRange) * 100}%`;
              })
              .join();
          }
        });

        if (isSmoothGradient) gradStops.push(gradStops[0]);
        return gradStops.join();
      };

      const doIt = () => {
        if (!$world || !polineRef.current) return;
        $world.innerHTML = "";

        const hueSlice = 360 / hueSection;
        const lightnessSlice = 1 / lightnessLevels;

        const hueSections = new Array(hueSection)
          .fill("")
          .map((_, i) => (i + 1) * hueSlice);
        const lightnessSections = new Array(lightnessLevels)
          .fill("")
          .map((_, i) =>
            invertLight ? 1 - (i + 1) / lightnessLevels : (i + 1) / lightnessLevels
          );

        const colors = polineRef.current.colors.map((color, i) => ({
          values: color,
          css: polineRef.current.colorsCSS[i],
        }));

        lightnessSections.forEach((lightnessSection, i) => {
          const currentSegmentLightness = colors.filter(
            (c) =>
              c.values[2] <= lightnessSection &&
              lightnessSection - lightnessSlice <= c.values[2]
          );

          const segementedHuesForLightness = hueSections
            .map((hueSection) =>
              currentSegmentLightness.filter(
                (c) =>
                  c.values[0] <= hueSection && hueSection - hueSlice <= c.values[0]
              )
            )
            .map((a) => (a.length > 0 ? a : null));

          const gradientSteps = gradientStepsForSegment(segementedHuesForLightness);
          const $ring = document.createElement("div");
          $ring.classList.add("ring");
          $ring.style.setProperty("--i", i);
          $ring.style.setProperty("--iR", (i + 1) / lightnessLevels);
          $ring.style.setProperty("--g", gradientSteps);
          $ring.style.setProperty("--rnd", rndPerSection[i]);
          $world.appendChild($ring);
        });

        $world.appendChild(createLabels(hueSection));
      };

      const handleClick = () => {
        newSettings();
        doIt();
      };

      $scene.addEventListener("click", handleClick);
      $scene.style.pointerEvents = "auto";

      newSettings();
      doIt();
      setIsInitialized(true);

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const animate = () => {
          if (polineRef.current) {
            polineRef.current.shiftHue(speed * direction);
            doIt();
          }
          animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        $scene.removeEventListener("click", handleClick);
      };
    };

    initPoline();
  }, []);

  return (
    <div className="space-y-8">
    <ElectricBorder>
      <Card className="p-8 text-center">
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
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>{step}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-8">
          This usually takes 10–20 seconds
        </p>
      </Card>
    </ElectricBorder>

      <Card className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Color Harmony Visualization
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Generative art while processing your image
          </p>
          <p className="text-base text-gray-500">
            Click anywhere to regenerate colors
          </p>
        </div>

        <div ref={sceneRef} className="scene">
          <div ref={worldRef} className="inner" data-world />
        </div>
      </Card>
    </div>
  );
}


