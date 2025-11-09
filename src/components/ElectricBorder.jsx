import React from "react";
import "./ElectricBorder.css";

export default function ElectricBorder({ children }) {
  return (
    <div className="electric-center">
      <svg className="electric-svg">
        <defs>
          <filter
            id="turbulent-displace"
            colorInterpolationFilters="sRGB"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            {/* Крупные волны */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.015"
              numOctaves="2"
              seed="4"
              result="bigNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.012;0.02;0.012"
                dur="6s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Мелкие зубцы */}
            <feTurbulence
              type="turbulence"
              baseFrequency="0.08"
              numOctaves="3"
              seed="9"
              result="fineNoise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.07;0.09;0.07"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Объединяем */}
            <feBlend in="bigNoise" in2="fineNoise" mode="lighten" result="combined" />

            {/* Деформируем контур */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="combined"
              scale="45"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="electric-card">
        <div className="electric-border-layer"></div>
        <div className="electric-border-layer blur"></div>
        <div className="electric-border-layer glow"></div>
        <div className="electric-content">{children}</div>
      </div>
    </div>
  );
}
