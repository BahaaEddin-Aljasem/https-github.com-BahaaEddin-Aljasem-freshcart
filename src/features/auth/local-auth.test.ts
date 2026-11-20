import { beforeEach, describe, expect, it } from "vitest";
import { createLocalAuth, LOCAL_AUTH_STORAGE_KEY, LocalAuthError, type AuthStorage } from "./local-auth";

function createMemoryStorage(): AuthStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

const registration = {
  name: "Test User",
  email: "Test@Example.com",
  phone: "01012345678",
  password: "Password1!",
  rePassword: "Password1!",
};

describe("local authentication", () => {
  let storage: AuthStorage;
  let auth: ReturnType<typeof createLocalAuth>;

  beforeEach(() => {
    storage = createMemoryStorage();
    auth = createLocalAuth(storage);
  });

  it("registers locally, hashes the password, and restores the session", async () => {
    const user = await auth.register(registration);
    const saved = storage.getItem(LOCAL_AUTH_STORAGE_KEY);

    expect(user.name).toBe("Test User");
    expect(user.email).toBe("test@example.com");
    expect(auth.readSession()).toEqual({ authenticated: true, localOnly: true, user });
    expect(saved).not.toContain(registration.password);
    expect(JSON.parse(saved!).accounts[0].passwordHash).not.toBe(registration.password);
  });

  it("authenticates case-insensitive emails and rejects incorrect passwords", async () => {
    await auth.register(registration);

    await expect(auth.login({
      email: registration.email,
      password: "incorrect",
      rememberMe: true,
    })).rejects.toThrow("Incorrect email or password");

    const user = await auth.login({
      email: "test@example.com",
      password: registration.password,
      rememberMe: true,
    });
    expect(user.email).toBe("test@example.com");
    expect(auth.readSession().authenticated).toBe(true);
  });

  it("updates the active local profile with a normalized international phone number", async () => {
    const user = await auth.register(registration);
    const updated = auth.updateProfile(user._id!, {
      name: "Updated User",
      email: "Updated@Example.com",
      phone: "+14155552671",
    });

    expect(updated).toMatchObject({
      _id: user._id,
      name: "Updated User",
      email: "updated@example.com",
      phone: "+14155552671",
    });
    expect(auth.readSession().user).toEqual(updated);
  });

  it("explains when an account was never registered in this browser store", async () => {
    await expect(auth.login({
      email: "not-registered@example.test",
      password: "Password1!",
      rememberMe: true,
    })).rejects.toThrow("No account is registered for this site. Create an account first.");
  });

  it("rejects duplicate accounts and clears only the active session on logout", async () => {
    await auth.register(registration);
    await expect(auth.register(registration)).rejects.toMatchObject({ code: "email_exists" });

    auth.logout();

    expect(auth.readSession()).toEqual({ authenticated: false });
    expect(JSON.parse(storage.getItem(LOCAL_AUTH_STORAGE_KEY)!).accounts).toHaveLength(1);
  });

  it("does not persist a login when Keep me signed in is unchecked", async () => {
    await auth.register(registration);
    await auth.logout();

    await auth.login({ email: registration.email, password: registration.password, rememberMe: false });

    expect(auth.readSession()).toEqual({ authenticated: false });
  });

  it("reports corrupted saved data instead of silently treating it as an empty account list", () => {
    storage.setItem(LOCAL_AUTH_STORAGE_KEY, "{");

    expect(() => auth.readSession()).toThrowError(LocalAuthError);
  });
});
