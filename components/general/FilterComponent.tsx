"use client";
import React, { HTMLInputTypeAttribute } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

import { Textarea } from "../ui/textarea";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";

import { cn, toInt } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import CustomSelect from "../ui/CustomSelect";
import DivGrid from "./DivGrid";

export type FilterItem = {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeHolder?: string;
  defaultValue?: string | number | boolean;
  compType?: "select" | "input" | "area";
  selectProps?: {
    defaultValue: string;
    options: { value: string; label: string }[];
  };
};
export function getFilterDefaultValues(
  filter: (FilterItem | FilterItem[])[],
  defaultVals: any,
) {
  const values: any = {};
  for (const f of filter) {
    if (!Array.isArray(f)) {
      if (f.compType == "select" && f.selectProps != null)
        values[f.name] = f.selectProps.defaultValue;
      else
        values[f.name] =
          defaultVals[f.name] ??
          f.defaultValue ??
          (f.type == "number" ? 0 : f.type == "checkbox" ? false : "");
    } else {
      for (const x of f) {
        if (x.compType == "select" && x.selectProps != null)
          values[x.name] = x.selectProps.defaultValue;
        else
          values[x.name] =
            defaultVals[x.name] ??
            x.defaultValue ??
            (x.type == "number" ? 0 : x.type == "checkbox" ? false : "");
      }
    }
  }
  return values;
}

export function RenderFilterComponent({
  ele,
  defaultValue,
  options,
}: {
  ele: FilterItem;
  defaultValue: string;
  options?: {
    value: string;
    onChange: (...event: any[]) => void;
  };
}) {
  if (ele.compType == "select" && ele.selectProps != null) {
    const defaultV: any =
      options?.value != null
        ? undefined
        : defaultValue == ""
          ? ele.selectProps?.defaultValue
          : defaultValue;
    return (
      <div>
        <Label htmlFor={ele.name}>{ele.label}</Label>
        <CustomSelect
          defaultValue={defaultV}
          id={ele.name}
          name={ele.name}
          {...options}
        >
          {ele.selectProps?.options?.map((e, idx) => (
            <option key={idx} value={e.value}>
              {e.label}
            </option>
          ))}
        </CustomSelect>
      </div>
    );
  }
  return (
    <div
      className={cn("space-y-1", {
        "ml-auto flex w-fit flex-row-reverse items-center gap-1":
          ele.type == "checkbox",
      })}
    >
      <Label htmlFor={ele.name}>{ele.label}</Label>
      {ele.compType == "input" || ele.compType == null ? (
        ele.type != "checkbox" ? (
          <Input
            placeholder={ele.label}
            type={ele.type}
            name={ele.name}
            id={ele.name}
            defaultValue={options ? undefined : defaultValue}
            {...options}
          />
        ) : (
          <Checkbox
            name={ele.name}
            id={ele.name}
            value={options ? options.value : undefined}
            onCheckedChange={options ? options.onChange : undefined}
          />
        )
      ) : ele.compType == "area" ? (
        <Textarea
          name={ele.name}
          id={ele.name}
          className="bg-white"
          placeholder={ele.label}
          defaultValue={options ? undefined : defaultValue}
          {...options}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
export function RenderFilterLayout({
  filters,
  controller,
  disabled,
}: {
  filters: (FilterItem[] | FilterItem)[];
  controller?: Control<any>;
  disabled?: boolean;
}) {
  const searchParams = useSearchParams();
  const RenderEle = ({ value, ele }: { value: string; ele: FilterItem }) => {
    if (controller == null) {
      return <RenderFilterComponent defaultValue={value} ele={ele} />;
    } else {
      return (
        <FormField
          control={controller}
          name={ele.name}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <RenderFilterComponent
                    options={{
                      value: field.value ?? "",

                      onChange:
                        ele.type == "number"
                          ? (e) => field.onChange(toInt(e.target.value))
                          : field.onChange,
                    }}
                    defaultValue={""}
                    ele={ele}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    }
  };
  return (
    <fieldset disabled={disabled} className="flex flex-col gap-3">
      {filters?.map((e, idx1) => {
        if (Array.isArray(e)) {
          return (
            <DivGrid className="gap-4" key={idx1}>
              {e.map((k, idx) => (
                <RenderEle
                  value={searchParams.get(k.name) ?? ""}
                  ele={k}
                  key={idx}
                />
              ))}
            </DivGrid>
          );
        } else {
          const x = e as FilterItem;
          return (
            <RenderEle
              value={searchParams.get(x.name) ?? ""}
              ele={x}
              key={idx1}
            />
          );
        }
      })}
    </fieldset>
  );
}
export default function FilterComponent({
  filters,
}: {
  filters: (FilterItem[] | FilterItem)[];
}) {
  const handelFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const query = new URLSearchParams(); // old

    formData.forEach((value, key) => {
      const val = value.toString().trim();
      if (val != "") {
        query.set(key, val);
      }
    });
    window.location.href = `?${query.toString()}`;
  };
  const clearSearch = () => {
    window.location.search = "";
  };
  return (
    <form onSubmit={handelFormSubmit}>
      <Card className="col-span-1 h-fit border">
        <CardHeader className="flex flex-row items-center justify-between pt-3">
          <CardTitle>Filters </CardTitle>
          <div className="flex flex-row items-center gap-3">
            <Button onClick={clearSearch} size={"icon"} variant={"outline"}>
              <Trash className="w-4" />
            </Button>
            <Button type="submit" size={"icon"}>
              <Search className="w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <RenderFilterLayout filters={filters} />
        </CardContent>
      </Card>
    </form>
  );
}
