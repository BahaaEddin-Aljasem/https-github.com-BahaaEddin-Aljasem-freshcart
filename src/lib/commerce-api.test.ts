import axios, { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTH_COOKIE, USER_COOKIE } from "@/config/env";
import { forwardCommerceRequest, isObjectId } from "./commerce-api";

describe("isObjectId", () => {
  it("accepts 24-character hexadecimal IDs and rejects malformed values", () => {
    expect(isObjectId("507f1f77bcf86cd799439011")).toBe(true);
    expect(isObjectId("507F1F77BCF86CD799439011")).toBe(true);
    expect(isObjectId("product-1")).toBe(false);
    expect(isObjectId("507f1f77bcf86cd79943901")).toBe(false);
  });
});

describe("forwardCommerceRequest", () => {
  afterEach(() => vi.restoreAllMocks());

  it("clears the stale session cookies when the commerce API rejects the token", async () => {
    const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };
    const upstreamResponse: AxiosResponse = {
      data: { message: "You are not logged in." },
      status: 401,
      statusText: "Unauthorized",
      headers: new AxiosHeaders(),
      config,
    };
    vi.spyOn(axios, "request").mockRejectedValue(
      new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, upstreamResponse),
    );

    const request = new NextRequest("http://localhost/api/store/cart", {
      headers: {
        cookie: `${AUTH_COOKIE}=expired; ${USER_COOKIE}=${encodeURIComponent(JSON.stringify({ name: "Test User", email: "test@example.com" }))}`,
      },
    });
    const response = await forwardCommerceRequest(request, "/cart", "GET");
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(401);
    expect(setCookie).toContain(`${AUTH_COOKIE}=`);
    expect(setCookie).toContain(`${USER_COOKIE}=`);
  });
});
