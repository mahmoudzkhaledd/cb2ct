import React, { useState, useEffect, useRef, useCallback } from "react";

// TypeScript interfaces
interface DicomVolumeViewerProps {
  volumeData?: ArrayBuffer;
  dicomUrl?: string;
  initialAxis?: "axial" | "coronal" | "sagittal";
  width?: number;
  height?: number;
}

interface VolumeData {
  width: number;
  height: number;
  depth: number;
  pixelData: Uint16Array;
  pixelSpacing: [number, number, number]; // [x, y, z] spacing
  windowCenter: number;
  windowWidth: number;
  rescaleSlope: number;
  rescaleIntercept: number;
  seriesDescription?: string;
  patientName?: string;
  studyDate?: string;
}

interface ViewportSettings {
  zoom: number;
  pan: { x: number; y: number };
  invert: boolean;
}

const DicomVolumeViewer: React.FC<DicomVolumeViewerProps> = ({
  volumeData,
  dicomUrl,
  initialAxis = "axial",
  width = 512,
  height = 512,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState<VolumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlice, setCurrentSlice] = useState<number>(0);
  const [axis, setAxis] = useState<"axial" | "coronal" | "sagittal">(
    initialAxis,
  );
  const [windowCenter, setWindowCenter] = useState<number>(40);
  const [windowWidth, setWindowWidth] = useState<number>(400);
  const [viewportSettings, setViewportSettings] = useState<ViewportSettings>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    invert: false,
  });
  const [maxSlice, setMaxSlice] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isWindowingMode, setIsWindowingMode] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [presets, setPresets] = useState<
    Array<{ name: string; center: number; width: number }>
  >([
    { name: "Brain", center: 40, width: 80 },
    { name: "Lung", center: -600, width: 1500 },
    { name: "Bone", center: 500, width: 2000 },
    { name: "Abdomen", center: 50, width: 350 },
  ]);

  // Load DICOM data either from props or URL
  useEffect(() => {
    const loadDicomData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: ArrayBuffer;

        if (volumeData) {
          data = volumeData;
        } else if (dicomUrl) {
          const response = await fetch(dicomUrl);
          data = await response.arrayBuffer();
        } else {
          throw new Error("Either volumeData or dicomUrl must be provided");
        }

        // In a real implementation, you would use a library like cornerstone or dcmjs
        // to parse the DICOM data. For this example, we'll simulate parsed data:
        const parsedData: VolumeData = {
          width: 256,
          height: 256,
          depth: 128,
          pixelData: new Uint16Array(256 * 256 * 128).map((_, i) => {
            // Create a more interesting test pattern that mimics anatomical structures
            const z = Math.floor(i / (256 * 256));
            const y = Math.floor((i % (256 * 256)) / 256);
            const x = i % 256;

            // Create spherical structures at different depths
            const d1 = Math.sqrt(
              Math.pow(x - 128, 2) + Math.pow(y - 128, 2) + Math.pow(z - 64, 2),
            );
            const d2 = Math.sqrt(
              Math.pow(x - 90, 2) + Math.pow(y - 150, 2) + Math.pow(z - 40, 2),
            );
            const d3 = Math.sqrt(
              Math.pow(x - 170, 2) + Math.pow(y - 80, 2) + Math.pow(z - 90, 2),
            );

            // Base value with some noise
            let value = 900 + Math.floor(Math.random() * 200);

            // Add spherical structures with different intensities
            if (d1 < 30) value = 1800 + Math.floor(Math.random() * 400);
            if (d2 < 20) value = 300 + Math.floor(Math.random() * 100);
            if (d3 < 25) value = 1200 + Math.floor(Math.random() * 300);

            return value;
          }),
          pixelSpacing: [1.0, 1.0, 2.5],
          windowCenter: 40,
          windowWidth: 400,
          rescaleSlope: 1.0,
          rescaleIntercept: 0,
          seriesDescription: "Brain MRI T1",
          patientName: "Anonymous",
          studyDate: "20250423",
        };

        setVolume(parsedData);
        setWindowCenter(parsedData.windowCenter);
        setWindowWidth(parsedData.windowWidth);

        // Set maximum slice and initialize to middle slice
        const maxSliceCount = getMaxSliceForAxis(parsedData, axis);
        setMaxSlice(maxSliceCount);
        setCurrentSlice(Math.floor(maxSliceCount / 2));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load DICOM data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDicomData();
  }, [volumeData, dicomUrl]);

  // Get maximum slice number for current axis
  const getMaxSliceForAxis = (
    vol: VolumeData,
    currentAxis: "axial" | "coronal" | "sagittal",
  ): number => {
    switch (currentAxis) {
      case "axial":
        return vol.depth - 1;
      case "coronal":
        return vol.height - 1;
      case "sagittal":
        return vol.width - 1;
      default:
        return 0;
    }
  };

  // Update max slice when axis changes
  useEffect(() => {
    if (volume) {
      const newMaxSlice = getMaxSliceForAxis(volume, axis);
      setMaxSlice(newMaxSlice);

      // Reset to middle slice when changing orientation
      setCurrentSlice(Math.floor(newMaxSlice / 2));
    }
  }, [axis, volume]);

  // Render to canvas whenever relevant state changes
  useEffect(() => {
    if (volume && canvasRef.current) {
      renderSlice();
    }
  }, [volume, currentSlice, axis, windowCenter, windowWidth, viewportSettings]);

  // Add keyboard event listeners for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          navigateSlice(1);
          break;
        case "ArrowDown":
        case "s":
          navigateSlice(-1);
          break;
        case "ArrowLeft":
        case "a":
          navigateSlice(-10);
          break;
        case "ArrowRight":
        case "d":
          navigateSlice(10);
          break;
        case "i":
          toggleInvert();
          break;
        case "r":
          resetView();
          break;
        case "h":
          setShowControls((prev) => !prev);
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          const presetIndex = parseInt(e.key) - 1;
          if (presetIndex >= 0 && presetIndex < presets.length) {
            applyPreset(presetIndex);
          }
          break;
        case " ": // Spacebar
          setIsWindowingMode(true);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") {
        // Spacebar released
        setIsWindowingMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentSlice, maxSlice, windowCenter, windowWidth, presets]);

  // Apply window/level preset
  const applyPreset = (index: number) => {
    const preset = presets[index];
    setWindowCenter(preset.center);
    setWindowWidth(preset.width);
  };

  // Toggle invert colors
  const toggleInvert = () => {
    setViewportSettings((prev) => ({
      ...prev,
      invert: !prev.invert,
    }));
  };

  // Reset view to default
  const resetView = () => {
    setViewportSettings({
      zoom: 1,
      pan: { x: 0, y: 0 },
      invert: false,
    });
    if (volume) {
      setWindowCenter(volume.windowCenter);
      setWindowWidth(volume.windowWidth);
    }
  };

  // Handle slice navigation with bounds checking
  const navigateSlice = (delta: number) => {
    setCurrentSlice((prev) => {
      const newSlice = prev + delta;
      return Math.max(0, Math.min(maxSlice, newSlice));
    });
  };

  // Render the current slice to the canvas
  const renderSlice = () => {
    if (!volume || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      width: volWidth,
      height: volHeight,
      depth: volDepth,
      pixelData,
    } = volume;

    // Determine dimensions based on axis
    let sliceWidth: number, sliceHeight: number;

    switch (axis) {
      case "axial":
        sliceWidth = volWidth;
        sliceHeight = volHeight;
        break;
      case "coronal":
        sliceWidth = volWidth;
        sliceHeight = volDepth;
        break;
      case "sagittal":
        sliceWidth = volHeight;
        sliceHeight = volDepth;
        break;
    }

    // Set canvas dimensions to match source data
    canvas.width = sliceWidth;
    canvas.height = sliceHeight;

    // Create image data for the slice
    const imageData = ctx.createImageData(sliceWidth, sliceHeight);

    // Fill the image data based on the axis
    for (let y = 0; y < sliceHeight; y++) {
      for (let x = 0; x < sliceWidth; x++) {
        let pixelIndex: number;

        // Calculate index based on orientation
        switch (axis) {
          case "axial":
            pixelIndex = currentSlice * volWidth * volHeight + y * volWidth + x;
            break;
          case "coronal":
            pixelIndex = y * volWidth * volHeight + currentSlice * volWidth + x;
            break;
          case "sagittal":
            pixelIndex = y * volWidth * volHeight + x * volWidth + currentSlice;
            break;
        }

        // Apply rescale slope and intercept (Hounsfield Units for CT)
        let pixelValue = pixelData[pixelIndex];
        if (volume.rescaleSlope && volume.rescaleIntercept) {
          pixelValue =
            pixelValue * volume.rescaleSlope + volume.rescaleIntercept;
        }

        // Apply windowing (contrast and brightness)
        let windowedValue = windowPixelValue(
          pixelValue,
          windowCenter,
          windowWidth,
        );

        // Apply invert if needed
        if (viewportSettings.invert) {
          windowedValue = 255 - windowedValue;
        }

        // Set RGBA values in image data
        const dataIndex = (y * sliceWidth + x) * 4;
        imageData.data[dataIndex] = windowedValue; // R
        imageData.data[dataIndex + 1] = windowedValue; // G
        imageData.data[dataIndex + 2] = windowedValue; // B
        imageData.data[dataIndex + 3] = 255; // A (fully opaque)
      }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image data to canvas
    ctx.putImageData(imageData, 0, 0);

    // Apply zoom and pan transformations for the display
    canvas.style.width = `${sliceWidth * viewportSettings.zoom}px`;
    canvas.style.height = `${sliceHeight * viewportSettings.zoom}px`;
    canvas.style.transform = `translate(${viewportSettings.pan.x}px, ${viewportSettings.pan.y}px)`;

    // Draw slice information overlay
    drawOverlay(ctx, sliceWidth, sliceHeight);
  };

  // Draw information overlay
  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    if (!volume) return;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(5, height - 85, 250, 80);

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";

    // Display patient and study information
    ctx.fillText(
      `Patient: ${volume.patientName || "Unknown"}`,
      10,
      height - 65,
    );
    ctx.fillText(
      `Study: ${volume.seriesDescription || "Unknown"}`,
      10,
      height - 50,
    );
    ctx.fillText(`Date: ${volume.studyDate || "Unknown"}`, 10, height - 35);

    // Display slice and windowing information
    ctx.fillText(
      `${axis.charAt(0).toUpperCase() + axis.slice(1)} - Slice: ${currentSlice + 1}/${maxSlice + 1}`,
      10,
      height - 20,
    );
    ctx.fillText(`WL: ${windowCenter} / WW: ${windowWidth}`, 10, height - 5);

    // Display navigation help in top right
    ctx.textAlign = "right";
    ctx.fillText(
      "← → : Navigate slices | Space+Drag: Window/Level",
      width - 10,
      15,
    );
    ctx.fillText("Scroll: Zoom | Middle-click+Drag: Pan", width - 10, 30);

    ctx.restore();
  };

  // Apply windowing function (contrast/brightness)
  const windowPixelValue = (
    value: number,
    center: number,
    width: number,
  ): number => {
    const lower = center - width / 2;
    const upper = center + width / 2;

    if (value <= lower) return 0;
    if (value >= upper) return 255;
    return Math.round(((value - lower) / width) * 255);
  };

  // Handle mouse wheel for zooming
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = viewportSettings.zoom * zoomFactor;

      // Limit zoom range
      if (newZoom < 0.2 || newZoom > 10) return;

      setViewportSettings((prev) => ({
        ...prev,
        zoom: newZoom,
      }));
    },
    [viewportSettings.zoom],
  );

  // Mouse handlers for pan and window/level adjustments
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsMouseDown(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      if (isWindowingMode || (e.buttons === 1 && e.shiftKey)) {
        // Window/level adjustment
        setWindowWidth((prev) => Math.max(1, prev + deltaX));
        setWindowCenter((prev) => prev + deltaY);
      } else if (e.buttons === 2 || e.buttons === 4) {
        // Right button or middle button for panning
        setViewportSettings((prev) => ({
          ...prev,
          pan: {
            x: prev.pan.x + deltaX,
            y: prev.pan.y + deltaY,
          },
        }));
      }

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isMouseDown, lastMousePos, isWindowingMode],
  );

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  // Handle context menu to prevent right-click menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Handle slice change input
  const handleSliceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSlice(parseInt(e.target.value, 10));
  };

  // Handle axis change
  const handleAxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAxis(e.target.value as "axial" | "coronal" | "sagittal");
  };

  // Handle window/level adjustments
  const handleWindowCenterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowCenter(parseInt(e.target.value, 10));
  };

  const handleWindowWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowWidth(parseInt(e.target.value, 10));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-100">
        <div className="text-lg">Loading DICOM data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!volume) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-100">
        <div className="text-lg">No volume data available</div>
      </div>
    );
  }

  return (
    <div className="dicom-volume-viewer flex flex-col overflow-hidden rounded-lg bg-gray-900">
      {/* Top toolbar */}
      <div className="flex items-center justify-between bg-gray-800 p-2 text-white">
        <div className="font-bold">RadiAnt-Style DICOM Viewer</div>
        <div>
          <button
            className="mr-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            onClick={() => setShowControls((prev) => !prev)}
          >
            {showControls ? "Hide Controls" : "Show Controls"}
          </button>
          <button
            className="rounded bg-gray-600 px-3 py-1 text-white hover:bg-gray-700"
            onClick={resetView}
          >
            Reset View
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left sidebar with controls */}
        {showControls && (
          <div className="viewer-controls flex w-64 flex-col space-y-4 bg-gray-800 p-4 text-white">
            <div>
              <label className="mb-1 block">View Orientation</label>
              <select
                value={axis}
                onChange={handleAxisChange}
                className="w-full rounded bg-gray-700 p-2 text-white"
              >
                <option value="axial">Axial</option>
                <option value="coronal">Coronal</option>
                <option value="sagittal">Sagittal</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block">
                Slice: {currentSlice + 1}/{maxSlice + 1}
              </label>
              <input
                type="range"
                min={0}
                max={maxSlice}
                value={currentSlice}
                onChange={handleSliceChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>1</span>
                <span>{maxSlice + 1}</span>
              </div>
            </div>

            <div>
              <label className="mb-1 block">
                Window Center: {windowCenter}
              </label>
              <input
                type="range"
                min={-1000}
                max={3000}
                value={windowCenter}
                onChange={handleWindowCenterChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block">Window Width: {windowWidth}</label>
              <input
                type="range"
                min={1}
                max={4000}
                value={windowWidth}
                onChange={handleWindowWidthChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block">Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(index)}
                    className="rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block">Display</label>
              <div className="flex space-x-2">
                <button
                  onClick={toggleInvert}
                  className={`rounded px-2 py-1 text-sm ${viewportSettings.invert ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  Invert
                </button>
                <button
                  onClick={resetView}
                  className="rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="mb-2 font-bold">Keyboard Shortcuts</h3>
              <ul className="text-sm">
                <li>← → / A D: Navigate by 10 slices</li>
                <li>↑ ↓ / W S: Navigate by 1 slice</li>
                <li>Space+Drag: Adjust window/level</li>
                <li>I: Invert colors</li>
                <li>R: Reset view</li>
                <li>1-4: Apply presets</li>
                <li>H: Toggle controls</li>
              </ul>
            </div>
          </div>
        )}

        {/* Main viewing area */}
        <div
          ref={containerRef}
          className="canvas-container relative flex-1 overflow-hidden bg-black"
          style={{ width: width, height: height }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
        >
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
            <canvas
              ref={canvasRef}
              className="transition-transform duration-100"
            />
          </div>

          {/* Slice navigation buttons */}
          <div className="absolute top-1/2 right-4 flex -translate-y-1/2 transform flex-col space-y-2">
            <button
              onClick={() => navigateSlice(10)}
              className="bg-opacity-70 hover:bg-opacity-100 flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-white"
            >
              ⏫
            </button>
            <button
              onClick={() => navigateSlice(1)}
              className="bg-opacity-70 hover:bg-opacity-100 flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-white"
            >
              ⬆️
            </button>
            <div className="bg-opacity-70 rounded bg-gray-800 px-2 py-1 text-center text-white">
              {currentSlice + 1}
            </div>
            <button
              onClick={() => navigateSlice(-1)}
              className="bg-opacity-70 hover:bg-opacity-100 flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-white"
            >
              ⬇️
            </button>
            <button
              onClick={() => navigateSlice(-10)}
              className="bg-opacity-70 hover:bg-opacity-100 flex h-10 w-10 items-center justify-center rounded bg-gray-800 text-white"
            >
              ⏬
            </button>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex justify-between bg-gray-800 p-2 text-sm text-white">
        <div>
          {volume.seriesDescription || "Unknown Series"} | Zoom:{" "}
          {viewportSettings.zoom.toFixed(1)}x
        </div>
        <div>
          {`WL: ${windowCenter} / WW: ${windowWidth}`} |{" "}
          {axis.charAt(0).toUpperCase() + axis.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default DicomVolumeViewer;
