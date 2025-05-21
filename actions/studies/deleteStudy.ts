"use server";
import { prisma } from "@/lib/db";
import { ServerAction } from "@/lib/serverAction";
import { z } from "zod";

export const deleteStudyAction = ServerAction.auth(
  z.string(),
  async (user, data) => {
    const study = await prisma.study.findUnique({
      where: { id: data },
    });
    if (!study) throw new Error("msg: Study not found");
  },
);
