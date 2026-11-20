import axios, { type Method } from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, env, USER_COOKIE } from "@/config/env";
import { toApiError } from "@/lib/axios";

export function isObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(value);
}

export async function forwardCommerceRequest(
  request: NextRequest,
  path: string,
  method: Method,
  body?: unknown,
) {
  const unauthorizedResponse = (message: string) => {
    const response = NextResponse.json({ message }, { status: 401 });
    response.cookies.delete(AUTH_COOKIE);
    response.cookies.delete(USER_COOKIE);
    return response;
  };

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return unauthorizedResponse("Sign in to continue.");
  }

  try {
    const response = await axios.request({
      baseURL: env.apiBaseUrl,
      url: path,
      method,
      data: body,
      headers: { token },
      timeout: 15_000,
    });
    if (response.status === 204) return new NextResponse(null, { status: 204 });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const apiError = toApiError(error);
    if (apiError.status === 401) return unauthorizedResponse(apiError.message);
    return NextResponse.json({ message: apiError.message }, { status: apiError.status ?? 500 });
  }
}

export function getSessionUser(request: NextRequest): { _id?: string; name?: string; email?: string } | undefined {
  const raw = request.cookies.get(USER_COOKIE)?.value;
  if (!raw) return undefined;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return undefined;
  }
}
