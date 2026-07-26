import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import AdminScreen from "../features/admin/AdminScreen";

const AdminLayout: React.FC = () => {
  // path dùng cho Route matching, url dùng cho Link href
  const { path, url } = useRouteMatch();

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", background: "#eee" }}>
        <nav>
          <ul>
            <li>
              <Link to={url}>Trang chủ Admin</Link>
            </li>
            <li>
              <Link to={`${url}/dashboard`}>Bảng điều khiển</Link>
            </li>
            <li>
              <Link to={`${url}/users`}>Quản lý người dùng</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Switch>
          {/* Default khi vào /admin */}
          <Route exact path={path}>
            <AdminScreen />
          </Route>

          {/* /admin/dashboard */}
          <Route path={`${path}/dashboard`}>
            <div>Nội dung Bảng điều khiển</div>
          </Route>

          {/* /admin/users */}
          <Route path={`${path}/users`}>
            <div>Danh sách người dùng hệ thống</div>
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default AdminLayout;
