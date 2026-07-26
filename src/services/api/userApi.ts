import { baseApi } from "./baseApi";
import type { User } from "../../types/admin/admin.types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
