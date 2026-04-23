import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export interface JWTPayload {
  userId: string;
  email: string;
}

export const signAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
