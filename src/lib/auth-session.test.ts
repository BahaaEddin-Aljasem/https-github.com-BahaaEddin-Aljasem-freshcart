import { describe, expect, it } from "vitest";
import { AUTH_COOKIE } from "@/config/env";
import { createSessionResponse } from "./auth-session";

describe("createSessionResponse", () => {
  it("uses a browser-session cookie unless keep-me-signed-in is selected", () => {
    const user = { name: "Test User", email: "test@example.com" };
    const sessionCookie = createSessionResponse("token", user, false).cookies.get(AUTH_COOKIE);
    const persistentCookie = createSessionResponse("token", user, true).cookies.get(AUTH_COOKIE);

    expect(sessionCookie?.maxAge).toBeUndefined();
    expect(persistentCookie?.maxAge).toBe(60 * 60 * 24 * 7);
  });

  it("stores the user id decoded from the JWT when the API omits it", async () => {
    const id = "6428ebc6dc1175abc65ca0b9";
    const token = `h.${Buffer.from(JSON.stringify({ id })).toString("base64url")}.s`;
    const response = createSessionResponse(token, { name: "Test User", email: "test@example.com" });
    const body = (await response.json()) as { user: { _id?: string } };

    expect(body.user._id).toBe(id);
  });
});
