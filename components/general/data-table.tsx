"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { OnChangeFn } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, toInt } from "@/lib/utils";
import PaginationComponent from "./PaginationComponent";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  getRowId?: (row: any) => any;
  rowSelection?: any;
  setRowSelection?: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData, TValue>({
  data: initialData,
  columns,
  getRowId,
  setRowSelection,
  rowSelection,
}: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();

  const pageFromUrl = searchParams.get("page");
  const page = toInt(pageFromUrl) ?? 0;

  const table = useReactTable({
    data: initialData,
    columns,
    state: rowSelection
      ? {
          rowSelection,
        }
      : undefined,
    getRowId: getRowId,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={"w-0 min-w-0 flex-1"}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="w-0 min-w-0 flex-1 overflow-hidden text-ellipsis"
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex w-full items-center justify-between gap-8">
        <span className="text-nowrap text-sm">Page {page + 1}</span>
        <PaginationComponent page={page} length={initialData.length} />
      </div>
    </div>
  );
}
