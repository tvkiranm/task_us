"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DrawerContextValue = { open: boolean; setOpen: (open: boolean) => void };

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) throw new Error("Drawer components must be used within Drawer");
  return context;
}

function Drawer({
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
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setOpen]);

  return (
    <DrawerContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<Element>;
  "aria-expanded"?: boolean;
};
function DrawerTrigger({
  children,
}: Readonly<{ children: React.ReactElement<TriggerChildProps> }>) {
  const { open, setOpen } = useDrawer();
  return React.cloneElement(children, {
    "aria-expanded": open,
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      setOpen(true);
    },
  });
}

function DrawerContent({
  side = "left",
  className,
  children,
}: Readonly<{
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}>) {
  const { open, setOpen } = useDrawer();
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close drawer"
        className="absolute inset-0 bg-slate-950/40"
        onClick={() => setOpen(false)}
        type="button"
      />
      <div
        className={cn(
          "absolute inset-y-0 z-10 w-[360px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]",
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

function DrawerHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-4", props.className)} {...props} />;
}

function DrawerTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-slate-950", props.className)}
      {...props}
    />
  );
}

function DrawerDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500", props.className)} {...props} />
  );
}

function DrawerFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", props.className)} {...props} />;
}

function DrawerClose({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDrawer();
  return (
    <button
      {...props}
      type="button"
      onClick={(e) => {
        props.onClick?.(e as any);
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
};
