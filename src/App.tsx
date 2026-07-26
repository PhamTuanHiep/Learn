import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import AdminLayout from "./router/AdminLayout";
import Login from "./features/login/Login";
import UsersScreen from "./features/users/UsersScreen";
import UserDetail from "./features/users/userDetail/UserDetail";
import ManagerScreen from "./features/manager/ManagerScreen";
import { ADMIN_PATH, AUTH, MANAGER_PATH, USER_PATH } from "./constants/app.constants";
import { ROLE } from "./constants/login.constants";
import { useAuth } from "./contexts/AuthContext";
import ChipDisplayEnv from "./components/ChipDisplayEnv";

const DEFAULT_HOME: Record<string, string> = {
  [ROLE.ADMIN]:   ADMIN_PATH.ADMIN,
  [ROLE.MANAGER]: MANAGER_PATH.MANAGER,
  [ROLE.USER]:    USER_PATH.USERS,
};

const App: React.FC = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <>
    <ChipDisplayEnv />
    <Switch>
      {/* 1. /login — đã đăng nhập thì redirect về trang chủ theo role */}
      <Route exact path={AUTH.LOGIN}>
        {isAuthenticated && role ? (
          <Redirect to={DEFAULT_HOME[role] ?? USER_PATH.USERS} />
        ) : (
          <Login />
        )}
      </Route>

      {/* 2. Admin Routes */}
      <PrivateRoute
        path={ADMIN_PATH.ADMIN}
        component={AdminLayout}
        allowedRoles={[ROLE.ADMIN]}
      />

      {/* 3. Manager Routes */}
      <PrivateRoute
        path={MANAGER_PATH.MANAGER}
        component={ManagerScreen}
        allowedRoles={[ROLE.MANAGER]}
      />

      {/* 4. User Routes */}
      <PrivateRoute
        exact
        path={USER_PATH.USERS}
        component={UsersScreen}
        allowedRoles={[ROLE.USER, ROLE.ADMIN, ROLE.MANAGER]}
      />
      <PrivateRoute
        exact
        path={USER_PATH.DETAIL}
        component={UserDetail}
        allowedRoles={[ROLE.USER]}
      />

      {/* 5. Default redirect theo role */}
      <Route path={AUTH.HOME}>
        {!isAuthenticated ? (
          <Redirect to={AUTH.LOGIN} />
        ) : (
          <Redirect to={DEFAULT_HOME[role ?? ""] ?? AUTH.LOGIN} />
        )}
      </Route>

      {/* 6. 404 */}
      <Route render={() => <div>404 - Page not found</div>} />
    </Switch>
    </>
  );
};

export default App;
