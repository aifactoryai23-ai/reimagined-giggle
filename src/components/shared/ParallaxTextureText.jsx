import React, { useRef, useEffect } from "react";

export default function ParallaxTextureText({ text = "Transform Properties," }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const layers = container.querySelectorAll(".texture-layer");

    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer, i) => {
        const depth = (i + 1) * 10;
        layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };

    container.addEventListener("mousemove", handleMove);
    return () => container.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block leading-tight text-5xl md:text-7xl font-bold text-center"
      style={{
        position: "relative",
        color: "#3d3b63",
        WebkitTextStroke: "2px #3d3b63",
      }}
    >
      <span
        className="absolute inset-0 texture-layer"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, #ffdd99 0%, #ffcc66 10%, transparent 30%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          mixBlendMode: "multiply",
          transition: "transform 0.1s ease-out",
        }}
      >
        {text}
      </span>

      <span
        className="absolute inset-0 texture-layer"
        style={{
          background:
            "radial-gradient(circle at 70% 60%, #b497ff 0%, #9f85ff 15%, transparent 30%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          mixBlendMode: "screen",
          transition: "transform 0.1s ease-out",
        }}
      >
        {text}
      </span>

      <span
        className="absolute inset-0 texture-layer"
        style={{
          background:
            "radial-gradient(circle at 50% 80%, #fff5cc 0%, #ffeb99 12%, transparent 25%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          mixBlendMode: "overlay",
          transition: "transform 0.1s ease-out",
        }}
      >
        {text}
      </span>

      <span className="relative text-transparent">{text}</span>
    </div>
  );
}
