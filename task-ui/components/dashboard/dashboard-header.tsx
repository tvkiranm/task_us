"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Menu, Search, Bell, ChevronDown, LogOut, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar";
import { clearAuthSession } from "@/lib/auth-storage";

type DashboardHeaderProps = {
  pathname: string;
  currentLabel: string;
  currentDescription: string;
};

function subscribeToStoredUser(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getStoredUserSnapshot() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user");
}

function getServerUserSnapshot() {
  return null;
}

function DashboardHeader({
  pathname,
  currentLabel,
  currentDescription,
}: DashboardHeaderProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const storedUser = useSyncExternalStore(
    subscribeToStoredUser,
    getStoredUserSnapshot,
    getServerUserSnapshot,
  );

  const userName = useMemo(() => {
    try {
      if (!storedUser) return null;
      const user = JSON.parse(storedUser) as { name?: unknown };
      if (user && typeof user.name === "string") return user.name;
    } catch {
      // ignore
    }
    return null;
  }, [storedUser]);

  const initials = useMemo(() => {
    if (!userName) return "AC";
    const parts = userName.split(" ");
    const i = parts
      .map((p) => (typeof p === "string" && p.length > 0 ? p[0] : ""))
      .slice(0, 2)
      .join("");
    return (i || "AC").toUpperCase();
  }, [userName]);

  const signOut = () => {
    clearAuthSession();
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex min-h-[76px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              className="lg:hidden"
              size="icon"
              variant="outline"
              type="button"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[320px] border-r border-slate-200 p-0"
            side="left"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Workspace navigation</SheetTitle>
            </SheetHeader>
            <DashboardSidebar
              onNavigate={() => setMobileSidebarOpen(false)}
              pathname={pathname}
            />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            Mini Jira
          </p>
          <h1 className="truncate text-lg font-semibold text-slate-950">
            {currentLabel}
          </h1>
          <p className="truncate text-sm text-slate-500">
            {currentDescription}
          </p>
        </div>

        <div className="hidden min-w-[260px] max-w-[360px] flex-1 items-center lg:flex">
          <label className="relative flex w-full items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
            <Input
              className="h-11 rounded-full border-slate-200 bg-slate-50 pl-10 pr-20 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              placeholder="Search tasks, projects, people..."
              type="search"
            />
            <span className="pointer-events-none absolute right-3 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500">
              Cmd K
            </span>
          </label>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Button className="hidden md:inline-flex" variant="default">
            + New Task
          </Button>

          <Button size="icon" variant="outline" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="rounded-full px-2 pr-3" variant="outline">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
                  {userName ?? "Ava Chen"}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p className="text-sm font-semibold text-slate-950">Ava Chen</p>
                <p className="mt-1 text-xs font-normal uppercase tracking-[0.18em] text-slate-500">
                  Product lead
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCog className="mr-2 h-4 w-4" />
                Workspace settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notification preferences
              </DropdownMenuItem>
              <button
                onClick={signOut}
                className="flex w-full items-center rounded-2xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export { DashboardHeader };
