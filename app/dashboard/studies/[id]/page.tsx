import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import DwvComponent from "../../../../components/general/DwvComponent";
import { getConfigs } from "@/utils/configs";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { ClockFading, Info } from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import CodeSnippet from "@/components/general/CodeSnippet";
export default async function StudyPage({
  params,
}: {
  params: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const study = await prisma.study.findUnique({
    where: {
      id: id ?? "asdasd",
    },
  });
  if (!study) return notFound();
  const configs = await getConfigs();

  return (
    <div className="w-full space-y-5">
      <div className="h-fit rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Properties</h2>
          <div className="flex items-center gap-1">
            {(study.status == "PENDING" || study.status == "IN_PROGRESS") && (
              <LoadingSpinner />
            )}
            {study.status != "PENDING" && (
              <Badge className={`${getStatusColor(study.status)} text-white`}>
                {study.status}
              </Badge>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CodeSnippet label="Id" text={study.id} />
          <CodeSnippet label="Status" text={study.status} />
          <CodeSnippet label="Description" text={study.description} />
          {study.failerReason && (
            <CodeSnippet label="Failer reason" text={study.failerReason} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Original slices</h2>
          <DwvComponent
            id="dwv-1"
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
          <h2 className="text-lg font-semibold">Enhanced slices</h2>
          {study.resultFileIds.length == 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-neutral-50 p-4">
              <ClockFading />
              <p>Waiting for the server to process data.</p>
            </div>
          ) : (
            <DwvComponent
              id="dwv-2"
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
    </div>
  );
}
