import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingSpinner({
  className,
  size,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Loader2 className={cn("size-5 animate-spin", className)} size={size} />
  );
}
