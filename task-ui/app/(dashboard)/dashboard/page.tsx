import {
  dashboardOverviewPanels,
  dashboardOverviewStats,
} from "@/components/dashboard/dashboard-data";
import { Badge } from "@/components/ui/badge";

const activityItems = [
  "Workspace routes are mounted under the shared dashboard layout.",
  "Projects and tasks now reuse the same sidebar and header.",
  "The dashboard overview is ready for API data when the backend is connected.",
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">Monday, June 15</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Good morning, Ava
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Review project health, open work, and workspace activity from one
            dashboard route.
          </p>
        </div>

        <Badge className="self-start bg-emerald-50 text-emerald-700" variant="secondary">
          All systems operational
        </Badge>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {dashboardOverviewStats.map((card) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            key={card.label}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </div>
              <div
                className={[
                  "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br",
                  card.tone,
                ].join(" ")}
              >
                <span className="text-[11px] font-semibold tracking-[0.12em] text-slate-700">
                  {card.icon}
                </span>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-600">
                {card.delta}
              </span>{" "}
              vs. last week
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Dashboard
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                Workspace overview and project health
              </h3>
            </div>
            <Badge variant="outline">Live route</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardOverviewPanels.map((item) => (
              <div
                className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/80"
                key={item.title}
              >
                <p className="text-sm font-semibold text-slate-950">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Activity
          </p>
          <div className="mt-5 space-y-3">
            {activityItems.map((item) => (
              <div className="rounded-2xl bg-slate-50 p-4" key={item}>
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
