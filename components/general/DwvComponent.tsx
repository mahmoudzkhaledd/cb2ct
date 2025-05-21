"use client";
import React, { useState, useEffect, useRef, JSX, useCallback } from "react";
import { App, decoderScripts, ToolConfig } from "dwv";
import { ArrowDown, ArrowUp } from "lucide-react";
import axios from "axios";
import { FileProps } from "../providers/DwvFilesProvider";
import { useConfigs } from "../providers/ConfigsProvider";
import { cn } from "@/lib/utils";

// Image decoders (for web workers)
decoderScripts.jpeg2000 = `${process.env.NEXT_PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpeg2000.js`;
decoderScripts["jpeg-lossless"] =
  `${process.env.NEXT_PUBLIC_URL}/assets/dwv/decoders/rii-mango/decode-jpegloss.js`;
decoderScripts["jpeg-baseline"] =
  `${process.env.NEXT_PUBLIC_URL}/assets/dwv/decoders/pdfjs/decode-jpegbaseline.js`;
decoderScripts.rle = `${process.env.NEXT_PUBLIC_URL}/assets/dwv/decoders/dwv/decode-rle.js`;

interface MetaData {
  [key: string]: any;
}

const DwvComponent = ({
  urls,
  onAddFiles,
  id,
  layerId,
  dropBoxId,
  inputId,
  linkId,
  className,
  layerClassName,
  removeAllFiles,
}: {
  urls?: string[];
  onAddFiles?: (files: FileProps[]) => void;
  removeAllFiles?: () => void;
  id?: string;
  layerId?: string;
  dropBoxId?: string;
  inputId?: string;
  linkId?: string;
  className?: string;
  layerClassName?: string;
}) => {
  const [tools] = useState<{ [key: string]: ToolConfig }>({
    Scroll: {
      options: [],
    },
    ZoomAndPan: {
      options: [],
    },
    WindowLevel: {
      options: [],
    },
  });
  const configs = useConfigs();
  const fetchDicomFilesWithAuth = async (): Promise<File[]> => {
    const files: File[] = [];

    for (let index = 0; index < urls.length; index++) {
      const url = urls[index];

      try {
        const response = await axios
          .get(url, {
            responseType: "blob",
            auth: {
              username: configs.orthancUsername,
              password: configs.orthancPassword,
            },
          })
          .catch((e) => null);
        if (!response) continue;
        const file = new File([response.data], `dicom_${index}.dcm`, {
          type: "application/dicom",
        });

        files.push(file);
      } catch (error) {
        console.error(`Failed to fetch DICOM from ${url}:`, error);
        // Optionally show a toast or log the failed URL somewhere
      }
    }

    return files;
  };
  const [selectedTool, setSelectedTool] = useState<string>("Select Tool");
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<MetaData>({});
  const [showDicomTags, setShowDicomTags] = useState<boolean>(false);
  const fetchFiles = useCallback(fetchDicomFilesWithAuth, []);
  const dwvAppRef = useRef<App | null | undefined>(null);
  const dropboxDivId = dropBoxId ?? "dropBox";
  const dropboxClassName = "dropBox";
  const borderClassName = "dropBoxBorder";
  const hoverClassName = "hover";

  const initLoadFiles = async () => {
    if (!dwvAppRef.current) return;
    if (urls) {
      showDropbox(false);
      const files = await fetchFiles();
      dwvAppRef.current.loadFiles(files);
    } else {
      showDropbox(true);
    }

    dwvAppRef.current.loadFromUri(window.location.href);
  };
  // Initialize the app
  useEffect(() => {
    const app = new App();

    app.init({
      dataViewConfigs: {
        "*": [
          {
            divId: layerId ?? "layerGroup0",
          },
        ],
      },
      tools: tools,
    } as any);

    // load events
    let nLoadItem: number | null = null;
    let nReceivedLoadError: number | null = null;
    let nReceivedLoadAbort: number | null = null;
    let isFirstRender: boolean | null = null;

    app.addEventListener("loadstart", () => {
      // reset flags
      nLoadItem = 0;
      nReceivedLoadError = 0;
      nReceivedLoadAbort = 0;
      isFirstRender = true;
      // hide drop box
      showDropbox(false);
    });

    app.addEventListener("loadprogress", (event) => {
      setLoadProgress(event.loaded);
    });

    app.addEventListener("renderend", () => {
      if (isFirstRender) {
        isFirstRender = false;
        // available tools
        let newSelectedTool = "ZoomAndPan";
        if (app.canScroll()) {
          newSelectedTool = "Scroll";
        }
        onChangeTool(newSelectedTool);
      }
    });

    app.addEventListener("load", (event) => {
      // set dicom tags
      setMetaData(app.getMetaData(event.dataid));
      // set data loaded flag
      setDataLoaded(true);
    });

    app.addEventListener("loadend", () => {
      if (nReceivedLoadError) {
        setLoadProgress(0);
        alert("Received errors during load. Check log for details.");
        // show drop box if nothing has been loaded
        if (!nLoadItem) {
          showDropbox(true);
        }
      }
      if (nReceivedLoadAbort) {
        setLoadProgress(0);
        alert("Load was aborted.");
        showDropbox(true);
      }
    });

    app.addEventListener("loaditem", () => {
      if (nLoadItem !== null) nLoadItem++;
    });

    app.addEventListener("loaderror", (event) => {
      console.error(event.error);
      if (nReceivedLoadError !== null) nReceivedLoadError++;
    });

    app.addEventListener("loadabort", () => {
      if (nReceivedLoadAbort !== null) nReceivedLoadAbort++;
    });

    // handle key events
    app.addEventListener("keydown", (event) => {
      app.defaultOnKeydown(event);
    });

    window.addEventListener("resize", app.onResize);

    dwvAppRef.current = app;

    setupDropbox(app);
    initLoadFiles();

    return () => {
      window.removeEventListener("resize", app.onResize);
    };
  }, []);
  const onFullReset = () => {
    if (dwvAppRef.current) {
      dwvAppRef.current.reset();
      setDataLoaded(false);
      setMetaData({});
      setSelectedTool("Select Tool");
      showDropbox(true);
      if (removeAllFiles) removeAllFiles();
    }
  };

  const getToolIcon = (tool: string): JSX.Element | null => {
    switch (tool) {
      case "Scroll":
        return <span>Scroll</span>;
      case "ZoomAndPan":
        return <span>Zoom</span>;
      case "WindowLevel":
        return <span>Window</span>;
      case "Draw":
        return <span>Draw</span>;
      default:
        return null;
    }
  };

  /**
   * Handle a change tool event.
   */
  const onChangeTool = (tool: string) => {
    if (dwvAppRef.current) {
      setSelectedTool(tool);
      dwvAppRef.current.setTool(tool);
      if (tool === "Draw") {
        onChangeShape(tools.Draw.options[0]);
      }
    }
  };

  /**
   * Check if a tool can be run.
   */
  const canRunTool = (tool: string): boolean => {
    if (!dwvAppRef.current) return false;

    switch (tool) {
      case "Scroll":
        return dwvAppRef.current.canScroll();
      case "WindowLevel":
        return dwvAppRef.current.canWindowLevel();
      default:
        return true;
    }
  };

  /**
   * Handle a change draw shape event.
   */
  const onChangeShape = (shape: string) => {
    if (dwvAppRef.current) {
      dwvAppRef.current.setToolFeatures({ shapeName: shape });
    }
  };

  /**
   * Handle a reset event.
   */
  const onReset = () => {
    if (dwvAppRef.current) {
      dwvAppRef.current.resetDisplay();
    }
  };

  // drag and drop [begin] -----------------------------------------------------

  /**
   * Setup the data load drop box: add event listeners and set initial size.
   */
  const setupDropbox = (app: App) => {
    showDropbox(true);
  };

  /**
   * Handle a an input[type:file] change event.
   */
  const onInputFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (dwvAppRef.current && event.target && event.target.files) {
      const files = Array.from(event.target.files);
      if (onAddFiles)
        onAddFiles(
          files.map((file) => ({
            id: Math.random().toString(36).substring(2, 15),
            name: file.name,
            file: file,
            progress: 0,
          })),
        );
      dwvAppRef.current.loadFiles(files);
    }
  };

  /**
   * Show/hide the data load drop box.
   */
  const showDropbox = (show: boolean) => {
    const box = document.getElementById(dropboxDivId);
    if (!box) {
      return;
    }
    const layerDiv = document.getElementById(layerId ?? "layerGroup0");

    if (show) {
      // reset css class
      box.className = dropboxClassName + " " + borderClassName;
      // check content
      if (box.innerHTML === "") {
        const p = document.createElement("p");
        p.style.fontSize = "18px";
        p.style.color = "#333";
        p.style.fontWeight = "bold";
        p.style.textAlign = "center";
        p.style.marginTop = "40px";
        p.style.fontFamily = "Arial, sans-serif";
        p.appendChild(document.createTextNode("Choose files by "));
        // input file
        const input = document.createElement("input");
        input.onchange = onInputFile as any;
        input.type = "file";
        input.multiple = true;
        input.id = inputId ?? "input-file";
        input.style.display = "none";
        const label = document.createElement("label");
        label.htmlFor = "input-file";
        const link = document.createElement("a");
        link.appendChild(document.createTextNode("click here"));
        link.id = linkId ?? "input-file-link";
        link.style.color = "#007bff";
        link.style.textDecoration = "underline";
        link.style.cursor = "pointer";

        label.appendChild(link);
        p.appendChild(input);
        p.appendChild(label);

        box.appendChild(p);
      }
      // show box
      box.setAttribute("style", "display:initial");
    } else {
      // remove border css class
      box.className = dropboxClassName;
      // remove content
      box.innerHTML = "";
      // hide box
      box.setAttribute("style", "display:none");
    }
  };

  return (
    <div id={id ?? "dwv"} className={cn("flex-1", className)}>
      <div style={{ width: "100%", height: "4px", backgroundColor: "#ddd" }}>
        <div
          style={{
            width: `${loadProgress}%`,
            height: "100%",
            backgroundColor: "#4CAF50",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(tools).map((tool) => (
          <button
            key={tool}
            onClick={() => onChangeTool(tool)}
            disabled={!dataLoaded || !canRunTool(tool)}
            style={{
              padding: "4px 8px",
              backgroundColor: selectedTool === tool ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {getToolIcon(tool)}
          </button>
        ))}

        <button
          onClick={onReset}
          disabled={!dataLoaded}
          style={{
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>

        {!urls && (
          <button
            onClick={onFullReset}
            style={{
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "#ffff",
            }}
          >
            Reset Viewer
          </button>
        )}
      </div>

      <div
        id={layerId ?? "layerGroup0"}
        className={cn(
          "layerGroup h-[600px] w-full overflow-hidden rounded-lg border bg-black",
          layerClassName,
        )}
      />
      <div id={dropBoxId ?? "dropBox"}></div>
      {dataLoaded && (
        <>
          <div className="mt-10 space-y-3">
            <button
              onClick={() => setShowDicomTags(!showDicomTags)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-5 transition-colors hover:bg-neutral-100"
            >
              <span>Show Tags</span>
              {showDicomTags ? <ArrowUp /> : <ArrowDown />}
            </button>
            {showDicomTags && (
              <div
                className={"h-[500px] overflow-y-auto rounded-lg border p-5"}
              >
                {Object.entries(metaData).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: "8px" }}>
                    <strong>{key}:</strong> {JSON.stringify(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DwvComponent;
