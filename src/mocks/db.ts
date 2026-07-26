import type { Task, User } from "../types/admin/admin.types";

export const db: { tasks: Task[]; users: User[] } = {
  tasks: [
    { taskId: 1, title: "test layout mui", description: "try all layout mui: stack, box, grid v2", priority: "high", dueDate: "2026-07-01", status: "doing", assignedUserIds: [1] },
    { taskId: 2, title: "test divider mui", description: "try divider in Stack or component", priority: "low", dueDate: "2026-07-05", status: "todo", assignedUserIds: [] },
    { taskId: 3, title: "test Stack mui", description: "try Stack mui", priority: "medium", status: "done", assignedUserIds: [2, 3] },
    { taskId: 4, title: "test Box mui", description: "try all Box mui", priority: "medium", status: "todo" },
    { taskId: 5, title: "test Grid v2 mui", description: "try all Grid v2", priority: "high", status: "todo" },
    { taskId: 6, title: "test Grid Css mui", description: "try all Grid css", priority: "low", status: "todo" },
  ],
  users: [
    { userId: 1, name: "Alice", age: 28 },
    { userId: 2, name: "Bob", age: 32 },
    { userId: 3, name: "Charlie", age: 25 },
  ],
};

let nextTaskId = db.tasks.length + 1;
export const getNextTaskId = () => nextTaskId++;
