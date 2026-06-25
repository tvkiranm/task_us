"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, momentLocalizer, View, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

const localizer = momentLocalizer(moment);

type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "TESTING" | "DONE";

type StatusFilter = TaskStatus | "ALL";

const statusFilters: Array<{
  value: StatusFilter;
  label: string;
  colorClass: string;
}> = [
  { value: "ALL", label: "All", colorClass: "bg-slate-500" },
  { value: "TODO", label: "To Do", colorClass: "bg-amber-500" },
  { value: "IN_PROGRESS", label: "In Progress", colorClass: "bg-blue-500" },
  { value: "REVIEW", label: "Review", colorClass: "bg-violet-500" },
  { value: "TESTING", label: "Testing", colorClass: "bg-cyan-500" },
  { value: "DONE", label: "Done", colorClass: "bg-emerald-500" },
];

interface Task {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  projectId: number;
  project?: {
    id: number;
    name: string;
  };
}

interface CalendarEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Array<{ id: number; name: string }>>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Drawer form state
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // Load tasks
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/tasks", {
          params: statusFilter === "ALL" ? undefined : { status: statusFilter },
        });
        if (!mounted) return;
        setTasks(res.data?.data ?? []);
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  // Load projects when create drawer opens
  useEffect(() => {
    if (!createDrawerOpen) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/projects");
        if (!mounted) return;
        setProjects(res.data?.data ?? []);
        if ((res.data?.data ?? []).length > 0) {
          setTaskProjectId(res.data.data[0].id ?? null);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [createDrawerOpen]);

  // Convert tasks to calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    return tasks.map((task) => {
      const startDate = task.dueDate
        ? new Date(task.dueDate)
        : new Date(task.createdAt);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // 1 hour duration

      return {
        id: task.id,
        title: task.name,
        start: startDate,
        end: endDate,
        resource: task,
      };
    });
  }, [tasks]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  }, []);

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      setTaskDueDate(moment(slotInfo.start).format("YYYY-MM-DD"));
      setCreateDrawerOpen(true);
    },
    [],
  );

  // Custom event styling based on task status
  const eventStyleGetter = (event: CalendarEvent) => {
    const task = event.resource;
    let backgroundColor = "#64748b"; // Default slate
    let borderColor = "#475569";

    switch (task.status) {
      case "TODO":
        backgroundColor = "#f59e0b";
        borderColor = "#d97706";
        break;
      case "IN_PROGRESS":
        backgroundColor = "#3b82f6";
        borderColor = "#2563eb";
        break;
      case "REVIEW":
        backgroundColor = "#8b5cf6";
        borderColor = "#7c3aed";
        break;
      case "TESTING":
        backgroundColor = "#06b6d4";
        borderColor = "#0891b2";
        break;
      case "DONE":
        backgroundColor = "#10b981";
        borderColor = "#059669";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderLeft: `4px solid ${borderColor}`,
        color: "white",
        borderRadius: "8px",
        padding: "4px 8px",
        fontSize: "13px",
        fontWeight: "500",
      },
    };
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !taskProjectId) return;
    setCreating(true);
    try {
      const res = await api.post("/tasks", {
        name: taskName,
        description: taskDescription,
        status: "TODO",
        projectId: taskProjectId,
        dueDate: taskDueDate || undefined,
      });
      const created = res.data?.data;
      setTasks((prev) => [...prev, created]);
      setTaskName("");
      setTaskDescription("");
      setTaskDueDate("");
      setCreateDrawerOpen(false);
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
        </div>
        <div className="flex items-center gap-3">
          <Drawer open={createDrawerOpen} onOpenChange={setCreateDrawerOpen}>
            <DrawerTrigger>
              <Button variant="default">+ New Task</Button>
            </DrawerTrigger>

            <DrawerContent side="right" className="w-[420px] p-0">
              <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-5">
                <DrawerTitle className="text-xl">Create Task</DrawerTitle>
                <DrawerDescription className="mt-1">
                  Add a new task to your project calendar.
                </DrawerDescription>
              </div>

              <form
                className="flex h-[calc(100vh-88px)] flex-col"
                onSubmit={handleCreateTask}
              >
                <div className="flex-1 space-y-5 overflow-y-auto p-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Project
                    </label>
                    <select
                      className="h-11 w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.75rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                      value={taskProjectId ?? undefined}
                      onChange={(ev) =>
                        setTaskProjectId(
                          parseInt((ev.target as HTMLSelectElement).value, 10),
                        )
                      }
                      required
                    >
                      {projects.length === 0 && (
                        <option disabled>No projects available</option>
                      )}
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Task Title <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={taskName}
                      onChange={(e) =>
                        setTaskName((e.target as HTMLInputElement).value)
                      }
                      placeholder="e.g., Design homepage mockup"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) =>
                        setTaskDueDate((e.target as HTMLInputElement).value)
                      }
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      Optional: Set a due date for this task
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      Description
                    </label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Add more details about this task..."
                      className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
                      rows={5}
                    />
                  </div>
                </div>

                <DrawerFooter className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setCreateDrawerOpen(false);
                        setTaskName("");
                        setTaskDescription("");
                        setTaskDueDate("");
                      }}
                      disabled={creating}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={creating || !taskName || !taskProjectId}
                    >
                      {creating ? "Creating..." : "Create Task"}
                    </Button>
                  </div>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <span className="mr-2 text-sm font-medium text-slate-700">
          Status:
        </span>
        {statusFilters.map((filter) => {
          const active = statusFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              aria-pressed={active}
              className={[
                "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition",
                active
                  ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${filter.colorClass}`} />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          views={["month", "week", "day", "agenda"]}
          popup
        />
      </div>

      {/* Event Details Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent side="right" className="w-[420px] p-0">
          {selectedEvent && (
            <>
              <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-5">
                <DrawerTitle className="text-xl">Task Details</DrawerTitle>
                <DrawerDescription className="mt-1">
                  View task information and status
                </DrawerDescription>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {selectedEvent.resource.name}
                  </h3>
                  {selectedEvent.resource.description && (
                    <p className="mt-2 text-sm text-slate-600">
                      {selectedEvent.resource.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">
                      Status
                    </span>
                    <Badge
                      className={
                        selectedEvent.resource.status === "DONE"
                          ? "bg-emerald-500"
                          : selectedEvent.resource.status === "TESTING"
                            ? "bg-cyan-500"
                            : selectedEvent.resource.status === "REVIEW"
                              ? "bg-violet-500"
                          : selectedEvent.resource.status === "IN_PROGRESS"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }
                    >
                      {selectedEvent.resource.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">
                      Project
                    </span>
                    <span className="text-sm text-slate-900">
                      {selectedEvent.resource.project?.name ?? "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-700">
                      Created
                    </span>
                    <span className="text-sm text-slate-900">
                      {moment(selectedEvent.resource.createdAt).format(
                        "MMM D, YYYY",
                      )}
                    </span>
                  </div>

                  {selectedEvent.resource.dueDate && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">
                        Due Date
                      </span>
                      <span className="text-sm text-slate-900">
                        {moment(selectedEvent.resource.dueDate).format(
                          "MMM D, YYYY",
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <DrawerFooter className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDrawerOpen(false)}
                >
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
