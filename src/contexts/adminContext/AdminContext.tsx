/* eslint-disable react-refresh/only-export-components -- context file exports hook + provider together, standard pattern */
import { createContext, useContext, useReducer } from "react";
import type { Dispatch } from "react";
import type { TaskPriority, TaskStatus } from "../../types/admin/admin.types";

// --- State shape ---
export interface TaskDraft {
  info: { title: string; description: string; note: string };
  schedule: { priority: TaskPriority; dueDate: string; status: TaskStatus };
  assignedUserIds: number[];
}

// --- Actions ---
type Action =
  | { type: "SET_INFO"; payload: Partial<TaskDraft["info"]> }
  | { type: "SET_SCHEDULE"; payload: Partial<TaskDraft["schedule"]> }
  | { type: "TOGGLE_ASSIGN_USER"; payload: number }
  | { type: "RESET"; payload: TaskDraft };

// --- Reducer ---
function taskDraftReducer(state: TaskDraft, action: Action): TaskDraft {
  switch (action.type) {
    case "SET_INFO":
      return { ...state, info: { ...state.info, ...action.payload } };
    case "SET_SCHEDULE":
      return { ...state, schedule: { ...state.schedule, ...action.payload } };
    case "TOGGLE_ASSIGN_USER": {
      const id = action.payload;
      const ids = state.assignedUserIds.includes(id)
        ? state.assignedUserIds.filter((u) => u !== id)
        : [...state.assignedUserIds, id];
      return { ...state, assignedUserIds: ids };
    }
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

// --- Context ---
interface TaskFormContextValue {
  draft: TaskDraft;
  dispatch: Dispatch<Action>;
}

const TaskFormContext = createContext<TaskFormContextValue | null>(null);

export const useTaskForm = () => {
  const ctx = useContext(TaskFormContext);
  if (!ctx) throw new Error("useTaskForm must be used inside TaskFormProvider");
  return ctx;
};

// --- Provider ---
const emptyDraft: TaskDraft = {
  info: { title: "", description: "", note: "" },
  schedule: { priority: "medium", dueDate: "", status: "todo" },
  assignedUserIds: [],
};

interface TaskFormProviderProps {
  children: React.ReactNode;
  initialDraft?: TaskDraft;
}

export const TaskFormProvider = ({ children, initialDraft }: TaskFormProviderProps) => {
  const [draft, dispatch] = useReducer(
    taskDraftReducer,
    initialDraft ?? emptyDraft,
  );
  return (
    <TaskFormContext.Provider value={{ draft, dispatch }}>
      {children}
    </TaskFormContext.Provider>
  );
};

export { TaskFormContext };
