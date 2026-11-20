import { NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/auth-session";
import { api, toApiError } from "@/lib/axios";
import { loginSchema } from "@/schemas/auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  const { email, password, rememberMe } = parsed.data;

  try {
    const { data } = await api.post<AuthResponse>(ENDPOINTS.auth.signin, { email, password });
    if (!data.token) {
      return NextResponse.json({ message: "Unexpected response from server" }, { status: 502 });
    }
    const user: AuthUser = data.user ?? { name: email, email };
    return createSessionResponse(data.token, user, rememberMe);
  } catch (e) {
    const err = toApiError(e);
    return NextResponse.json({ message: err.message }, { status: err.status ?? 500 });
  }
}
