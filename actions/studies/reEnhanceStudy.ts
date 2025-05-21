"use server";
import { prisma } from "@/lib/db";
import { ServerAction } from "@/lib/serverAction";
import { z } from "zod";
import { rabbitMq } from "@/lib/ampp";
import axios from "axios";
import { getConfigs } from "@/utils/configs";
export const reEnhanceStudyAction = ServerAction.auth(
  z.string(),
  async (user, data) => {
    const study = await prisma.study.findUnique({
      where: { id: data },
    });
    if (!study) throw new Error("msg: Study not found");
    if (study.status == "IN_PROGRESS") {
      throw new Error("msg: Please wait until the study is completed");
    }
    const configs = await getConfigs();
    // for (const e of study.resultFileIds) {
    //   await axios.delete(
    //     `${configs.orthancHost}:${configs.orthancPort}/instances/${e}`,
    //     {
    //       auth: {
    //         username: configs.orthancUsername,
    //         password: configs.orthancPassword,
    //       },
    //     },
    //   );
    // }
    const studyUpdated = await prisma.study.update({
      where: { id: study.id },
      data: {
        resultFileIds: [],
        status: "PENDING",
      },
    });
    await rabbitMq.publishMessage("new_study", studyUpdated);
  },
);
