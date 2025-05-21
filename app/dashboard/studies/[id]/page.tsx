import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

import Viewer from "./_components/Viewer";
import { Button } from "@/components/ui/button";
import { DetailsDialog } from "./_components/DetailsDialog";

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

  return (
    <div className="h-full w-full space-y-5">
      <div className="flex items-center justify-end">
        <DetailsDialog study={study} />
      </div>
      <Viewer study={study} />
    </div>
  );
}
