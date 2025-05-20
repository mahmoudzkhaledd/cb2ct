"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { Study, StudyStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useConfigs } from "@/components/providers/ConfigsProvider";
import { getStatusColor } from "@/lib/utils";

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};
export default function StudyCard({ study }: { study: Study }) {
  const configs = useConfigs();

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge className={`${getStatusColor(study.status)} text-white`}>
            {study.status.replace("_", " ")}
          </Badge>
          <div className="text-muted-foreground flex items-center text-sm">
            <Clock className="mr-1 h-3.5 w-3.5" />
            {formatDate(study.createdAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col">
        <CardTitle className="mb-2 line-clamp-2 text-lg">
          {study.description}
        </CardTitle>
        <div className="mt-4 pb-5">
          <div className="text-muted-foreground mb-2 flex items-center text-sm">
            <FileText className="mr-2 h-4 w-4" />
            <span>
              {study.filesIds.length} file
              {study.filesIds.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(study.filesIds.length > 5
              ? study.filesIds.slice(0, 5)
              : study.filesIds
            ).map((fileId, index) => (
              <a
                key={fileId}
                href={`${configs.orthancHost}:${configs.orthancPort}/instances/${fileId}/file`}
              >
                <Badge variant="outline" className="text-xs">
                  File {index + 1}
                </Badge>
              </a>
            ))}
            {study.filesIds.length > 5 && (
              <Badge variant="outline" className="text-xs">
                ...
              </Badge>
            )}
          </div>
        </div>
        <a href={`/dashboard/studies/${study.id}`} className="mt-auto w-full">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
