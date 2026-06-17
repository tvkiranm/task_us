export type DashboardNavItem = {
  label: string;
  href: string;
  count?: string | null;
};

export type DashboardSectionConfig = {
  title: string;
  eyebrow: string;
  description: string;
  summaryBadges: string[];
  cards: Array<{
    title: string;
    text: string;
  }>;
  notes: string[];
};

export const dashboardNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/projects", count: "12" },
  { label: "Tasks", href: "/tasks", count: "34" },
  { label: "Teams", href: "/teams" },
  { label: "Calendar", href: "/calendar" },
  { label: "Notifications", href: "/notifications", count: "5" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export const dashboardOverviewStats = [
  {
    label: "Total Projects",
    value: "24",
    delta: "+12.4%",
    tone: "from-violet-200 to-fuchsia-100",
    icon: "PR",
  },
  {
    label: "Open Tickets",
    value: "482",
    delta: "+8.1%",
    tone: "from-sky-200 to-cyan-100",
    icon: "TK",
  },
  {
    label: "Completed",
    value: "318",
    delta: "+5.2%",
    tone: "from-emerald-200 to-teal-100",
    icon: "OK",
  },
  {
    label: "Pending",
    value: "164",
    delta: "-3.6%",
    tone: "from-amber-200 to-orange-100",
    icon: "PD",
  },
];

export const dashboardOverviewPanels = [
  {
    title: "Task board",
    text: "Use this area for board summaries, sprint health, or a preview of the active project.",
  },
  {
    title: "Notifications",
    text: "Keep updates, comments, or team activity in a right-side activity column.",
  },
  {
    title: "Shortcuts",
    text: "Pin the most common project actions here so the shell stays efficient.",
  },
];

const sectionConfigs: Record<string, DashboardSectionConfig> = {
  projects: {
    title: "Projects",
    eyebrow: "Workspace",
    description:
      "Track launches, milestones, and the active project list from a single route.",
    summaryBadges: ["12 active", "4 archived", "2 at risk"],
    cards: [
      {
        title: "Active launches",
        text: "Keep release plans and ownership visible for every project.",
      },
      {
        title: "Ownership",
        text: "Identify who is responsible and where the bottleneck sits.",
      },
      {
        title: "Timeline",
        text: "See delivery windows and upcoming checkpoints at a glance.",
      },
    ],
    notes: [
      "Open a project to inspect the associated dashboard context.",
      "Reuse the shell routes for all nested workspace pages.",
      "Keep route names aligned with sidebar links.",
    ],
  },
  tasks: {
    title: "Tasks",
    eyebrow: "Execution",
    description:
      "View work items, priorities, and progress without leaving the dashboard shell.",
    summaryBadges: ["34 total", "7 urgent", "18 in progress"],
    cards: [
      {
        title: "Backlog",
        text: "Capture incoming work and sort it by priority.",
      },
      {
        title: "In progress",
        text: "Show the active work stream and the assignee.",
      },
      {
        title: "Done",
        text: "Keep the completed items visible for traceability.",
      },
    ],
    notes: [
      "Tasks should inherit the same layout language as the overview.",
      "The shell should stay identical across all subroutes.",
      "Reuse the common header rather than rebuilding it in each page.",
    ],
  },
  teams: {
    title: "Teams",
    eyebrow: "Collaboration",
    description:
      "See who is on the workspace, who owns what, and where to route updates.",
    summaryBadges: ["8 members", "3 squads", "1 shared calendar"],
    cards: [
      {
        title: "Owners",
        text: "Highlight the people who make decisions and unblock work.",
      },
      {
        title: "Squads",
        text: "Group people by product area or delivery stream.",
      },
      {
        title: "Capacity",
        text: "Expose who is available before assigning new work.",
      },
    ],
    notes: [
      "Teams can share the same shell and profile menu.",
      "Keep the current route highlighted in the sidebar.",
      "Use consistent badge counts for route metadata.",
    ],
  },
  calendar: {
    title: "Calendar",
    eyebrow: "Planning",
    description:
      "Plan milestones, demos, and release checkpoints from one calendar route.",
    summaryBadges: ["5 milestones", "2 demos", "1 release"],
    cards: [
      {
        title: "Upcoming demos",
        text: "Make review events easy to scan and act on.",
      },
      {
        title: "Releases",
        text: "Map deadlines to the project route and delivery plan.",
      },
      {
        title: "Planning windows",
        text: "Reserve time for sprint planning and retro work.",
      },
    ],
    notes: [
      "The calendar route should feel like part of the same workspace.",
      "Use the shared shell to keep navigation in one place.",
      "Routes should remain predictable and easy to bookmark.",
    ],
  },
  notifications: {
    title: "Notifications",
    eyebrow: "Activity",
    description:
      "Review comments, mentions, and system events from the same workspace shell.",
    summaryBadges: ["5 unread", "2 mentions", "1 system alert"],
    cards: [
      {
        title: "Mentions",
        text: "Keep tagged updates visible without leaving the dashboard.",
      },
      {
        title: "System alerts",
        text: "Surface downtime or automation events clearly.",
      },
      {
        title: "Comment threads",
        text: "Group replies and follow-ups under the same route.",
      },
    ],
    notes: [
      "Make unread counts clear in the sidebar.",
      "Keep the profile menu and notification controls in the shared header.",
      "The route should stay accessible from both desktop and mobile.",
    ],
  },
  reports: {
    title: "Reports",
    eyebrow: "Insights",
    description:
      "Monitor productivity, delivery health, and project performance from one place.",
    summaryBadges: ["24 projects", "82% on track", "3 trends"],
    cards: [
      {
        title: "Weekly trend",
        text: "Summarize the current delivery signal in a clean snapshot.",
      },
      {
        title: "Bottlenecks",
        text: "Show where the team needs help or review time.",
      },
      {
        title: "Performance",
        text: "Track cycle times and delivery rhythm over time.",
      },
    ],
    notes: [
      "Reports should live behind the same shell for consistency.",
      "Reuse the common layout and route structure.",
      "Keep the overview page distinct from detailed report routes.",
    ],
  },
  settings: {
    title: "Settings",
    eyebrow: "Workspace",
    description:
      "Manage workspace preferences, members, and navigation defaults.",
    summaryBadges: ["Workspace", "Members", "Preferences"],
    cards: [
      {
        title: "Profile",
        text: "Adjust the current user and workspace identity.",
      },
      {
        title: "Access",
        text: "Control roles, invites, and visibility.",
      },
      {
        title: "Appearance",
        text: "Keep theme and layout decisions in one place.",
      },
    ],
    notes: [
      "Settings should remain a proper route, not a modal.",
      "The shared header and sidebar should not be duplicated here.",
      "Route changes should keep the shell mounted.",
    ],
  },
};

export function getDashboardSectionConfig(section: string) {
  return sectionConfigs[section] ?? null;
}
