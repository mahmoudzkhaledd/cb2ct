import { cn } from "@/lib/utils";
import React from "react";

export default function DivGrid({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", className)}>
      {children}
    </div>
  );
}
