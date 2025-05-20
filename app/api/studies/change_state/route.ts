"use server";

import { changeStudyStateSchema } from "@/types/schemas/changeStudyState.schema";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    const model = changeStudyStateSchema.parse(body);
    console.log(model.metadata);
    await prisma.study.update({
      where: {
        id: model.id,
      },
      data: {
        status: model.state,
        failerReason: model.failerReason,
        resultFileIds: model.resultIds,
      },
    });
    return NextResponse.json({
      state: "done",
    });
  } catch (ex) {
    console.log(ex);
    return NextResponse.json({
      error: ex.message,
    });
  }
};
