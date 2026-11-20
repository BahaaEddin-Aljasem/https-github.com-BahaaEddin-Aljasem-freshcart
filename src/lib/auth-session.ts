import { NextResponse } from "next/server";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";
import type { AuthUser } from "@/features/auth/types";

function userIdFromToken(token: string): string | undefined {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as { id?: unknown };
    return typeof payload.id === "string" ? payload.id : undefined;
  } catch {
    return undefined;
  }
}

export function createSessionResponse(token: string, sessionUser: AuthUser, rememberMe = true) {
  const id = sessionUser._id ?? userIdFromToken(token);
  const user: AuthUser = id ? { ...sessionUser, _id: id } : sessionUser;
  const response = NextResponse.json({ message: "success", user, authenticated: true });
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 7 } : {}),
  };
  response.cookies.set(AUTH_COOKIE, token, options);
  response.cookies.set(USER_COOKIE, encodeURIComponent(JSON.stringify(user)), options);
  return response;
}
