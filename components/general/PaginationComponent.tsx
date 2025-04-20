"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { siteConstants } from "@/constants/siteConstants";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PaginationComponent({
  page,
  length,
  className,
}: {
  page: number;
  length: number;
  className?: string;
}) {
  const onChangePage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", `${page}`);
    window.location.href = `?${params.toString()}`;
  };

  return (
    <Pagination className={className}>
      <PaginationContent className={cn("gap-4", {})}>
        {page != 0 && (
          <PaginationItem onClick={() => onChangePage(page - 1)}>
            <Button className={"cursor-pointer border"} variant={"ghost"}>
              <ArrowLeft />
              Previous
            </Button>
          </PaginationItem>
        )}
        {length != 0 && length >= siteConstants.itemsPerPage && (
          <PaginationItem
            className="cursor-pointer"
            onClick={() => onChangePage(page + 1)}
          >
            <Button variant={"ghost"} className={"cursor-pointer border"}>
              Next
              <ArrowRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
