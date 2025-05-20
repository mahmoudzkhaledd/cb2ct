"use client";
import React, { useEffect, useState, useTransition } from "react";
import axios from "axios";
import { useFiles } from "../../../../components/providers/DwvFilesProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { newStudyAction } from "@/actions/studies/newStudy";
import { useRouter } from "next/navigation";
import { useConfigs } from "@/components/providers/ConfigsProvider";

function CircularProgress({ size = 100, value = 0 }) {
  const [progress, setProgress] = useState(0);

  // Animate the progress when value changes
  useEffect(() => {
    setProgress(value);
  }, [value]);

  // Calculate the circle properties
  const radius = size / 2;
  const strokeWidth = size / 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={size} width={size} className="-rotate-90 transform">
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
}

export default function FilesComponent() {
  const configs = useConfigs();
  const [loading, startTrans] = useTransition();
  const { files, updateProgress } = useFiles();

  if (files.length === 0) {
    return <></>;
  }

  const handleUpload = () => {
    startTrans(async () => {
      const resData = [];
      let failed = false;
      for (const file of files) {
        const res = await axios
          .post(
            `${configs.orthancHost}:${configs.orthancPort}/instances`,
            file.file,
            {
              headers: {
                "Content-Type": "application/dicom",
              },
              auth: {
                username: "orthanc",
                password: "orthanc",
              },
              onUploadProgress: (progressEvent) => {
                const percent =
                  (progressEvent.loaded / progressEvent.total) * 100;
                updateProgress(file.id, percent);
              },
            },
          )
          .catch((err) => {
            toast.error(
              "Error uploading file: " + file.name + " " + err.message,
            );
            return null;
          });
        if (!res?.data) {
          failed = true;
          break;
        }
        resData.push(res?.data);
      }
      if (failed) return;
      const res = await newStudyAction(resData);
      if (res?.error) {
        toast.error("Error creating study: " + res.error);
        return;
      }
      window.location.href = `/dashboard/studies/${res.res.id}`;
      toast.success("Study created successfully!");
    });
  };

  return (
    <div className="flex h-fit max-w-[500px] flex-col gap-4 rounded-lg border p-4">
      <div></div>
      <div className="grid grid-cols-3 gap-2 overflow-y-auto">
        {files.map((e, idx) => {
          return (
            <div
              className="flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-neutral-100"
              key={idx}
              title={e.name} // Add title for full name on hover
            >
              <CircularProgress value={e.progress} size={20} />
              <div className="w-full">
                <p className="overflow-hidden text-center text-xs text-ellipsis whitespace-nowrap">
                  {e.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Button loading={loading} onClick={handleUpload} className="w-full">
        Upload
      </Button>
    </div>
  );
}
