"use client";

import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { LogOut } from "lucide-react";

export default function SignoutButton() {
  return (
    <Button
      size="sm"
      onClick={async () => {
        const res = await authClient.signOut();

        if (res?.data?.success) {
          window.location.href = "/";
        } else if (res.error) {
          toast.error(res.error.message);
        }
      }}
      variant={"outline"}
      className="w-full lg:w-fit"
    >
      <LogOut />
      Signout
    </Button>
  );
}
