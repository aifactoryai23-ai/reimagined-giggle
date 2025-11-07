import React, { useEffect, useRef } from 'react';
import './ParallaxTextEffect.css';

const ParallaxTextEffect = () => {
  const canvasRefs = useRef([]);
  const containerRef = useRef(null);
  const testRef = useRef(null);

  const rnd = (nNum) => Math.floor(Math.random() * nNum);

  const drawTexture1 = (canvas, sColor, dotCount) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = sColor;
    
    for (let n = 0; n < dotCount; n++) {
      const x1 = rnd(width);
      const y1 = rnd(height);
      let sz = (rnd(4) + 1) / 3;
      
      ctx.beginPath();
      ctx.arc(x1, y1, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawTextureText = (canvas) => {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const nFontSize = 60;
    
    ctx.font = `bold ${nFontSize}px "Alfa Slab One"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.fillStyle = '#000000';
    ctx.fillText("Transform Properties,", width / 2, height / 2);
    
    ctx.globalCompositeOperation = 'source-in';
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#c2c2d6');
    gradient.addColorStop(0.5, '#a3a3c2');
    gradient.addColorStop(1, '#47476b');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#ffcc66';
    for (let n = 0; n < 150; n++) {
      const x1 = rnd(width);
      const y1 = rnd(height);
      const sz = (rnd(3) + 1) / 3;
      ctx.beginPath();
      ctx.arc(x1, y1, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.fillStyle = '#ffffff';
    for (let n = 0; n < 200; n++) {
      const x1 = rnd(width);
      const y1 = rnd(height);
      const sz = (rnd(3) + 1) / 3;
      ctx.beginPath();
      ctx.arc(x1, y1, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = '#47476b';
    ctx.lineWidth = 2;
    ctx.strokeText("Transform Properties,", width / 2, height / 2);
  };

  const initializeCanvases = () => {
    if (!testRef.current || !containerRef.current) return;
    
    const testElement = testRef.current;
    const container = containerRef.current;
    
    testElement.textContent = 'Transform Properties,';
    testElement.style.fontFamily = '"Alfa Slab One"';
    testElement.style.fontWeight = 'bold';
    testElement.style.fontSize = '60px';
    
    const textWidth = testElement.offsetWidth;
    const textHeight = testElement.offsetHeight;
    
    const containerWidth = textWidth + 100;
    const containerHeight = textHeight + 40;
    
    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;
    
    const layerColors = [
      "#c2c2d6",
      "#a3a3c2", 
      "#7575a3",
      "#47476b",
      "#ffdd99",
      "#ffcc66",
    ];
    
    const dotCounts = [600, 540, 450, 360, 300, 240];
    
    for (let i = 0; i < 6; i++) {
      const canvas = canvasRefs.current[i];
      if (!canvas) continue;
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      drawTexture1(canvas, layerColors[i], dotCounts[i]);
    }
    
    const textCanvas = canvasRefs.current[6];
    if (textCanvas) {
      textCanvas.width = containerWidth;
      textCanvas.height = containerHeight;
      drawTextureText(textCanvas);
    }
  };

  const captureMouse = (evt) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const mX = evt.clientX;
    const mY = evt.clientY;
    
    const nRectWidth = rect.width;
    const nRectHeight = rect.height;
    
    const xPct = (mX - rect.left) / nRectWidth;
    const yPct = (mY - rect.top) / nRectHeight;
    
    const nMaxImgShift = 30;
    
    const nXOffset6 = nMaxImgShift * xPct;
    const nXOffset1 = nXOffset6 * -1;
    
    const nYOffset6 = nMaxImgShift * yPct;
    const nYOffset1 = nYOffset6 * -1;
    
    for (let i = 0; i < 6; i++) {
      const canvas = canvasRefs.current[i];
      if (!canvas) continue;
      
      let xOffset, yOffset;
      
      switch (i) {
        case 0:
          xOffset = nXOffset1;
          yOffset = nYOffset1;
          break;
        case 1:
          xOffset = nXOffset1 + (nXOffset6 - nXOffset1) * 0.2;
          yOffset = nYOffset1 + (nYOffset6 - nYOffset1) * 0.2;
          break;
        case 2:
          xOffset = nXOffset1 + (nXOffset6 - nXOffset1) * 0.4;
          yOffset = nYOffset1 + (nYOffset6 - nYOffset1) * 0.4;
          break;
        case 3:
          xOffset = nXOffset1 + (nXOffset6 - nXOffset1) * 0.6;
          yOffset = nYOffset1 + (nYOffset6 - nYOffset1) * 0.6;
          break;
        case 4:
          xOffset = nXOffset1 + (nXOffset6 - nXOffset1) * 0.8;
          yOffset = nYOffset1 + (nYOffset6 - nYOffset1) * 0.8;
          break;
        case 5:
          xOffset = nXOffset6;
          yOffset = nYOffset6;
          break;
        default:
          xOffset = 0;
          yOffset = 0;
      }
      
      canvas.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
  };

  useEffect(() => {
    const init = setTimeout(initializeCanvases, 100);
    
    const textCanvas = canvasRefs.current[6];
    if (textCanvas) {
      textCanvas.addEventListener('mousemove', captureMouse);
    }
    
    const handleResize = () => {
      clearTimeout(init);
      setTimeout(initializeCanvases, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (textCanvas) {
        textCanvas.removeEventListener('mousemove', captureMouse);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(init);
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !canvasRefs.current.includes(el)) {
      canvasRefs.current.push(el);
    }
  };

  return (
    <div className="parallax-text-container">
      <div
        ref={testRef}
        className="test-element"
      />
      
      <div ref={containerRef} className="parallax-container">
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv" />
        <canvas ref={addToRefs} className="cv2" />
      </div>
    </div>
  );
};

export default ParallaxTextEffect;
