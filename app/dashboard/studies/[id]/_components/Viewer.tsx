"use client";
import DwvComponent from "@/components/general/DwvComponent";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useConfigs } from "@/components/providers/ConfigsProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Study } from "@prisma/client";
import {
  ArrowLeft,
  Check,
  Clock,
  ClockFading,
  RefreshCcw,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ProgressDetails from "./ProgressDetails";

const socket = io("http://localhost:8001");
export default function Viewer({ study: std }: { study: Study }) {
  const configs = useConfigs();
  const [study, setStudy] = useState<Study>(std);
  useEffect(() => {
    socket.emit("join_study", study.id);

    socket.on("study_state_change", (data) => {
      console.log("Study state updated:", data);
      if (data.state == "COMPLETED") {
        window.location.reload();
        return;
      }
      setStudy((prev) => {
        return {
          ...prev,
          status: data.state,
          failerReason: data.failerReason,
          resultFileIds: data.resultIds,
          metadata: data.metadata,
        };
      });
    });

    return () => {
      socket.emit("leave_study", study.id);
      socket.off("study_state_change");
    };
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <a href="/dashboard/home">
            <Button size="icon">
              <ArrowLeft />
            </Button>
          </a>
          <h2 className="text-lg font-semibold">Original slices</h2>
        </div>
        <DwvComponent
          id="dwv-1"
          className="h-full"
          layerClassName="h-[1000px]"
          inputId="inpt-1"
          linkId="link-1"
          dropBoxId="dbox-1"
          layerId="layer-1"
          urls={study.filesIds.map(
            (e, idx) =>
              `${configs.orthancHost}:${configs.orthancPort}/instances/${e}/file`,
          )}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Enhanced slices</h2>
          <Badge className="flex items-center gap-2">
            {study.status == "PENDING" ? (
              <ClockFading className="w-4" />
            ) : study.status == "COMPLETED" ? (
              <Check className="w-4" />
            ) : study.status == "FAILED" ? (
              <X className="w-4" />
            ) : (
              <RefreshCcw className="w-4" />
            )}
            {study.status}
          </Badge>
        </div>
        {study.resultFileIds.length == 0 ? (
          <>
            {study.status == "FAILED" ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-neutral-50 p-5">
                <div className="flex flex-col items-center gap-2 text-red-400">
                  <XCircle size={40} />
                  <p className="text-center">
                    {study.failerReason ?? "Unknown failer reason"}
                  </p>
                </div>
              </div>
            ) : (
              <ProgressDetails state={study.status} />
            )}
          </>
        ) : (
          <DwvComponent
            id="dwv-2"
            className="h-full"
            layerClassName="h-[1000px]"
            inputId="inpt-2"
            linkId="link-2"
            dropBoxId="dbox-2"
            layerId="layer-2"
            urls={study.resultFileIds.map(
              (e, idx) =>
                `${configs.orthancHost}:${configs.orthancPort}/instances/${e}/file`,
            )}
          />
        )}{" "}
      </div>
    </div>
  );
}
