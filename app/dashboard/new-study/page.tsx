"use client";
import React from "react";
import DwvComponent from "../../../components/general/DwvComponent";
import FilesComponent from "./_components/FilesComponent";
import FilesProvider from "../../../components/providers/DwvFilesProvider";
import FileChooserComponent from "./_components/FileChooserComponent";

export default function NewStudyPage() {
  return (
    <FilesProvider>
      <div className="flex w-full gap-4">
        <FileChooserComponent />
        <FilesComponent />
      </div>
    </FilesProvider>
  );
}
