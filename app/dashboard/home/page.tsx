import React from "react";
import { prisma } from "@/lib/db";
import { toInt } from "@/lib/utils";
import { getServerSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  });
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Studies</h2>
        <Link href={"/dashboard/new-study"}>
          <Button size={"sm"}>New Study</Button>
        </Link>
      </div>
    </div>
  );
}
