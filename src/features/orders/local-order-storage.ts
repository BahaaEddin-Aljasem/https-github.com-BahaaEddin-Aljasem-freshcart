import type { CartSnapshot } from "@/features/cart/api/cart.api";
import type { Order, OrderAddress } from "@/features/orders/types";
import type { CartItem } from "@/store/cart.store";
import { getCountryName } from "@/lib/phone";

export interface LocalOrderStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const storageKey = (userId: string) => `freshcart:orders:v1:${encodeURIComponent(userId)}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCartItem(value: unknown): value is CartItem {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.title === "string"
    && typeof value.imageUrl === "string"
    && typeof value.price === "number"
    && Number.isFinite(value.price)
    && typeof value.quantity === "number"
    && Number.isInteger(value.quantity)
    && value.quantity > 0;
}

function isOrderAddress(value: unknown): value is OrderAddress {
  return isRecord(value)
    && typeof value.fullName === "string"
    && typeof value.phone === "string"
    && typeof value.city === "string"
    && typeof value.address === "string"
    && (value.country === undefined || typeof value.country === "string")
    && (value.notes === undefined || typeof value.notes === "string");
}

function isOrder(value: unknown): value is Order {
  return isRecord(value)
    && typeof value.id === "string"
    && typeof value.createdAt === "string"
    && Array.isArray(value.items)
    && value.items.every(isCartItem)
    && typeof value.subtotal === "number"
    && Number.isFinite(value.subtotal)
    && typeof value.shipping === "number"
    && Number.isFinite(value.shipping)
    && typeof value.total === "number"
    && Number.isFinite(value.total)
    && isOrderAddress(value.address)
    && (value.payment === undefined || value.payment === "cash" || value.payment === "card")
    && (value.status === "Processing" || value.status === "Delivered" || value.status === "Saved locally");
}

export function readLocalOrders(storage: LocalOrderStorage, userId: string): Order[] {
  let raw: string | null;
  try {
    raw = storage.getItem(storageKey(userId));
  } catch {
    throw new Error("Your saved orders are unavailable in this browser.");
  }
  if (raw === null) return [];

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Your saved order data could not be read.");
  }
  if (!Array.isArray(value) || !value.every(isOrder)) {
    throw new Error("Your saved order data is invalid.");
  }
  return value;
}

export function placeLocalOrder(
  storage: LocalOrderStorage,
  userId: string,
  cart: CartSnapshot,
  address: OrderAddress,
): Order {
  if (!userId.trim()) throw new Error("Sign in to save this order to your account.");
  if (cart.items.length === 0) throw new Error("Your cart is empty.");
  if (!Number.isFinite(cart.totalPrice) || cart.items.some((item) => !isCartItem(item))) {
    throw new Error("Your cart contains invalid order information.");
  }

  const subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = Math.max(subtotal, cart.totalPrice);
  const order: Order = {
    id: `local-${globalThis.crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    items: cart.items.map((item) => ({ ...item })),
    subtotal,
    shipping: Math.max(0, total - subtotal),
    total,
    address: {
      ...address,
      city: [address.city, getCountryName(address.country)].filter(Boolean).join(", "),
    },
    payment: "cash",
    status: "Saved locally",
  };
  const orders = readLocalOrders(storage, userId);

  try {
    storage.setItem(storageKey(userId), JSON.stringify([order, ...orders]));
  } catch {
    throw new Error("Your order could not be saved in this browser. Check available storage and try again.");
  }
  return order;
}
