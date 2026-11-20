import { NextResponse } from "next/server";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.delete(AUTH_COOKIE);
  res.cookies.delete(USER_COOKIE);
  return res;
}
