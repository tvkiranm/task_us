"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  DragDropProvider,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import { MessageSquare, MoreHorizontal, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

// 1. Types Definitions
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  progress: number;
  dueDate: string;
}

// 2. Draggable Task Card Component
function DraggableTaskCard({ task }: { task: Task }) {
  const { ref } = useDraggable({ id: task.id });

  // Priority color dynamically assigned based on progress/status
  const badgeColor =
    task.status === "DONE"
      ? "bg-emerald-500"
      : task.status === "IN_PROGRESS"
        ? "bg-blue-500"
        : "bg-amber-500";

  return (
    <article
      ref={ref}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm cursor-grab active:cursor-grabbing mb-3 transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge
          className="bg-slate-800 text-slate-300 border-none capitalize flex items-center"
          variant="secondary"
        >
          <span className={`mr-1.5 h-2 w-2 rounded-full ${badgeColor}`} />
          {task.status.toLowerCase().replace("_", " ")}
        </Badge>
        <Button
          aria-label="Task actions"
          className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-800"
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-900">
        {task.name}
      </h3>
      <p className="mt-1 text-xs text-slate-500">{task.description}</p>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${task.status === "DONE" ? "bg-emerald-500" : "bg-blue-500"}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex -space-x-2">
          <Avatar className="h-7 w-7 border-2 border-slate-100">
            <AvatarFallback className="bg-slate-200 text-[10px] font-bold text-slate-700">
              {task.assignee.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {task.assignee}
          </span>
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3 w-3" />
          </span>
          <span className="ml-1 text-slate-500">{task.dueDate}</span>
        </div>
      </div>
    </article>
  );
}

// 3. Droppable Column Component
function StatusColumn({
  id,
  title,
  children,
}: {
  id: TaskStatus;
  title: string;
  children?: React.ReactNode;
}) {
  const { ref, isDropTarget } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={`flex flex-col flex-1 min-w-[280px] p-4 rounded-2xl border transition-all duration-200 bg-white ${
        isDropTarget ? "border-blue-200 shadow-md" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          {title}
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs">
            {React.Children.count(children)}
          </span>
        </h2>
      </div>

      {/* Column Inner Body Layout */}
      <div className="flex-1 overflow-y-auto min-h-[450px]">{children}</div>
    </div>
  );
}

// 4. Main Kanban App Context Handler
export default function KanbanBoard() {
  // Tasks loaded from backend (supports optional project filter via query param)
  const [tasks, setTasks] = useState<Task[]>([]);
  const searchParams = useSearchParams();
  const projectIdParam = searchParams?.get("projectId");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const params: any = {};
        if (projectIdParam) params.projectId = projectIdParam;
        const res = await api.get("/tasks", { params });
        if (!mounted) return;
        const items = res.data?.data ?? [];
        const mapped: Task[] = items.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          description: t.description,
          status: t.status as TaskStatus,
          assignee: t.assignee ?? "Unassigned",
          progress: 0,
          dueDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
        }));
        setTasks(mapped);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [projectIdParam]);

  // Drag overlay active item id
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // load projects for dropdown when drawer opens
  React.useEffect(() => {
    if (!drawerOpen) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/projects");
        if (!mounted) return;
        setProjects(res.data?.data ?? []);
        if ((res.data?.data ?? []).length > 0) setTaskProjectId((res.data.data[0].id as number) ?? null);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [drawerOpen]);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active?.id || event?.operation?.source?.id;
    if (id) setActiveId(id as string);
  };

  const handleDragCancel = () => setActiveId(null);

  // Handle Drag Over End Pipeline
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const taskId = event.operation.source?.id; // Jo card drag hua uski ID
    const targetColumnId = event.operation.target?.id as TaskStatus; // Jahaan drop kiya (TODO, IN_PROGRESS, DONE)

    if (!targetColumnId || !taskId) return;

    // Status mapping trigger state updates inside UI layer
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          // Progress bar adjustment dynamically depending on status dropped
          let newProgress = task.progress;
          if (targetColumnId === "DONE") newProgress = 100;
          if (targetColumnId === "TODO" && task.progress === 100)
            newProgress = 0;

          const updatedTask = {
            ...task,
            status: targetColumnId,
            progress: newProgress,
          };

          // 🔥 API INTEGRATION TRIGGER HOOK
          // Idhar se tum direct backend ko update request maar sakte ho:
          // axios.put(`/api/tasks/${taskId}`, { status: targetColumnId });
          console.log(`🚀 Task ${taskId} migrated to ${targetColumnId}`);

          return updatedTask;
        }
        return task;
      }),
    );
  };

  return (
    <DragDropProvider
      onDragEnd={(e) => {
        handleDragEnd(e);
        handleDragCancel();
      }}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      <header className="flex items-center justify-between w-full p-4 bg-transparent">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500">
            Manage your tasks with drag & drop across workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger>
              <Button variant="default">Add Task</Button>
            </DrawerTrigger>

            <DrawerContent side="right" className="p-0">
              <div className="border-b px-6 py-4">
                <DrawerTitle>Create Task</DrawerTitle>
                <DrawerDescription>Add a new task to a project.</DrawerDescription>
              </div>

              <form
                className="p-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!taskName || !taskProjectId) return;
                  setCreating(true);
                  try {
                    const res = await api.post("/tasks", {
                      name: taskName,
                      description: taskDescription,
                      status: "TODO",
                      projectId: taskProjectId,
                    });
                    const created = res.data?.data;
                    // Map to UI Task type
                    const newTask: Task = {
                      id: String(created.id),
                      name: created.name,
                      description: created.description,
                      status: created.status as TaskStatus,
                      assignee: "You",
                      progress: 0,
                      dueDate: new Date().toLocaleDateString(),
                    };
                    setTasks((prev) => [newTask, ...prev]);
                    setTaskName("");
                    setTaskDescription("");
                    setDrawerOpen(false);
                  } catch (err) {
                    console.error("Failed to create task", err);
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Project</label>
                  <select
                    className="mt-1 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                    value={taskProjectId ?? undefined}
                    onChange={(ev) => setTaskProjectId(parseInt((ev.target as HTMLSelectElement).value, 10))}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                  <Input value={taskName} onChange={(e) => setTaskName((e.target as HTMLInputElement).value)} required />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                  <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="mt-1 w-full min-h-[96px] rounded border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>

                <DrawerFooter>
                  <div className="flex items-center justify-end gap-3">
                    <DrawerClose className="text-sm text-slate-600">Cancel</DrawerClose>
                    <Button type="submit" variant="default">{creating ? "Creating..." : "Create task"}</Button>
                  </div>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      <section className="flex flex-wrap gap-5 w-full p-4 items-start select-none">
        <StatusColumn id="TODO" title="To Do">
          {tasks
            .filter((t) => t.status === "TODO")
            .map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
        </StatusColumn>

        <StatusColumn id="IN_PROGRESS" title="In Progress">
          {tasks
            .filter((t) => t.status === "IN_PROGRESS")
            .map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
        </StatusColumn>

        <StatusColumn id="DONE" title="Done">
          {tasks
            .filter((t) => t.status === "DONE")
            .map((task) => (
              <DraggableTaskCard key={task.id} task={task} />
            ))}
        </StatusColumn>
      </section>
      <DragOverlay>
        {activeId
          ? (() => {
              const t = tasks.find((x) => x.id === activeId);
              return t ? <DraggableTaskCard task={t} /> : null;
            })()
          : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
