import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";
import type { AuthUser } from "@/features/auth/types";

function sessionResponse(body: { authenticated: boolean; user?: AuthUser }) {
  const response = NextResponse.json(body);
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return response;
}

export async function GET() {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!jar.has(AUTH_COOKIE) || !raw) return sessionResponse({ authenticated: false });
  try {
    return sessionResponse({ authenticated: true, user: JSON.parse(decodeURIComponent(raw)) });
  } catch {
    return sessionResponse({ authenticated: false });
  }
}
