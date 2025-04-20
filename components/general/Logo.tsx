"use client";
import { Brain } from "lucide-react";
import React from "react";

export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <Brain className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold">MediScan AI</span>
    </a>
  );
}
