"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

type TriggerChildProps = {
  onClick?: React.MouseEventHandler<Element>;
  "aria-expanded"?: boolean;
};

const DropdownMenuContext = React.createContext<DropdownContextValue | null>(
  null,
);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
}

function DropdownMenu({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, rootRef }}>
      <div className="relative inline-flex" ref={rootRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({
  children,
}: Readonly<{
  asChild?: boolean;
  children: React.ReactElement<TriggerChildProps>;
}>) {
  const { open, setOpen } = useDropdownMenu();
  return React.cloneElement(children, {
    "aria-expanded": open,
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      setOpen(!open);
    },
  });
}

function DropdownMenuContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useDropdownMenu();

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.14)]",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-2 h-px bg-slate-200", className)} {...props} />;
}

function DropdownMenuItem({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDropdownMenu();

  return (
    <button
      className={cn(
        "flex w-full items-center rounded-2xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950",
        className,
      )}
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
