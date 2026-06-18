"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  status: string;
  _count?: { tasks: number };
};

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/projects");
        if (!cancelled) setProjects(res.data?.data ?? []);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="text-sm text-slate-500">Loading projects…</div>;
  if (error) return <div className="text-sm text-rose-600">{error}</div>;
  if (!projects || projects.length === 0)
    return <div className="text-sm text-slate-500">No projects found</div>;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <article
          key={p.id}
          className={`relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}
        >
          <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${p.status === "PLANNING" ? "border-sky-500 bg-sky-500" : "border-emerald-500 bg-emerald-500"}`} />

          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="text-amber-400">☆</span>
                {p.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">{p.description}</p>

              <div className="mt-3 text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex items-start gap-2">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{p._count?.tasks ?? 0}</span>
              <span className="ml-2 text-xs text-slate-500">Tasks</span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 border-2 border-white">
                <AvatarFallback className="bg-gradient-to-br from-fuchsia-500 to-violet-500 text-white">
                  {String(p.name).substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
