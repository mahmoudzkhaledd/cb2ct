import { Prisma, StudyStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { number, ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function toNumber(n: any) {
  const isNumeric = /^-?\d*\.?\d*$/.test(n); // Check for valid number patterns
  return isNumeric && !isNaN(parseFloat(n)) ? parseFloat(n) : null;
}
export function toInt(n: any) {
  if (n == null) return null;
  return !isNaN(parseInt(n)) && !isNaN(n - 0) ? parseInt(n) : null;
}
export function isUrlMatching(url: string, routes: Array<String>) {
  for (const pattern of routes) {
    const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(
      "^" + escapedPattern.replace(/:[^\s/]+/g, "([^/]+)") + "$",
    );
    if (regex.test(url)) return true;
  }
  return false;
}
export const getStatusColor = (status: StudyStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "IN_PROGRESS":
      return "bg-blue-500";
    case "FAILED":
      return "bg-red-500";
    case "PENDING":
    default:
      return "bg-yellow-500";
  }
};
export function handlePrismaError(error: any): string | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        return `Input value is too long for field: ${error.meta?.target}`;
      case "P2001":
        return `Record not found: ${error.meta?.target}`;
      case "P2002":
        return `Unique constraint failed: ${error.meta?.target}`;
      case "P2003":
        return `Foreign key constraint failed: ${error.meta?.field_name}`;
      case "P2004":
        return `Database constraint violation: ${error.meta?.constraint}`;
      case "P2005":
        return `Invalid value provided for field: ${error.meta?.field}`;
      case "P2006":
        return `Invalid data type for field: ${error.meta?.field}`;
      case "P2007":
        return `Data validation error: ${error.meta?.message}`;
      case "P2008":
        return `Database query parsing error.`;
      case "P2009":
        return `Invalid query: ${error.meta?.query}`;
      case "P2010":
        return `Raw database error: ${error.meta?.message}`;
      case "P2011":
        return `Null constraint violation: ${error.meta?.constraint}`;
      case "P2012":
        return `Missing required field: ${error.meta?.field}`;
      case "P2013":
        return `Missing required argument: ${error.meta?.argument}`;
      case "P2014":
        return `Nested delete/update failed due to relation constraint.`;
      case "P2025":
        return `Record not found.`;
      default:
        return `Prisma known error: ${error.message}`;
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return `Unknown database error: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return `Prisma engine crashed: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return `Prisma initialization error: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return `Validation error: ${error.message}`;
  }
  return null;
}
export function fillTemplate(template: string, data: any) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return data[key.trim()] ?? "";
  });
}

export function convertDaysToHumanReadable(
  days: number,
  isArabic: boolean = false,
) {
  if (days < 30) {
    if (isArabic) {
      return `${days} ${days === 1 ? "يوم" : "أيام"}`;
    }
    return `${days} day${days === 1 ? "" : "s"}`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    if (isArabic) {
      return `${months} ${months === 1 ? "شهر" : "أشهر"}`;
    }
    return `${months} month${months === 1 ? "" : "s"}`;
  } else {
    const years = Math.floor(days / 365);
    if (isArabic) {
      return `${years} ${years === 1 ? "سنة" : "سنوات"}`;
    }
    return `${years} year${years === 1 ? "" : "s"}`;
  }
}
export function toFixed2(num: number): number {
  return parseFloat(num.toFixed(2));
}
export function extractError(ex: any): string {
  if ((ex as Error).message == "NEXT_REDIRECT") {
    throw ex;
  }
  if (process.env.NODE_ENV == "development") console.log(ex);
  const prsmaError = handlePrismaError(ex);
  if (prsmaError != null) {
    return prsmaError;
  }
  if (process.env.NODE_ENV == "development") console.log(ex);

  if (
    ex?.response?.data?.type ==
    "https://mailchimp.com/developer/marketing/docs/errors/"
  ) {
    return ex?.response?.data?.title;
  }

  if (ex instanceof ZodError && ex?.errors != null && ex?.errors.length != 0) {
    const err: any = ex.errors[0];
    return err.message;
    return `Expected ${err.expected} in ${err.path.join(".")} but received ${err.received}`;
  }
  if (ex instanceof Error && ex.message.startsWith("msg: ")) {
    return ex.message.replace("msg: ", "").trim();
  }
  return "حدث خطأ ما, يرجى إعادة المحاولة لاحقا";
}
export function addDaysNumber(date: number, days: number) {
  return date + days * 24 * 60 * 60 * 1000;
}

export function daysBetween(date1: Date, date2: Date) {
  const date1Ms = new Date(date1).getTime();
  const date2Ms = new Date(date2).getTime();

  const differenceMs = Math.abs(date2Ms - date1Ms);

  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
}
