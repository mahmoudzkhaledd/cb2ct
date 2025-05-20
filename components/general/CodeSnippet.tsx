"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function CodeSnippet({
  text,
  className,
  label,
  id,
  area,
  copy,
  Icon,
}: {
  className?: string;
  text?: string | number;
  label?: string;
  id?: string;
  area?: boolean;
  copy?: boolean;
  Icon?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const copyText = () => {
    navigator.clipboard.writeText(text?.toString() ?? "");
    setCopied(true);
    const delayDebounceFn = setTimeout(() => {
      setCopied(false);
      clearTimeout(delayDebounceFn);
    }, 2000);
  };
  return (
    <div className={cn("space-y-2 overflow-hidden", className)}>
      {label && (
        <Label className="capitalize" htmlFor={id}>
          {label}
        </Label>
      )}
      <div className="relative w-full">
        {area ? (
          <Textarea
            id={id}
            defaultValue={text}
            disabled={true}
            readOnly={true}
            className="w-full"
          />
        ) : (
          <Input
            id={id}
            type="text"
            defaultValue={text}
            disabled={true}
            readOnly={true}
            className="w-full"
          />
        )}
        {copy != false && Icon == null && (
          <Button
            onClick={copyText}
            type="button"
            className={cn(
              "absolute end-0 top-0 inline-flex items-center justify-center rounded-md border border-r",
              {
                "top-0 translate-y-0 border": area,
              },
            )}
            variant={"ghost"}
            size={"icon"}
          >
            {copied ? <Check className="w-4" /> : <Copy className="w-4" />}
          </Button>
        )}
        <div className="absolute end-0 top-1/2 right-2 inline-flex -translate-y-1/2 items-center justify-center">
          {Icon}
        </div>
      </div>
    </div>
  );
}
