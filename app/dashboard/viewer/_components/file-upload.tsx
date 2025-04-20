"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ onFileSelected }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".dcm"
        className="hidden"
      />
      <Upload className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium">Upload DICOM File</h3>
      <p className="mb-4 text-center text-sm text-gray-500">
        Click to browse or drag and drop your DICOM file here
      </p>
      <Button onClick={handleButtonClick} className="mb-2">
        Select DICOM File
      </Button>
      {fileName && (
        <p className="mt-2 text-sm text-green-600">Selected: {fileName}</p>
      )}
    </div>
  );
}
