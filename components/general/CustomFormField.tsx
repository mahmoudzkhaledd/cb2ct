import Image from "next/image";

import { Control } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { HTMLInputTypeAttribute, useState } from "react";
import { cn, toNumber } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  SWITCH_DESCRIPTION = "switch_description",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  COLOR = "color",
}

interface CustomProps {
  id?: string;
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType?: FormFieldType;
  className?: string;
  containerClassName?: string;
  inputType?: HTMLInputTypeAttribute;
}

const RenderInput = ({
  field,
  props,
  type,
  inputType,
}: {
  inputType?: HTMLInputTypeAttribute;
  field: any;
  props: Omit<CustomProps, "fieldType">;
  type: FormFieldType;
}) => {
  switch (type) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type={inputType}
              placeholder={
                (props.label ?? "") != "" ? props.label : props.placeholder
              }
              id={props.id}
              disabled={props.disabled}
              value={field.value}
              onChange={(e) =>
                inputType == "number"
                  ? field.onChange(toNumber(e.target.value))
                  : field.onChange(e)
              }
              className=""
            />
          </FormControl>
        </div>
      );

    case FormFieldType.COLOR:
      return (
        <Popover>
          <PopoverTrigger asChild onBlur={field.onBlur}>
            <Button
              {...props}
              className="block"
              size="icon"
              style={{
                backgroundColor: field.value,
              }}
              variant="outline"
            >
              <div />
            </Button>
          </PopoverTrigger>
        </Popover>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="bg-white"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.SWITCH_DESCRIPTION:
      return (
        <FormControl>
          <div className="flex flex-row items-center justify-between gap-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{props.label}</FormLabel>
              <FormDescription>{props.placeholder}</FormDescription>
            </div>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl className="w-full">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger w-full">
                <SelectValue placeholder={props.placeholder ?? props.label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { fieldType = FormFieldType.INPUT, inputType, ...rest } = props;

  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => {
        if (
          fieldType == FormFieldType.INPUT ||
          fieldType == FormFieldType.TEXTAREA ||
          fieldType == FormFieldType.COLOR
        ) {
          field.value = field.value ?? "";
        }
        return (
          <div
            className={cn(
              "flex w-full flex-col gap-2",
              props.containerClassName,
            )}
          >
            <FormItem
              className={cn("flex w-full flex-col gap-2", props.className)}
            >
              {fieldType !== FormFieldType.CHECKBOX &&
                fieldType !== FormFieldType.SWITCH_DESCRIPTION &&
                props.label && <FormLabel>{props.label}</FormLabel>}
              <RenderInput
                inputType={inputType}
                field={field}
                type={fieldType}
                props={rest}
              />
            </FormItem>
            <FormMessage className="shad-error" />
          </div>
        );
      }}
    />
  );
};

export default CustomFormField;
