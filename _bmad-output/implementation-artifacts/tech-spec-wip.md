---
title: 'Fix & Refactor React Router v5 Configuration'
slug: 'fix-router-config'
created: '2026-04-28'
status: 'in-progress'
stepsCompleted: [1]
tech_stack:
  - react: '19.2.5'
  - react-router-dom: '5.3.4'
  - typescript: '~6.0.2'
  - vite: '^8.0.10'
files_to_modify:
  - src/main.tsx
  - src/App.tsx
  - src/router/PrivateRoute.tsx
  - src/router/AdminLayout.tsx
  - src/constants/app.constants.ts
  - src/features/users/userDetail/UserDetail.tsx
code_patterns: []
test_patterns: []
---

# Tech-Spec: Fix & Refactor React Router v5 Configuration

**Created:** 2026-04-28

## Overview

### Problem Statement

Router hiện tại có 2 bugs nghiêm trọng và 4 design issues khiến navigation bị broken và behavior không nhất quán:

1. **[BUG]** `main.tsx` và `App.tsx` cùng bọc `BrowserRouter` → nested router, context bị override
2. **[BUG]** `AdminLayout` mount tại `/admin/dashboard` (exact) → `useRouteMatch()` trả về path sai → tất cả link trong sidebar bị broken (`/admin/dashboard/dashboard`, `/admin/dashboard/users`)
3. **[DESIGN]** `exact` prop trên route `AdminLayout` ngăn nested routes hoạt động
4. **[DESIGN]** `USER_PATH.DETAIL = "/users/detail"` không có dynamic param → `UserDetail` không thể nhận ID từ URL
5. **[DESIGN]** `AdminScreen` là route độc lập `/admin` (exact) tách rời khỏi `AdminLayout` → không có sidebar khi vào `/admin`
6. **[DESIGN]** `auth` đọc từ `localStorage` trong render function → không reactive khi login/logout

### Solution

Restructure toàn bộ router theo đúng React Router v5 pattern:
- Xóa `BrowserRouter` thừa trong `App.tsx`, giữ lại ở `main.tsx`
- Mount `AdminLayout` tại `/admin` (không `exact`) làm shell layout, `AdminScreen` là default view bên trong
- Sửa `USER_PATH.DETAIL` thành `/users/:id`, cập nhật `UserDetail` dùng `useParams()`
- Tạo `AuthContext` để quản lý auth state reactive, truyền vào `PrivateRoute` qua Context thay vì props

### Scope

**In Scope:**
- Fix nested BrowserRouter
- Restructure admin routes: AdminLayout tại `/admin`, tích hợp AdminScreen làm default
- Sửa USER_PATH.DETAIL thành dynamic route `/users/:id`
- Cập nhật UserDetail dùng `useParams()` để lấy ID
- Tạo AuthContext cho auth state reactive
- Refactor App.tsx đọc auth từ Context thay vì trực tiếp localStorage

**Out of Scope:**
- Migrate lên React Router v6
- Thay đổi UI/styling
- Thêm trang hoặc tính năng mới
- Backend/API integration

---

## Context for Development

### Codebase Patterns

