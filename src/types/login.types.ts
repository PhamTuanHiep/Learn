import type { ROLE } from "../constants/login.constants";

export type Role = (typeof ROLE)[keyof typeof ROLE];
