import { describe, expect, it } from "vitest";
import { readSavedAddresses, writeSavedAddresses, type AddressStorage, type SavedAddress } from "./address-storage";

class MemoryStorage implements AddressStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const address: SavedAddress = {
  id: "address-1",
  label: "Home",
  fullName: "Test User",
  phone: "01012345678",
  country: "EG",
  city: "Cairo",
  address: "1 Main Street",
};

describe("saved address storage", () => {
  it("keeps address lists isolated by user and restores saved entries", () => {
    const storage = new MemoryStorage();
    writeSavedAddresses(storage, "user-1", [address]);

    expect(readSavedAddresses(storage, "user-1")).toEqual([address]);
    expect(readSavedAddresses(storage, "user-2")).toEqual([]);
  });

  it("continues to read addresses saved before a country was recorded", () => {
    const storage = new MemoryStorage();
    const { country, ...legacyAddress } = address;
    expect(country).toBe("EG");
    writeSavedAddresses(storage, "user-1", [legacyAddress]);

    expect(readSavedAddresses(storage, "user-1")).toEqual([legacyAddress]);
  });

  it("reports corrupted saved address data instead of silently discarding it", () => {
    const storage = new MemoryStorage();
    storage.setItem("freshcart:addresses:v1:user-1", "{");

    expect(() => readSavedAddresses(storage, "user-1")).toThrow("Saved address data could not be read.");
  });
});
