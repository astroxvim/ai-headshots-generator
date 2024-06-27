"use client";

import React from "react";
import { Radio } from "@nextui-org/react";
import { cn } from "../../utils/cn";

interface PreferenceRadioItemProps {
  title: string;
  description: React.ReactNode;
  value: string;
  className?: string;
  classNames?: { [key: string]: string };
  children?: React.ReactNode;
}

const PreferenceRadioItem = React.forwardRef<HTMLInputElement, PreferenceRadioItemProps>(
  ({ classNames = {}, className, children, description, value, ...props }, ref) => (
    <Radio
      {...props}
      ref={ref}
      value={value}
      classNames={{
        ...classNames,
        label: cn("static", classNames?.label),
        base: cn(
          "relative w-full inline-flex m-0 bg-black/90 hover:bg-black/70 items-center justify-between",
          "flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 !border-medium border-default-100",
          "data-[selected=true]:border-primary",
          classNames?.base,
          className,
        ),
        wrapper: "flex"
      }}
    >
      <div className="flex items-center">
        {description}
      </div>
    </Radio>
  ),
);

PreferenceRadioItem.displayName = "PreferenceRadioItem";

export default PreferenceRadioItem;
