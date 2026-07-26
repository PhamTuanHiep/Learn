import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ADMIN_PATH, MANAGER_PATH, USER_PATH } from "../../constants/app.constants";
import { ROLE } from "../../constants/login.constants";
import type { Role } from "../../types/login.types";
import { useAuth } from "../../contexts/AuthContext";
import { loginApi } from "../../services/auth.service";

const DEFAULT_HOME: Record<string, string> = {
  [ROLE.ADMIN]:   ADMIN_PATH.ADMIN,
  [ROLE.MANAGER]: MANAGER_PATH.MANAGER,
  [ROLE.USER]:    USER_PATH.USERS,
};

// Tiền tố URL thuộc về từng role
const ROLE_PATH_PREFIX: Record<string, string> = {
  [ROLE.ADMIN]:   ADMIN_PATH.ADMIN,   // "/admin"
  [ROLE.MANAGER]: MANAGER_PATH.MANAGER, // "/manager"
  [ROLE.USER]:    USER_PATH.USERS,    // "/users"
};

// Chỉ dùng `from` nếu URL đó thuộc quyền của role vừa đăng nhập
// Tránh trường hợp: admin login sau khi bị redirect từ trang của user
const getRedirectPath = (from: string | undefined, role: string): string => {
  const rolePrefix = ROLE_PATH_PREFIX[role];
  if (from && rolePrefix && from.startsWith(rolePrefix)) return from;
  return DEFAULT_HOME[role];
};

const Login = () => {
  const history = useHistory();
  const location = useLocation<{ from?: { pathname: string } }>();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLoginMock = async (role: Role) => {
    setLoading(true);
    try {
      const { token, user } = await loginApi(String(role));
      login(token, user);

      const from = location.state?.from?.pathname;
      history.replace(getRedirectPath(from, String(role)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>Login Page</div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        <button disabled={loading} onClick={() => handleLoginMock(ROLE.USER)}>
          User Role
        </button>
        <button disabled={loading} onClick={() => handleLoginMock(ROLE.MANAGER)}>
          Manager Role
        </button>
        <button disabled={loading} onClick={() => handleLoginMock(ROLE.ADMIN)}>
          Admin Role
        </button>
      </div>
      {loading && (
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          Logging in...
        </div>
      )}
    </>
  );
};

export default Login;
