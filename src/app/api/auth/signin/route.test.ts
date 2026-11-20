import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";
import { api } from "@/lib/axios";
import { ENDPOINTS } from "@/services/api/endpoints";
import { POST } from "./route";

const credentials = { email: "test@example.com", password: "example-password", rememberMe: false };

function request(body: { email: string; password: string; rememberMe?: boolean } = credentials) {
  return new Request("http://localhost/api/auth/signin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => vi.restoreAllMocks());

describe("sign-in route", () => {
  it("forwards credentials to the configured API and creates a session on success", async () => {
    const post = vi.spyOn(api, "post").mockResolvedValue({
      data: { token: "test-token", user: { name: "Test", email: credentials.email } },
    });

    const response = await POST(request());

    expect(post).toHaveBeenCalledWith(ENDPOINTS.auth.signin, {
      email: credentials.email,
      password: credentials.password,
    });
    expect(response.status).toBe(200);
    expect(response.cookies.get(AUTH_COOKIE)?.value).toBe("test-token");
    expect(response.cookies.get(USER_COOKIE)).toBeDefined();
  });

  it("persists the session by default when no remember-me choice is sent", async () => {
    vi.spyOn(api, "post").mockResolvedValue({
      data: { token: "test-token", user: { name: "Test", email: credentials.email } },
    });

    const response = await POST(request({ email: credentials.email, password: credentials.password }));

    expect(response.cookies.get(AUTH_COOKIE)?.maxAge).toBe(60 * 60 * 24 * 7);
  });

  it("preserves the API's rejected-credentials response without creating a session", async () => {
    vi.spyOn(api, "post").mockRejectedValue(new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      { status: 401, statusText: "Unauthorized", headers: {}, config: { headers: new AxiosHeaders() }, data: { message: "Incorrect email or password" } },
    ));

    const response = await POST(request());

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ message: "Incorrect email or password" });
    expect(response.cookies.get(AUTH_COOKIE)).toBeUndefined();
  });

  it("reports an upstream timeout rather than creating a session", async () => {
    vi.spyOn(api, "post").mockRejectedValue(new AxiosError("Authentication service timed out", "ECONNABORTED"));
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ message: "Authentication service timed out" });
    expect(response.cookies.get(AUTH_COOKIE)).toBeUndefined();
  });
});
