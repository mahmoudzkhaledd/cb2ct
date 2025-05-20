"use client";
import DwvComponent from "@/components/general/DwvComponent";
import { useFiles } from "@/components/providers/DwvFilesProvider";
import React from "react";

export default function FileChooserComponent() {
  const { addFiles, removeAllFiles } = useFiles();
  return <DwvComponent onAddFiles={addFiles} removeAllFiles={removeAllFiles} />;
}
