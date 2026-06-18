"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
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

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newName) return setError("Project name is required");
    try {
      const res = await api.post("/projects", {
        name: newName,
        description: newDescription,
      });
      const created = res.data?.data;
      setProjects((prev) => (prev ? [created, ...prev] : [created]));
      setNewName("");
      setNewDescription("");
      setDrawerOpen(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to create project",
      );
    }
  }

  if (loading)
    return <div className="text-sm text-slate-500">Loading projects…</div>;
  if (error) return <div className="text-sm text-rose-600">{error}</div>;
  if (!projects || projects.length === 0)
    return <div className="text-sm text-slate-500">No projects found</div>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger>
            <Button variant="default">+ New Project</Button>
          </DrawerTrigger>

          <DrawerContent side="right" className="p-0">
            <div className="border-b px-6 py-4">
              <DrawerTitle>Create project</DrawerTitle>
              <DrawerDescription>
                Start a new project and invite your team.
              </DrawerDescription>
            </div>

            <form className="p-6 space-y-4" onSubmit={createProject}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <Input
                  value={newName}
                  onChange={(e) =>
                    setNewName((e.target as HTMLInputElement).value)
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 w-full min-h-[96px] rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <DrawerFooter>
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Create project
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.id}
            role="button"
            onClick={() => router.push(`/tasks?projectId=${p.id}`)}
            className={`relative cursor-pointer hover:shadow-md flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${p.status === "PLANNING" ? "border-sky-500 bg-sky-500" : "border-emerald-500 bg-emerald-500"}`}
            />

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <span className="text-amber-400">☆</span>
                  {p.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600">{p.description}</p>

                <div className="mt-3 text-xs text-slate-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {p._count?.tasks ?? 0}
                </span>
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
    </div>
  );
}
