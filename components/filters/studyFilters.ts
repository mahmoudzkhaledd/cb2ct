import { FilterItem } from "@/components/general/FilterComponent";

export const studyFilters: (FilterItem[] | FilterItem)[] = [
  {
    label: "ID",
    name: "id",
  },
  {
    label: "User ID",
    name: "userId",
  },
  {
    label: "Status",
    name: "status",
    compType: "select",
    selectProps: {
      defaultValue: "",
      options: [
        { label: "All", value: "" },
        { label: "Pending", value: "PENDING" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Failed", value: "FAILED" },
      ],
    },
  },
  {
    label: "Failure Reason",
    name: "failerReason",
  },
  [
    {
      label: "Created At (From)",
      name: "createdAtFrom",
      type: "date",
    },
    {
      label: "Created At (To)",
      name: "createdAtTo",
      type: "date",
    },
  ],
];
