"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "./dashboard-data";

type DashboardSidebarProps = {
  pathname?: string;
  onNavigate?: () => void;
  className?: string;
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardSidebar({
  pathname: pathnameProp,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  const pathnameFromHook = usePathname() ?? "/dashboard";
  const pathname = pathnameProp ?? pathnameFromHook;

  return (
    <aside className={cn("flex h-full min-h-screen flex-col bg-white", className)}>
      <div className="flex h-[76px] items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-violet-500/20">
            MJ
          </div>
          <div>
            <p className="text-lg font-semibold leading-5 text-slate-950">
              Mini Jira
            </p>
            <p className="text-sm text-slate-500">Workspace OS</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="px-4 py-6">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
          Workspace
        </p>
        <nav className="mt-5 space-y-1.5">
          {dashboardNavItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                className={cn(
                  "flex h-12 items-center justify-between rounded-2xl px-3.5 text-sm font-semibold transition",
                  active
                    ? "bg-white text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.12)] ring-1 ring-slate-100"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
                href={item.href}
                key={item.href}
                onClick={onNavigate}
              >
                <span>{item.label}</span>
                {item.count ? (
                  <Badge
                    className={cn(
                      active
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-100 text-slate-700",
                    )}
                    variant="secondary"
                  >
                    {item.count}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <div className="rounded-2xl bg-slate-950 px-4 py-4 text-white shadow-[0_20px_60px_rgba(15,23,42,0.2)]">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold">Ava Chen</p>
              <p className="text-sm text-slate-300">ava@stellar.io</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export { DashboardSidebar };
