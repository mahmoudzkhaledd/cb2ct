import { Prisma } from "@prisma/client";

type StudyFilterInput = {
  id?: string;
  userId?: string;
  status?: string;
  failerReason?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
};

export function buildStudyPrismaFilter(
  input: StudyFilterInput,
): Prisma.StudyWhereInput {
  const filter: Prisma.StudyWhereInput = {};

  if (input.id) {
    filter.id = input.id;
  }

  if (input.userId) {
    filter.userId = input.userId;
  }

  if (input.status) {
    filter.status = input.status as any;
  }

  if (input.failerReason) {
    filter.failerReason = {
      contains: input.failerReason,
      mode: "insensitive",
    };
  }

  if (input.createdAtFrom || input.createdAtTo) {
    filter.createdAt = {};
    if (input.createdAtFrom) {
      filter.createdAt.gte = new Date(input.createdAtFrom);
    }
    if (input.createdAtTo) {
      filter.createdAt.lte = new Date(input.createdAtTo);
    }
  }

  return filter;
}
