import { baseApi } from "./baseApi";
import type { Task } from "../../types/admin/admin.types";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], void>({
      query: () => "/tasks",
      providesTags: (result) =>
        result
          ? [...result.map(({ taskId }) => ({ type: "Task" as const, id: taskId })), { type: "Task", id: "LIST" }]
          : [{ type: "Task", id: "LIST" }],
    }),
    getTaskById: build.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Task", id }],
    }),
    createTask: build.mutation<Task, Omit<Task, "taskId">>({
      query: (body) => ({ url: "/tasks", method: "POST", body }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: build.mutation<Task, Task>({
      query: (body) => ({ url: `/tasks/${body.taskId}`, method: "PUT", body }),
      invalidatesTags: (_result, _err, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "Task", id: "LIST" },
      ],
    }),
    deleteTask: build.mutation<void, number>({
      query: (id) => ({ url: `/tasks/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
