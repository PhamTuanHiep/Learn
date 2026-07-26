import { createFakeJwt } from "../utils/jwt.utils";
import { ROLE } from "../constants/login.constants";

export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

const MOCK_USERS: Record<string, Omit<AuthUser, "role">> = {
  [ROLE.ADMIN]:   { id: "1", name: "Admin User" },
  [ROLE.MANAGER]: { id: "2", name: "Manager User" },
  [ROLE.USER]:    { id: "3", name: "Regular User" },
};

// Giả lập fetch: delay 500ms rồi trả về JWT + user info
export const loginApi = (role: string): Promise<LoginResponse> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockUser = MOCK_USERS[role];
      if (!mockUser) {
        reject(new Error(`Unknown role: ${role}`));
        return;
      }

      const exp = Math.floor(Date.now() / 1000) + 60 * 60; // hết hạn sau 1 giờ
      const token = createFakeJwt({ sub: mockUser.id, role, exp });

      resolve({ token, user: { ...mockUser, role } });
    }, 500);
  });
