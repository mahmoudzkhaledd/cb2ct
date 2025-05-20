"use client";
import { Configs } from "@prisma/client";
import React, { createContext, useContext } from "react";

const ctx = createContext<Configs | null>(null);

export const useConfigs = () => {
  const x = useContext(ctx);
  return x;
};

export default function ConfigsProvider({
  configs,
  children,
}: {
  children: React.ReactNode;
  configs: Configs;
}) {
  return <ctx.Provider value={configs}>{children}</ctx.Provider>;
}
