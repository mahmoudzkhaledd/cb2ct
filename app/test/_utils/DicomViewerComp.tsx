"use client";

import { useState } from "react";
import {
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDicomLoader } from "./useDicomLoader";
import { DicomViewport } from "./ViewPort";

export function DicomViewer() {
  const [url, setUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const { dicomData, isLoading, error, loadDicomFromUrl } = useDicomLoader();
  const [windowWidth, setWindowWidth] = useState(400);
  const [windowCenter, setWindowCenter] = useState(40);
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState("viewer");

  const handleLoadDicom = () => {
    if (inputUrl) {
      setUrl(inputUrl);
      loadDicomFromUrl(inputUrl);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setWindowWidth(400);
    setWindowCenter(40);
  };

  return (
    <Card className="overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col justify-between border-b px-4 py-2 sm:flex-row sm:items-center">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="viewer">Viewer</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter DICOM URL"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleLoadDicom} disabled={isLoading || !inputUrl}>
              {isLoading ? "Loading..." : "Load"}
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <TabsContent value="viewer" className="m-0">
            <div className="flex flex-col">
              {error && (
                <Alert variant="destructive" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="relative aspect-square max-h-[70vh] w-full overflow-hidden bg-black sm:aspect-video">
                {dicomData ? (
                  <DicomViewport
                    dicomData={dicomData}
                    windowWidth={windowWidth}
                    windowCenter={windowCenter}
                    zoom={zoom}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                        <p className="mt-4">Loading DICOM image...</p>
                      </div>
                    ) : (
                      <p>Enter a DICOM URL and click Load to view the image</p>
                    )}
                  </div>
                )}
              </div>

              {dicomData && (
                <div className="space-y-4 p-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="mr-1 h-4 w-4" /> Zoom In
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="mr-1 h-4 w-4" /> Zoom Out
                    </Button>
                    <Button variant="outline" size="sm">
                      <Move className="mr-1 h-4 w-4" /> Pan
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="mr-1 h-4 w-4" /> Fit
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="mr-1 h-4 w-4" /> Reset
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Window Width: {windowWidth}</span>
                    </div>
                    <Slider
                      value={[windowWidth]}
                      min={1}
                      max={2000}
                      step={1}
                      onValueChange={(value) => setWindowWidth(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Window Center: {windowCenter}</span>
                    </div>
                    <Slider
                      value={[windowCenter]}
                      min={-1000}
                      max={1000}
                      step={1}
                      onValueChange={(value) => setWindowCenter(value[0])}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="m-0 p-4">
            {dicomData ? (
              <div className="max-h-[70vh] overflow-y-auto">
                <h3 className="mb-2 text-lg font-medium">DICOM Metadata</h3>
                <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
                  {JSON.stringify(dicomData.metadata || {}, null, 2)}
                </pre>
              </div>
            ) : (
              <p>Load a DICOM file to view its metadata</p>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
