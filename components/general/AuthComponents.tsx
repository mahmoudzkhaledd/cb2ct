"use client";

import React from "react";
import { useSession } from "../providers/SessionProvider";

export function SignedIn({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (!session) return <></>;
  return <>{children}</>;
}
export function SignedOut({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session) return <></>;
  return <>{children}</>;
}
