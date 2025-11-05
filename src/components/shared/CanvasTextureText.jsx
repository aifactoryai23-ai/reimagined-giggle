import React, { useEffect, useRef } from "react";

export default function CanvasTextureText({ text = "Transform Properties," }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const layers = 7;
    const colors = [
      "#c2c2d6", "#a3a3c2", "#7575a3",
      "#47476b", "#ffdd99", "#ffcc66", "#e0e0eb",
    ];

    const wrapper = wrapperRef.current;
    const width = wrapper.offsetWidth || 800;
    const height = 160;
    const cvs = [];

    // создаём слои
    for (let i = 0; i < layers; i++) {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      c.style.position = "absolute";
      c.style.top = "0";
      c.style.left = "0";
      c.style.pointerEvents = "none";
      wrapper.appendChild(c);
      cvs.push(c);
    }

    // рисуем песочные точки
    cvs.forEach((canvas, i) => {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = colors[i];
      const totalDots = 28000;
      for (let n = 0; n < totalDots; n++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const sz = Math.random() * 2.5 + 0.2;
        ctx.fillRect(x, y, sz, sz);
      }
    });

    // рисуем текст сверху
    const topCtx = cvs[cvs.length - 1].getContext("2d");
    const fontSize = height * 0.8;
    topCtx.font = `${fontSize}px 'Alfa Slab One'`;
    topCtx.textBaseline = "top";
    topCtx.lineJoin = "round";
    topCtx.lineWidth = 8;
    topCtx.strokeStyle = "#47476b";
    topCtx.textAlign = "left";
    topCtx.strokeText(text, 0, 0);
    topCtx.globalCompositeOperation = "xor";
    topCtx.fillStyle = "#e0e0eb";
    topCtx.fillText(text, 0, 0);

    // движение мыши
    const handleMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      const maxShift = 100;

      cvs.forEach((c, i) => {
        const depth = (i - layers / 2) * 8;
        c.style.transform = `translate(${xPct * depth}px, ${yPct * depth}px)`;
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cvs.forEach((c) => c.remove());
    };
  }, [text]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
        height: "160px",
        background: "transparent",
        overflow: "hidden",
      }}
    />
  );
}
