import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";
import { checkoutSchema } from "./checkout";

describe("auth schemas", () => {
  it("rejects invalid email on login", () => {
    expect(loginSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
  it("defaults keep-me-signed-in to true and accepts an explicit choice", () => {
    expect(loginSchema.parse({ email: "a@b.com", password: "x" }).rememberMe).toBe(true);
    expect(loginSchema.parse({ email: "a@b.com", password: "x", rememberMe: false }).rememberMe).toBe(false);
  });
  const valid = { name: "Mona Ali", email: "m@x.com", phone: "+201012345678", password: "Fresh123!", rePassword: "Fresh123!" };
  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
    expect(registerSchema.safeParse({ ...valid, phone: "+14155552671" }).success).toBe(true);
  });
  it("rejects mismatched passwords and bad phones", () => {
    const mismatch = registerSchema.safeParse({ ...valid, rePassword: "654321" });
    expect(mismatch.success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, phone: "+12345" }).success).toBe(false);
  });
  it("requires a strong registration password", () => {
    expect(registerSchema.safeParse({ ...valid, password: "password", rePassword: "password" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, password: "Fresh123!", rePassword: "Fresh123!" }).success).toBe(true);
  });
});

describe("checkout schema", () => {
  const ok = { fullName: "Mona Ali", phone: "+201112345678", country: "EG", city: "Cairo", address: "12 Tahrir Street", payment: "cash" };
  it("accepts a valid order", () => expect(checkoutSchema.safeParse(ok).success).toBe(true));
  it("accepts online payment as a selectable checkout method", () => {
    expect(checkoutSchema.safeParse({ ...ok, payment: "card" }).success).toBe(true);
  });
  it("accepts international phone numbers and countries", () => {
    expect(checkoutSchema.safeParse({ ...ok, phone: "+14155552671", country: "US" }).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...ok, country: "XX" }).success).toBe(false);
  });
  it("rejects unsupported payment and invalid addresses", () => {
    expect(checkoutSchema.safeParse({ ...ok, payment: "crypto" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...ok, address: "x" }).success).toBe(false);
  });
});
