import { prisma } from "@/lib/db";
import { Configs } from "@prisma/client";

const defaultConfigs: Configs = {
  id: "default",
  createdAt: new Date(),
  updatedAt: new Date(),
  orthancHost: "http://localhost",
  orthancPassword: "orthanc",
  orthancPort: 8000,
  orthancUsername: "orthanc",

  rabbitmqHost: "localhost",
  rabbitmqPort: 5672,
  rabbitmqUsername: "user",
  rabbitmqPassword: "password",
  rabbitmqVhost: "/",
};

export const getConfigs = async (): Promise<Configs> => {
  const configs = (await prisma.configs.findFirst({})) ?? defaultConfigs;

  return configs;
};
