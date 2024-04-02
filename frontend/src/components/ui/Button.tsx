import { cn } from "@/lib/utils/cn";
import { ReactNode } from "@tanstack/react-router";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "outline";
  disabled?: boolean;
}

export const Button = (x: Props) => {
  return (
    <button
      {...x}
      className={cn(
        "flex items-center cursor-pointer px-4 py-3 gap-2 h-fit rounded-xl justify-center",
        (!x.variant || x.variant === "default") &&
          "bg-primary disabled:bg-[#E5E5E5] disabled:text-[#BDBDBD]",
        x.variant === "accent" && "bg-button-accent",
        x.variant === "outline" && "border border-button-outline",
        x.className
      )}>
      {x.children}
    </button>
  );
};
