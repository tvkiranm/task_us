import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-950 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 bg-white text-slate-700",
};

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };

