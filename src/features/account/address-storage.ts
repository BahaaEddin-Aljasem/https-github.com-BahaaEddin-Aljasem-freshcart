export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  country?: string;
  city: string;
  address: string;
}

export interface AddressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const storageKey = (userId: string) => `freshcart:addresses:v1:${encodeURIComponent(userId)}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSavedAddress(value: unknown): value is SavedAddress {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.label === "string"
    && typeof value.fullName === "string"
    && typeof value.phone === "string"
    && typeof value.city === "string"
    && typeof value.address === "string";
}

export function readSavedAddresses(storage: AddressStorage, userId: string): SavedAddress[] {
  let raw: string | null;
  try {
    raw = storage.getItem(storageKey(userId));
  } catch {
    throw new Error("Saved addresses are unavailable in this browser.");
  }
  if (raw === null) return [];

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Saved address data could not be read.");
  }
  if (!Array.isArray(value) || !value.every(isSavedAddress)) {
    throw new Error("Saved address data is invalid.");
  }
  return value;
}

export function writeSavedAddresses(storage: AddressStorage, userId: string, addresses: SavedAddress[]) {
  try {
    storage.setItem(storageKey(userId), JSON.stringify(addresses));
  } catch {
    throw new Error("Saved addresses could not be stored in this browser.");
  }
}
