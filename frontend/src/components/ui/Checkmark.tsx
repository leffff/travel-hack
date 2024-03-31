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
}

export const Checkmark = observer((x: Props) => {
  return (
    <button
      onClick={(e) => x.onClick?.(e)}
      style={{ width: x.size, height: x.size }}
      className={cn(
        "w-5 h-5 p-1 flex items-center justify-center rounded",
        x.checked && "bg-primary",
        !x.checked && "bg-white border border-checkbox-border"
      )}>
      {x.checked && <CheckIcon className={x.variant === "accent" ? "text-text" : "text-white"} />}
    </button>
  );
});

export const CheckmarkWithLabel = observer((x: Props & { label: ReactNode }) => {
  return (
    <label onClick={(e) => x.onClick?.(e)} className="flex items-center gap-2 cursor-pointer">
      <Checkmark {...x} />
      {x.label}
    </label>
  );
});
