import { cn } from "@/lib/utils/cn";
import ChevronIcon from "@/assets/icons/chevron.svg";

interface Props {
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const directionMap = {
  up: "rotate-180",
  down: "",
  left: "rotate-90",
  right: "rotate-270"
} as const;

export const Chevron = (x: Props) => {
  return <ChevronIcon className={cn("size-5", directionMap[x.direction ?? "down"], x.className)} />;
};
