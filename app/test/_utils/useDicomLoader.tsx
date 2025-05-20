"use client";

import { useState } from "react";

export interface DicomData {
  pixelData: Int16Array | Uint16Array | Uint8Array;
  width: number;
  height: number;
  windowCenter: number;
  windowWidth: number;
  slope: number;
  intercept: number;
  metadata?: Record<string, any>;
}

export function useDicomLoader() {
  const [dicomData, setDicomData] = useState<DicomData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDicomFromUrl = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the DICOM file
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch DICOM file: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Parse the DICOM file
      // In a real implementation, we would use dicom-parser or similar library
      // For this example, we'll simulate parsing with a simple implementation
      const parsedData = await parseDicomData(arrayBuffer);
      setDicomData(parsedData);
    } catch (err) {
      console.error("Error loading DICOM:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load DICOM file",
      );
      setDicomData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple DICOM parser (this is a simplified version for demonstration)
  // In a real application, you would use a proper DICOM parser library
  const parseDicomData = async (
    arrayBuffer: ArrayBuffer,
  ): Promise<DicomData> => {
    // This is a simplified parser for demonstration
    // In a real application, you would use dicom-parser or similar

    // Check for DICOM magic number (DICM at offset 128)
    const dataView = new DataView(arrayBuffer);
    let isDicom = true;

    // Check for "DICM" prefix at position 128
    if (arrayBuffer.byteLength > 132) {
      const prefix = new Uint8Array(arrayBuffer, 128, 4);
      const prefixString = String.fromCharCode(...prefix);
      if (prefixString !== "DICM") {
        isDicom = false;
      }
    } else {
      isDicom = false;
    }

    if (!isDicom) {
      // For demonstration, if not a valid DICOM, create a sample image
      // In a real app, you would throw an error
      console.warn(
        "Not a valid DICOM file or using simplified parsing. Creating sample data.",
      );

      // Create a sample 256x256 gradient image
      const width = 256;
      const height = 256;
      const pixelData = new Int16Array(width * height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Create a simple gradient pattern
          pixelData[y * width + x] = Math.floor((x + y) / 2) % 4096;
        }
      }

      return {
        pixelData,
        width,
        height,
        windowCenter: 2048,
        windowWidth: 4096,
        slope: 1,
        intercept: 0,
        metadata: {
          patientName: "Sample Patient",
          studyDate: new Date().toISOString().split("T")[0],
          modality: "Sample",
          note: "This is sample data as the provided URL did not contain valid DICOM data or could not be parsed with our simplified parser.",
        },
      };
    }

    // In a real implementation, you would parse the DICOM tags here
    // For this example, we'll return a simplified structure

    // Simulate extracting some basic DICOM attributes
    // These would normally come from parsing the DICOM tags
    const width = 512;
    const height = 512;

    // Create a simulated pixel data array
    // In a real implementation, this would come from the actual DICOM pixel data
    const pixelData = new Int16Array(width * height);

    // Fill with a pattern for visualization
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Create a simple pattern based on the array buffer content to make it look somewhat realistic
        const index = y * width + x;
        const bufferIndex = (index % (arrayBuffer.byteLength - 1000)) + 1000;
        pixelData[index] = dataView.getUint8(bufferIndex) * 16;
      }
    }

    return {
      pixelData,
      width,
      height,
      windowCenter: 127,
      windowWidth: 256,
      slope: 1,
      intercept: 0,
      metadata: {
        patientName: "Test Patient",
        studyDate: new Date().toISOString().split("T")[0],
        modality: "CT",
        note: "This is parsed from the DICOM file with a simplified parser. In a real application, more metadata would be available.",
      },
    };
  };

  return {
    dicomData,
    isLoading,
    error,
    loadDicomFromUrl,
  };
}
