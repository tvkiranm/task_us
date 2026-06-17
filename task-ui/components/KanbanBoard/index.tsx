"use client";
import React, { useState } from "react";
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
  // Initial Hardcoded Data Dummy Structure Mocking
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      name: "Update the date of the PM",
      description: "Sync with Amit regarding compliance dates",
      status: "TODO",
      assignee: "KK",
      progress: 20,
      dueDate: "12/10/2026",
    },
    {
      id: "task-2",
      name: "Refactor Auth Matrix Security",
      description: "Implement safe fallbacks for JWT strings",
      status: "IN_PROGRESS",
      assignee: "AS",
      progress: 60,
      dueDate: "18/10/2026",
    },
    {
      id: "task-3",
      name: "Setup Prisma 7 Driver Adapters",
      description: "Verify operational metrics with local postgreSQL",
      status: "DONE",
      assignee: "Erico",
      progress: 100,
      dueDate: "15/10/2026",
    },
  ]);

  // Drag overlay active item id
  const [activeId, setActiveId] = useState<string | null>(null);

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
          <Button variant="default">Add Task</Button>
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
