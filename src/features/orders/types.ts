import type { CartItem } from "@/store/cart.store";

export interface OrderAddress {
  fullName: string;
  phone: string;
  country?: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: OrderAddress;
  payment?: "cash" | "card";
  status: "Processing" | "Delivered" | "Saved locally";
}
