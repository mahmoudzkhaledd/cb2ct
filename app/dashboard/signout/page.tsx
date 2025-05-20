"use client";
import { authClient } from "@/lib/auth";
import React, { useEffect } from "react";

export default function page() {
  useEffect(() => {
    authClient.signOut().then(() => {
      window.location.href = "/";
    });
  });
  return <div>page</div>;
}
