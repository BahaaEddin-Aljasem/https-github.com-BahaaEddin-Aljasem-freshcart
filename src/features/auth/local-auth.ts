import type { LoginInput, ProfileUpdateInput, RegisterInput } from "@/schemas/auth";
import type { AuthUser } from "./types";

export const LOCAL_AUTH_STORAGE_KEY = "freshcart:local-auth:v1";

const PBKDF2_ITERATIONS = 210_000;

const errorMessages = {
  account_not_found: "No account is registered for this site. Create an account first.",
  invalid_credentials: "Incorrect email or password",
  email_exists: "An account with this email already exists.",
  storage_unavailable: "Browser storage is unavailable. Allow storage access and try again.",
  corrupt_data: "Saved account data could not be read. Clear this site's saved data and register again.",
  crypto_unavailable: "This browser cannot securely create a local account.",
} as const;

export type LocalAuthErrorCode = keyof typeof errorMessages;

export class LocalAuthError extends Error {
  constructor(readonly code: LocalAuthErrorCode) {
    super(errorMessages[code]);
    this.name = "LocalAuthError";
  }
}

export interface AuthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordSalt: string;
  passwordHash: string;
}

interface StoredAuthData {
  version: 1;
  accounts: StoredAccount[];
  sessionUserId: string | null;
}

export interface LocalSession {
  authenticated: boolean;
  localOnly?: true;
  user?: AuthUser;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStoredAccount(value: unknown): value is StoredAccount {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.name === "string"
    && typeof value.email === "string"
    && typeof value.phone === "string"
    && typeof value.passwordSalt === "string"
    && /^[a-f\d]{32}$/i.test(value.passwordSalt)
    && typeof value.passwordHash === "string"
    && /^[a-f\d]{64}$/i.test(value.passwordHash);
}

function isStoredAuthData(value: unknown): value is StoredAuthData {
  return isRecord(value)
    && value.version === 1
    && Array.isArray(value.accounts)
    && value.accounts.every(isStoredAccount)
    && (typeof value.sessionUserId === "string" || value.sessionUserId === null);
}

function parseData(raw: string | null): StoredAuthData {
  if (raw === null) return { version: 1, accounts: [], sessionUserId: null };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new LocalAuthError("corrupt_data");
  }
  if (!isStoredAuthData(value)) throw new LocalAuthError("corrupt_data");
  return value;
}

function readData(storage: AuthStorage): StoredAuthData {
  try {
    return parseData(storage.getItem(LOCAL_AUTH_STORAGE_KEY));
  } catch (error) {
    if (error instanceof LocalAuthError) throw error;
    throw new LocalAuthError("storage_unavailable");
  }
}

function writeData(storage: AuthStorage, data: StoredAuthData) {
  try {
    storage.setItem(LOCAL_AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new LocalAuthError("storage_unavailable");
  }
}

function getCrypto() {
  if (!globalThis.crypto?.subtle) throw new LocalAuthError("crypto_unavailable");
  return globalThis.crypto;
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string) {
  return Uint8Array.from({ length: value.length / 2 }, (_, index) =>
    Number.parseInt(value.slice(index * 2, index * 2 + 2), 16),
  );
}

function createSalt() {
  return toHex(getCrypto().getRandomValues(new Uint8Array(16)));
}

async function hashPassword(password: string, salt: string) {
  const crypto = getCrypto();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: fromHex(salt),
      iterations: PBKDF2_ITERATIONS,
    },
    key,
    256,
  );
  return toHex(new Uint8Array(result));
}

function hashesMatch(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function createUserId() {
  return `local-${toHex(getCrypto().getRandomValues(new Uint8Array(16)))}`;
}

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    _id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: "user",
  };
}

export function createLocalAuth(storage: AuthStorage) {
  return {
    readSession(): LocalSession {
      const data = readData(storage);
      if (!data.sessionUserId) return { authenticated: false };

      const account = data.accounts.find((entry) => entry.id === data.sessionUserId);
      if (!account) {
        writeData(storage, { ...data, sessionUserId: null });
        return { authenticated: false };
      }

      return { authenticated: true, localOnly: true, user: toAuthUser(account) };
    },

    async register(input: RegisterInput) {
      const data = readData(storage);
      const email = input.email.trim().toLowerCase();
      if (data.accounts.some((account) => account.email === email)) {
        throw new LocalAuthError("email_exists");
      }

      const passwordSalt = createSalt();
      const account: StoredAccount = {
        id: createUserId(),
        name: input.name.trim(),
        email,
        phone: input.phone.trim(),
        passwordSalt,
        passwordHash: await hashPassword(input.password, passwordSalt),
      };
      writeData(storage, {
        ...data,
        accounts: [...data.accounts, account],
        sessionUserId: account.id,
      });
      return toAuthUser(account);
    },

    updateProfile(userId: string, input: ProfileUpdateInput) {
      const data = readData(storage);
      const account = data.accounts.find((entry) => entry.id === userId);
      if (!account) throw new LocalAuthError("account_not_found");

      const email = input.email.trim().toLowerCase();
      if (data.accounts.some((entry) => entry.id !== userId && entry.email === email)) {
        throw new LocalAuthError("email_exists");
      }

      const updatedAccount: StoredAccount = {
        ...account,
        name: input.name.trim(),
        email,
        phone: input.phone.trim(),
      };
      writeData(storage, {
        ...data,
        accounts: data.accounts.map((entry) => entry.id === userId ? updatedAccount : entry),
      });
      return toAuthUser(updatedAccount);
    },

    async login(input: LoginInput) {
      const data = readData(storage);
      const email = input.email.trim().toLowerCase();
      const account = data.accounts.find((entry) => entry.email === email);
      if (!account) throw new LocalAuthError("account_not_found");

      const passwordHash = await hashPassword(input.password, account.passwordSalt);
      if (!hashesMatch(passwordHash, account.passwordHash)) {
        throw new LocalAuthError("invalid_credentials");
      }

      writeData(storage, {
        ...data,
        sessionUserId: input.rememberMe ? account.id : null,
      });
      return toAuthUser(account);
    },

    logout() {
      const data = readData(storage);
      if (data.sessionUserId) writeData(storage, { ...data, sessionUserId: null });
    },
  };
}
