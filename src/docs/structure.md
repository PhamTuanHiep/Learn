# Cấu trúc thư mục dự án

```
src/
├── main.tsx                        # Entry point: Provider store + AppThemeProvider + MSW init
├── App.tsx                         # Router chính: phân quyền theo role (admin/manager/user)
│
├── constants/
│   ├── app.constants.ts            # Route paths (USER_PATH, ADMIN_PATH, MANAGER_PATH, AUTH)
│   └── login.constants.ts          # ROLE enum
│
├── contexts/
│   ├── AuthContext.tsx             # Auth state: isAuthenticated, role, login/logout
│   └── adminContext/
│       └── AdminContext.tsx        # [STUDY] TaskFormProvider + useTaskForm (React Context + useReducer)
│                                   #   → Giữ draft của nested form: info, checklist, assignedUserIds
│
├── features/
│   ├── login/
│   │   └── Login.tsx               # Trang login mock (3 nút: User / Manager / Admin)
│   ├── admin/
│   │   └── AdminScreen.tsx         # Trang chủ role Admin
│   ├── manager/
│   │   ├── ManagerScreen.tsx       # Layout + nested routes cho /manager
│   │   └── managerTaskScreen/
│   │       ├── ManagerTaskScreen.tsx   # [STUDY] Bảng task — dùng RTK Query (useGetTasksQuery)
│   │       │                           #   + nút toggle theme (Redux dispatch toggleMode)
│   │       └── editTask/
│   │           ├── EditTask.tsx        # [STUDY] Form cha — cung cấp TaskFormProvider
│   │           │                       #   + gọi createTask/updateTask mutation (RTK Query)
│   │           └── sections/           # Sub-form con — tất cả đọc/ghi qua useTaskForm()
│   │               ├── TaskInfoSection.tsx     # Field: title, description, note
│   │               ├── ChecklistSection.tsx    # Danh sách subtask (add/remove chip)
│   │               └── AssignUserSection.tsx   # Chọn user (useGetUsersQuery từ RTK Query)
│   ├── users/
│   │   ├── UsersScreen.tsx
│   │   └── userDetail/
│   │       └── UserDetail.tsx
│   └── study-promise/
│       └── StudyPromise.tsx
│
├── mocks/                          # [STUDY] Mock API dùng MSW
│   ├── db.ts                       #   In-memory database (tasks[], users[])
│   ├── handlers.ts                 #   HTTP handlers: GET/POST/PUT/DELETE /api/tasks, GET /api/users
│   └── browser.ts                  #   setupWorker — khởi động Service Worker trong browser
│
├── router/
│   ├── PrivateRoute.tsx            # HOC bảo vệ route theo role + redirect khi chưa login
│   └── AdminLayout.tsx             # Layout sidebar cho /admin
│
├── services/api/                   # [STUDY] RTK Query
│   ├── baseApi.ts                  #   createApi — khai báo baseUrl + tagTypes
│   ├── taskApi.ts                  #   Endpoints: getTasks, getTaskById, createTask, updateTask, deleteTask
│   └── userApi.ts                  #   Endpoints: getUsers
│
├── store/                          # [STUDY] Redux Toolkit
│   ├── index.ts                    #   configureStore: themeReducer + baseApi
│   ├── hooks.ts                    #   useAppDispatch, useAppSelector (typed)
│   └── themeSlice.ts               #   Slice: mode (light/dark), baseStyle, defaultBackgroundColor
│
├── theme/
│   └── AppThemeProvider.tsx        # Đọc Redux themeSlice → dựng MUI ThemeProvider động
│
├── types/
│   ├── admin/
│   │   └── admin.types.ts          # Task, User, BaseStyle
│   └── login.types.ts
│
└── utils/
    └── jwt.utils.ts                # Decode JWT, kiểm tra expiry
```

## Luồng state (tóm tắt 3 tầng đang study)

```
[MSW Service Worker]
      ↕ intercept HTTP
[RTK Query] ──── server state ────→ ManagerTaskScreen (list), AssignUserSection (users)
      ↕ mutation invalidate cache
[RTK Query cache] ─── refetch tự động

[Redux themeSlice] ── global UI ───→ AppThemeProvider (light/dark), ManagerTaskScreen (toggle button)

[TaskFormContext] ─── form state ──→ EditTask (form cha)
      ↕ useReducer dispatch               ├── TaskInfoSection
      ↕ useTaskForm()                     ├── ChecklistSection
                                          └── AssignUserSection
```
