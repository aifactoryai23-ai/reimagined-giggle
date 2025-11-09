import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BeforeAfterSlider({ beforeImage, afterImage }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation("common");

  const updatePosition = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(rect.left, Math.min(clientX, rect.right));
    const percentage = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event) => {
      updatePosition(event.clientX);
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        updatePosition(event.touches[0].clientX);
      }
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="relative">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg">␊
        <MoveHorizontal className="w-4 h-4" />␊
        <span>{t("beforeAfter.drag")}</span>
      </div>␊

      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
        onMouseDown={(event) => {
          setIsDragging(true);
          updatePosition(event.clientX);
        }}
        onTouchStart={(event) => {
          setIsDragging(true);
          if (event.touches.length > 0) {
            updatePosition(event.touches[0].clientX);
          }
        }}
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-0">
          <img src={afterImage} alt="After staging" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">␊
            {t("beforeAfter.after")}
          </div>␊
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%`, willChange: "width" }}
        >
          <img
            src={beforeImage}
            alt="Before staging"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute top-6 left-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">␊
            {t("beforeAfter.before")}
          </div>␊
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-2xl"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)", willChange: "left" }}
        >
          <div className="absolute -top-0 left-1/2 -translate-x-1/2">
            <div className="w-6 h-6 bg-white rounded-b-full shadow-lg" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing border-4 border-gray-100 transition-transform duration-200 hover:scale-105">
              <div className="flex items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 4L2 10L7 16M13 4L18 10L13 16"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl -z-10 opacity-60 animate-ping" style={{ animationDuration: "2s" }} />
          </div>

          <div className="absolute -bottom-0 left-1/2 -translate-x-1/2">
            <div className="w-6 h-6 bg-white rounded-t-full shadow-lg" />
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          {Math.round(sliderPosition)}% / {Math.round(100 - sliderPosition)}%
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4 md:hidden">{t("beforeAfter.swipe")}</p>
    </div>
  );
}
