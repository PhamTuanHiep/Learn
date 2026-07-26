import React from "react";
import { Route, Redirect, type RouteProps } from "react-router-dom";
import { ADMIN_PATH, AUTH, USER_PATH } from "../constants/app.constants";
import { ROLE } from "../constants/login.constants";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<object>;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        // 1. Kiểm tra Authentication (đã đăng nhập chưa)
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{ pathname: AUTH.LOGIN, state: { from: props.location } }}
            />
          );
        }

        // 2. Kiểm tra Authorization (có đúng quyền không)
        if (role && !allowedRoles.includes(role)) {
          return (
            <Redirect
              to={role === ROLE.ADMIN ? ADMIN_PATH.ADMIN : USER_PATH.USERS}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
