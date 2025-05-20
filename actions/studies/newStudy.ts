"use server";
import { prisma } from "@/lib/db";
import { ServerAction } from "@/lib/serverAction";
import { newStudySchema } from "@/types/schemas/newStudy.schema";
import { z } from "zod";
import { rabbitMq } from "@/lib/ampp";
export const newStudyAction = ServerAction.auth(
  z.array(newStudySchema),
  async (user, data) => {
    const study = await prisma.study.create({
      data: {
        description: "",
        filesIds: data.map((file) => file.ID),
        user: {
          connect: {
            id: user.user.id,
          },
        },
      },
    });
    await rabbitMq.publishMessage("new_study", study);
    return study;
  },
);
