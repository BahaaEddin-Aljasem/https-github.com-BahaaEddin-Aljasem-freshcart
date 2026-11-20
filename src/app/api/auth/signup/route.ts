import { NextResponse } from "next/server";
import { createSessionResponse } from "@/lib/auth-session";
import { api, toApiError } from "@/lib/axios";
import { registerSchema } from "@/schemas/auth";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const { data } = await api.post<AuthResponse>(
      ENDPOINTS.auth.signup,
      parsed.data,
    );
    if (data.token) {
      const user: AuthUser = data.user ?? { name: parsed.data.name, email: parsed.data.email };
      return createSessionResponse(data.token, user);
    }

    return NextResponse.json({
      message: data.message,
      user: data.user,
      authenticated: false,
    });
  } catch (error) {
    const apiError = toApiError(error);
    return NextResponse.json({ message: apiError.message }, { status: apiError.status ?? 500 });
  }
}
