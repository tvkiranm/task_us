"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { dashboardNavItems } from "./dashboard-data";

type DashboardShellProps = {
  children: React.ReactNode;
};

function getCurrentNavItem(pathname: string) {
  const navItem =
    dashboardNavItems.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? dashboardNavItems[0];

  return navItem;
}

function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname() ?? "/dashboard";
  const currentNav = getCurrentNavItem(pathname);

  const currentLabel =
    pathname === "/dashboard" ? "Workspace dashboard" : currentNav.label;

  const currentDescription =
    pathname === "/dashboard"
      ? "Overview, shortcuts, and workspace health in one place."
      : `Route ${currentNav.href}`;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8faff_0%,#eef3fb_42%,#e7edf7_100%)] text-slate-950">
      <div className="mx-auto grid min-h-screen lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-200 bg-white/75 backdrop-blur-xl lg:block">
          <DashboardSidebar pathname={pathname} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            currentDescription={currentDescription}
            currentLabel={currentLabel}
            pathname={pathname}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export { DashboardShell };
