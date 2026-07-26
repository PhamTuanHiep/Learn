export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  taskId: number;
  title: string;
  description?: string;
  note?: string;
  priority?: TaskPriority;
  dueDate?: string; // ISO date string "YYYY-MM-DD"
  status?: TaskStatus;
  assignedUserIds?: number[];
};
export type User = {
  userId: number;
  name: string;
  age: number;
};

export type BaseStyle = {
  fontSize: string;
  color: string;
};
export type AdminForm = {
  tasks: Task[];
  users: User[];
  defaultBackgroundColor: string;
  baseStyle: BaseStyle;
};
