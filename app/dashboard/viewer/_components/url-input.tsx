"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface UrlInputProps {
  onUrlSubmitted: (url: string) => void;
}

export default function UrlInput({ onUrlSubmitted }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      // Basic URL validation
      new URL(url);
      setError(null);
      onUrlSubmitted(url);
    } catch (err) {
      setError("Please enter a valid URL");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
      <Link className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium">Load DICOM from URL</h3>
      <p className="mb-4 text-center text-sm text-gray-500">
        Enter the URL of a DICOM file to view it
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            placeholder="https://example.com/sample.dcm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit">Load DICOM</Button>
        </div>
      </form>
    </div>
  );
}
