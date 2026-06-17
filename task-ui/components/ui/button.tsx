import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-slate-950 text-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] hover:bg-slate-900",
  secondary:
    "bg-slate-100 text-slate-950 hover:bg-slate-200 shadow-none",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-none",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 shadow-none",
};

const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-11 px-5 py-3",
  sm: "h-9 px-3.5 text-sm",
  lg: "h-12 px-6",
  icon: "h-11 w-11 p-0",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };

