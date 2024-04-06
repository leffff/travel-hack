import CheckIcon from "@/assets/icons/check.svg";
import { cn } from "@/lib/utils/cn";
import { ReactNode } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";

interface Props {
  checked?: boolean;
  size?: number;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  variant?: "default" | "accent";
  className?: string;
}

export const Checkmark = observer((x: Props) => {
  return (
    <button
      onClick={(e) => {
        x.onClick?.(e);
      }}
      style={{ width: x.size, height: x.size }}
      className={cn(
        "size-5 min-h-5 max-h-5 min-w-5 max-w-5 p-1 flex items-center justify-center rounded",
        x.checked && "bg-primary",
        !x.checked && "bg-white border border-checkbox-border",
        x.className
      )}>
      {x.checked && <CheckIcon className={x.variant === "accent" ? "text-text" : "text-white"} />}
    </button>
  );
});

export const CheckmarkWithLabel = observer((x: Props & { label: ReactNode }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkmark {...x} />
      {x.label}
    </label>
  );
});
