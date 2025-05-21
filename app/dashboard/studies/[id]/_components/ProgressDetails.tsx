"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyStatus } from "@prisma/client";
import { Check, Settings, TextIcon, UploadIcon } from "lucide-react";
import React from "react";

const stages = {
  UPLOADED: {
    index: 0,
    name: "Slices Uploaded",
    description:
      "The image slices have been successfully uploaded and are ready for processing.",
    icon: UploadIcon,
  },
  PENDING: {
    index: 1,
    name: "Awaiting Processing",
    description:
      "The uploaded slices are currently in the processing queue. They will be handled shortly.",
    icon: Settings,
  },
  IN_PROGRESS: {
    index: 2,
    name: "Processing In Progress",
    description:
      "The slices are actively being processed by the server. Please wait until the operation is complete.",
    icon: TextIcon,
  },
};

export default function ProgressDetails({ state }: { state: StudyStatus }) {
  const stateIndex =
    stages[state] == null ? 1000 : (stages[state].index as number);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Processing Stages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {Object.entries(stages).map(([k, v], idx) => {
            return (
              <div
                className="flex items-center gap-2 rounded-lg border p-4"
                key={idx}
              >
                {state == k ? (
                  <LoadingSpinner className="size-5" />
                ) : v.index < stateIndex ? (
                  <Check />
                ) : (
                  <v.icon className="w-5" />
                )}
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold">{v.name}</h2>
                  <p className="text-sm text-gray-400">
                    {state == k
                      ? v.description
                      : v.index < stateIndex
                        ? "Done"
                        : "Waiting..."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
