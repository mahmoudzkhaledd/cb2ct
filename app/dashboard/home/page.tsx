import React from "react";
import { prisma } from "@/lib/db";
import { toInt } from "@/lib/utils";
import { getServerSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StudyCard from "./_components/StudyCard";
import PaginationComponent from "@/components/general/PaginationComponent";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pg = toInt(page) ?? 0;
  const session = await getServerSession();
  const studies = await prisma.study.findMany({
    where: {
      userId: session?.user.id ?? "asdasdasdasdasd",
    },
    take: 10,
    skip: pg * 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Studies</h2>
        <Link href={"/dashboard/new-study"}>
          <Button size={"sm"}>New Study</Button>
        </Link>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studies.map((study) => (
          <StudyCard study={study} key={study.id} />
        ))}
      </div>

      {studies.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No studies found matching your search criteria.
          </p>
        </div>
      )}
      <PaginationComponent className="mt-5" page={pg} length={studies.length} />
    </div>
  );
}
