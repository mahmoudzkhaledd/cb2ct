import React from "react";
import { prisma } from "@/lib/db";
import { toInt } from "@/lib/utils";
import { getServerSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StudyCard from "./_components/StudyCard";
import PaginationComponent from "@/components/general/PaginationComponent";
import FilterComponent from "@/components/general/FilterComponent";
import { studyFilters } from "@/components/filters/studyFilters";
import { buildStudyPrismaFilter } from "@/utils/studyFilters";
import { Info } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page, ...newParams } = await searchParams;
  const pg = toInt(page) ?? 0;
  const session = await getServerSession();
  const studies = await prisma.study.findMany({
    where: {
      userId: session?.user.id ?? "asdasdasdasdasd",
      ...buildStudyPrismaFilter(newParams),
    },
    take: 10,
    skip: pg * 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto h-full max-w-[1500px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Studies</h2>
        <Link href={"/dashboard/new-study"}>
          <Button size={"sm"}>New Study</Button>
        </Link>
      </div>
      <div className="mt-5 flex h-full w-full items-start gap-2">
        <FilterComponent filters={studyFilters} />
        <div className="h-full flex-1">
          {studies.length === 0 && (
            <div className="m-auto flex flex-col items-center gap-2 py-12 text-center">
              <Info size={40} />
              <p className="text-muted-foreground">
                No studies found matching your search criteria.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => (
              <StudyCard study={study} key={study.id} />
            ))}
          </div>
          <PaginationComponent
            className="mt-5"
            page={pg}
            length={studies.length}
          />
        </div>
      </div>
    </div>
  );
}
