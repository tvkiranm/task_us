import { getDashboardSectionConfig } from "@/components/dashboard/dashboard-data";
import { Badge } from "@/components/ui/badge";
import ProjectsGrid from "@/components/dashboard/ProjectsGrid";

type DashboardSectionPageProps = {
  section: string;
};

export function DashboardSectionPage({ section }: DashboardSectionPageProps) {
  const config = getDashboardSectionConfig(section);

  if (!config) {
    return null;
  }

  return (
    <div className="space-y-6">
      {section === "projects" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/** Sample projects - replace with API data when available */}
          {[
            {
              title: "Revive",
              tags: ["node", "react", "react-native"],
              date: null,
              tasks: 124,
              owner: "KK",
              color: "border-sky-500",
            },
            {
              title: "Fincaro - Fintech",
              tags: ["laravel", "react"],
              date: "23/03/2026 → 08/06/2026",
              tasks: 15,
              owner: "AS",
              color: "border-sky-500",
            },
            {
              title: "NICU SmartFlow",
              tags: ["healthcare", "node", "react"],
              date: null,
              tasks: 3,
              owner: "ER",
              color: "border-sky-500",
            },
            {
              title: "Neiro (Dating App)",
              tags: ["datting-app", "flutter", "node"],
              date: "23/03/2026 → 30/06/2026",
              tasks: 8,
              owner: "DK",
              color: "border-red-500",
            },
            {
              title: "Techvoot Internal",
              tags: ["internal"],
              date: null,
              tasks: 15,
              owner: "KK",
              color: "border-sky-500",
            },
            {
              title: "sara-app",
              tags: [],
              date: null,
              tasks: 6,
              owner: "D",
              color: "border-emerald-500",
            },
            {
              title: "VFNER",
              tags: [],
              date: null,
              tasks: 42,
              owner: "D",
              color: "border-emerald-500",
            },
          ].map((p) => (
            <article
              key={p.title}
              className={`relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${p.color}`}
              />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="text-amber-400">☆</span>
                    {p.title}
                  </h3>

                  {section === "projects" ? (
                    <ProjectsGrid />
                  ) : (
                      <span
