"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<Element>;
  "aria-expanded"?: boolean;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used within Sheet");
  }
  return context;
}

function Sheet({
  open,
  onOpenChange,
  children,
}: Readonly<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}>) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  return (
    <SheetContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

function SheetTrigger({
  children,
}: Readonly<{
  asChild?: boolean;
  children: React.ReactElement<TriggerChildProps>;
}>) {
  const { open, setOpen } = useSheet();
  return React.cloneElement(children, {
    "aria-expanded": open,
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      setOpen(true);
    },
  });
}

function SheetContent({
  side = "left",
  className,
  children,
}: Readonly<{
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}>) {
  const { open, setOpen } = useSheet();

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close sheet"
        className="absolute inset-0 bg-slate-950/40"
        onClick={() => setOpen(false)}
        type="button"
      />
      <div
        className={cn(
          "absolute inset-y-0 z-10 w-[320px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]",
          side === "left" ? "left-0" : "right-0",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1.5 p-4 text-center sm:text-left", className)} {...props} />
  );
}

function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-950", className)} {...props} />
  );
}

function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
