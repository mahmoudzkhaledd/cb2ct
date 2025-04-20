"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Study } from "@prisma/client";

export const studiesCols: ColumnDef<Study>[] = [
  {
    header: "Patient Name",
    accessorKey: "patientName",
  },
  {
    header: "Patient Name",
    accessorKey: "MRN",
  },
  {
    header: "Patient Name",
    accessorKey: "instances",
  },
  {
    header: "Patient Name",
    accessorKey: "modality",
  },
];
