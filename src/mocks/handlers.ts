import { http, HttpResponse } from "msw";
import { db, getNextTaskId } from "./db";
import type { Task } from "../types/admin/admin.types";

export const handlers = [
  http.get("/api/tasks", () => HttpResponse.json(db.tasks)),

  http.get("/api/tasks/:id", ({ params }) => {
    const task = db.tasks.find((t) => t.taskId === Number(params.id));
    if (!task) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(task);
  }),

  http.post("/api/tasks", async ({ request }) => {
    const body = (await request.json()) as Omit<Task, "taskId">;
    const newTask: Task = { taskId: getNextTaskId(), ...body };
    db.tasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put("/api/tasks/:id", async ({ params, request }) => {
    const idx = db.tasks.findIndex((t) => t.taskId === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as Partial<Task>;
    db.tasks[idx] = { ...db.tasks[idx], ...body };
    return HttpResponse.json(db.tasks[idx]);
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const idx = db.tasks.findIndex((t) => t.taskId === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    db.tasks.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/users", () => HttpResponse.json(db.users)),
];
