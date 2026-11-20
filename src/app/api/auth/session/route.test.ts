import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";

const { cookieJar } = vi.hoisted(() => ({
  cookieJar: {
    get: vi.fn(),
    has: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: async () => cookieJar,
}));

import { GET } from "./route";

beforeEach(() => {
  cookieJar.get.mockReset().mockReturnValue(undefined);
  cookieJar.has.mockReset().mockReturnValue(false);
});

describe("session route", () => {
  it("reports an unauthenticated session without cacheable responses", async () => {
    const response = await GET();

    expect(await response.json()).toEqual({ authenticated: false });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });

  it("restores the user from the persistent session cookies", async () => {
    const user = { _id: "user-id", name: "Test User", email: "test@example.com" };
    cookieJar.has.mockImplementation((name: string) => name === AUTH_COOKIE);
    cookieJar.get.mockImplementation((name: string) =>
      name === USER_COOKIE
        ? { value: encodeURIComponent(JSON.stringify(user)) }
        : undefined,
    );

    const response = await GET();

    expect(await response.json()).toEqual({ authenticated: true, user });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });

  it("does not restore a user when the session token is missing", async () => {
    cookieJar.get.mockImplementation((name: string) =>
      name === USER_COOKIE
        ? { value: encodeURIComponent(JSON.stringify({ name: "Test User" })) }
        : undefined,
    );

    expect(await (await GET()).json()).toEqual({ authenticated: false });
  });
});