- Project dùng **React Router v5** với `Switch`, `Route`, `Redirect` (KHÔNG phải v6)
- `PrivateRoute` là wrapper component nhận `component`, `allowedRoles`, `userRole`, `isAuthenticated` làm props — pattern render props của RRv5
- Auth state hiện tại đọc trực tiếp từ `localStorage` trong `App.tsx` mỗi lần render
- Constants path được centralize trong `src/constants/app.constants.ts`
- Role constants trong `src/constants/login.constants.ts`: `ROLE.ADMIN = "admin"`, `ROLE.USER = "user"`
- `AdminLayout` dùng `useRouteMatch()` để lấy `path` và `url` cho nested routes và links

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/main.tsx` | Entry point — nơi BrowserRouter nên tồn tại duy nhất |
| `src/App.tsx` | Route tree chính — cần xóa Router wrapper, cập nhật admin routes |
| `src/router/PrivateRoute.tsx` | Guard component — sẽ đọc auth từ Context |
| `src/router/AdminLayout.tsx` | Shell layout admin — sẽ tích hợp AdminScreen làm default |
| `src/constants/app.constants.ts` | Path constants — sửa DETAIL thành `/users/:id` |
| `src/features/users/userDetail/UserDetail.tsx` | Cần dùng `useParams<{id: string}>()` |

### Technical Decisions

- **AuthContext** sẽ được tạo tại `src/contexts/AuthContext.tsx`, expose `token`, `role`, `login()`, `logout()` functions
- `PrivateRoute` sẽ dùng `useContext(AuthContext)` thay vì nhận `isAuthenticated`/`userRole` qua props → đơn giản hóa `App.tsx`
- `AdminLayout` vẫn giữ pattern `useRouteMatch()` — chỉ cần mount đúng path
- `UserDetail` dùng `useParams<{ id: string }>()` — RRv5 hook

---

## Implementation Plan

### Tasks

> Thứ tự theo dependency (cái nào độc lập làm trước)

**T1 — Tạo AuthContext**
- File: `src/contexts/AuthContext.tsx` (file mới)
- Tạo context với `token: string | null`, `role: string | null`, `login(token, role): void`, `logout(): void`
- Khởi tạo state từ `localStorage`
- Expose `AuthProvider` component và `useAuth()` hook

**T2 — Bọc app trong AuthProvider**
- File: `src/main.tsx`
- Thêm `<AuthProvider>` bọc ngoài `<App />` (bên trong `<BrowserRouter>`)
- Xóa `<BrowserRouter>` trong `App.tsx` (xử lý cùng lúc ở T3)

**T3 — Fix App.tsx: xóa nested Router, đọc auth từ Context**
- File: `src/App.tsx`
- Xóa `BrowserRouter as Router` import và `<Router>` wrapper
- Đọc `{ isAuthenticated, role }` từ `useAuth()` thay vì localStorage trực tiếp
- Sửa admin route: bỏ `ADMIN_PATH.DASHBOARD` route, chỉ giữ `/admin` (không exact) → `AdminLayout`
- Giữ nguyên các route khác

**T4 — Fix AdminLayout: tích hợp AdminScreen làm default**
- File: `src/router/AdminLayout.tsx`
- Import `AdminScreen`
- Thêm `<Route exact path={path}><AdminScreen /></Route>` làm route đầu tiên trong Switch
- Xóa `<h3>Chào mừng...</h3>` placeholder

**T5 — Refactor PrivateRoute: đọc auth từ Context**
- File: `src/router/PrivateRoute.tsx`
- Dùng `useAuth()` thay vì nhận `isAuthenticated`/`userRole` qua props
- Xóa các props `isAuthenticated`, `userRole` khỏi interface `PrivateRouteProps`

**T6 — Sửa constants và UserDetail cho dynamic route**
- File: `src/constants/app.constants.ts` → đổi `DETAIL: "/users/detail"` thành `DETAIL: "/users/:id"`
- File: `src/features/users/userDetail/UserDetail.tsx` → thêm `useParams<{ id: string }>()` để lấy `id`

### Acceptance Criteria

**AC1 — Không còn nested router:**
- Given: app khởi động
- When: kiểm tra React DevTools
- Then: chỉ có 1 `Router` context, không có nested `BrowserRouter`

**AC2 — Admin navigation hoạt động đúng:**
- Given: user đã login với role `admin`, đang ở `/admin`
- When: click link "Bảng điều khiển"
- Then: navigate đến `/admin/dashboard` (không phải `/admin/dashboard/dashboard`)

**AC3 — AdminScreen là default page khi vào /admin:**
- Given: user đã login với role `admin`
- When: navigate đến `/admin`
- Then: render `AdminScreen` component bên trong `AdminLayout` (có sidebar)

**AC4 — UserDetail nhận ID từ URL:**
- Given: user navigate đến `/users/123`
- When: `UserDetail` render
- Then: `useParams()` trả về `{ id: "123" }`

**AC5 — Auth state reactive:**
- Given: user chưa login
- When: gọi `login("token123", "admin")`
- Then: `isAuthenticated` trở thành `true`, router redirect đúng mà không cần reload page

**AC6 — Role-based redirect vẫn hoạt động:**
- Given: user login với role `user` cố vào `/admin`
- When: navigate đến `/admin`
- Then: bị redirect về `/users`

---

## Additional Context

### Dependencies

- Không cần cài thêm package
- `AuthContext` chỉ dùng React built-in: `createContext`, `useState`, `useContext`

### Testing Strategy

- Manual test: login với `localStorage.setItem("token", "x"); localStorage.setItem("role", "admin")` rồi reload
- Verify từng AC bằng browser navigation
- Check React DevTools để confirm không còn nested router

### Notes

- **Thứ tự implement quan trọng:** T1 → T2 → T3 → T5 → T4 → T6 (T5 phụ thuộc AuthContext từ T1; T4 phụ thuộc AdminScreen không thay đổi; T3 phụ thuộc T5 vì bỏ props)
- Khi bỏ props `isAuthenticated`/`userRole` khỏi `PrivateRoute`, cần update tất cả JSX dùng `PrivateRoute` trong `App.tsx` cùng lúc (T3 + T5 làm song song)
- `ADMIN_PATH.DASHBOARD` constant có thể giữ lại trong `app.constants.ts` cho semantic rõ ràng, chỉ xóa khỏi route definition trong `App.tsx`
