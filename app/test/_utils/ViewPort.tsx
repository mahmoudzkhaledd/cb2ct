"use client";

import { useEffect, useRef } from "react";
import { DicomData } from "./useDicomLoader";

interface DicomViewportProps {
  dicomData: DicomData;
  windowWidth: number;
  windowCenter: number;
  zoom: number;
}

export function DicomViewport({
  dicomData,
  windowWidth,
  windowCenter,
  zoom,
}: DicomViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !dicomData || !dicomData.pixelData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match image dimensions
    canvas.width = dicomData.width;
    canvas.height = dicomData.height;

    // Create an ImageData object
    const imageData = ctx.createImageData(dicomData.width, dicomData.height);

    // Apply windowing function to convert pixel values to display values
    for (let i = 0; i < dicomData.pixelData.length; i++) {
      const pixelValue = dicomData.pixelData[i];

      // Apply windowing (window/level adjustment)
      const hounsfield = pixelValue * dicomData.slope + dicomData.intercept;

      // Window/level calculation
      let windowedValue;
      if (hounsfield <= windowCenter - 0.5 - (windowWidth - 1) / 2) {
        windowedValue = 0;
      } else if (hounsfield > windowCenter - 0.5 + (windowWidth - 1) / 2) {
        windowedValue = 255;
      } else {
        windowedValue =
          ((hounsfield - (windowCenter - 0.5)) / (windowWidth - 1) + 0.5) * 255;
      }

      // Clamp to 0-255 range
      windowedValue = Math.max(0, Math.min(255, Math.round(windowedValue)));

      // Set RGB values (grayscale)
      imageData.data[i * 4] = windowedValue; // R
      imageData.data[i * 4 + 1] = windowedValue; // G
      imageData.data[i * 4 + 2] = windowedValue; // B
      imageData.data[i * 4 + 3] = 255; // A (fully opaque)
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image data to the canvas
    ctx.putImageData(imageData, 0, 0);

    // Apply zoom and center
    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = canvas.width;
    displayCanvas.height = canvas.height;
    const displayCtx = displayCanvas.getContext("2d");

    if (displayCtx) {
      displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply zoom transformation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      ctx.drawImage(displayCanvas, 0, 0);
      ctx.restore();
    }
  }, [dicomData, windowWidth, windowCenter, zoom]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
