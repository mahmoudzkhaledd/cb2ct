"use client";
import { Session, User } from "better-auth";
import React, { createContext, useContext } from "react";

type SessionType = {
  user: User;
  session: Session;
};

const ctx = createContext<SessionType | null>(null);

export const useSession = () => {
  const x = useContext(ctx);
  return x;
};

export default function SessionProvider({
  session,
  children,
}: {
  children: React.ReactNode;
  session: SessionType | null;
}) {
  return <ctx.Provider value={session}>{children}</ctx.Provider>;
}
