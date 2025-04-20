"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import dicomjs from "dicom.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileUpload from "./_components/file-upload";
import UrlInput from "./_components/url-input";

export default function Home() {
  const [dicomFile, setDicomFile] = useState<File | null>(null);
  const [dicomUrl, setDicomUrl] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<"file" | "url" | null>(null);

  const handleFileSelected = (file: File) => {
    const displayDicom = async (canvas: HTMLCanvasElement) => {
      try {
        const buffer = await file.arrayBuffer();
        const image = dicomjs.parseImage(buffer);
        if (!image) {
          console.log("No Image");
          return;
        }
        // access any tags needed, common ones have parameters
        console.log("PatientID:", image.patientID);
        // or use the DICOM tag group, element id pairs
        console.log("PatientName:", image.getTagValue([0x0010, 0x0010]));

        // create the renderer (keeping hold of an instance for the canvas can
        // improve 2nd image decode performance hugely - see examples)
        const renderer = new dicomjs.Renderer(canvas);

        // decode, and display frame 0 on the canvas
        await renderer.render(image, 0);
      } catch (e) {
        // ...
        console.error(e);
      }
    };

    const canvas = document.createElement("canvas");
    (document.getElementById("dicom-container") as HTMLDivElement).appendChild(
      canvas,
    );
    displayDicom(canvas);
  };

  const handleUrlSubmitted = (url: string) => {};

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">DICOM Viewer</CardTitle>
          <CardDescription>
            View DICOM medical images from your computer or from a URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="file">Local File</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="file">
              <FileUpload onFileSelected={handleFileSelected} />
            </TabsContent>
            <TabsContent value="url">
              <UrlInput onUrlSubmitted={handleUrlSubmitted} />
            </TabsContent>
          </Tabs>

          <div id="dicom-container"></div>
        </CardContent>
      </Card>
    </main>
  );
}
