interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

// btoa không handle được unicode, dùng encodeURIComponent để safe
const base64UrlEncode = (str: string): string =>
  btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  )).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const base64UrlDecode = (str: string): string => {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = atob(padded.padEnd(padded.length + (4 - padded.length % 4) % 4, "="));
  return decodeURIComponent(decoded.split("").map(c =>
    "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(""));
};

export const createFakeJwt = (payload: JwtPayload): string => {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
};

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
};

// "còn hiệu lực" = tồn tại VÀ chưa hết hạn (exp > now)
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  return payload.exp > Math.floor(Date.now() / 1000);
};
