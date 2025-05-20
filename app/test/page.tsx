"use client";

import { DicomViewer } from "./_utils/DicomViewerComp";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <h1 className="mb-6 text-2xl font-bold">DICOM Viewer</h1>
        <DicomViewer />
      </div>
    </div>
  );
}
