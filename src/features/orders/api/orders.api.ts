import { localApi } from "@/lib/axios";
import type { CartSnapshot } from "@/features/cart/api/cart.api";
import type { Order, OrderAddress } from "@/features/orders/types";
import { getCountryName } from "@/lib/phone";

interface ApiOrderLine {
  count: number;
  price: number;
  product?: {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
  };
}

interface ApiOrder {
  _id: string;
  createdAt: string;
  totalOrderPrice: number;
  cartItems?: ApiOrderLine[];
  products?: ApiOrderLine[];
  shippingAddress?: { details?: string; phone?: string; city?: string };
  isDelivered?: boolean;
  paymentMethodType?: string;
}

interface OrderResponse {
  data?: ApiOrder | ApiOrder[];
}

export function mapOrder(order: ApiOrder, userName?: string): Order {
  const lines = order.cartItems ?? order.products ?? [];
  const items = lines.flatMap((line) => {
    if (!line.product) return [];
    return [{
      id: line.product._id,
      title: line.product.title,
      imageUrl: line.product.imageCover,
      price: line.price || line.product.price,
      quantity: line.count,
    }];
  });
  const total = order.totalOrderPrice ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: order._id,
    createdAt: order.createdAt,
    items,
    subtotal,
    shipping: Math.max(0, total - subtotal),
    total,
    address: {
      fullName: userName ?? "",
      phone: order.shippingAddress?.phone ?? "",
      city: order.shippingAddress?.city ?? "",
      address: order.shippingAddress?.details ?? "",
    },
    payment: order.paymentMethodType === "cash" || order.paymentMethodType === "card" ? order.paymentMethodType : undefined,
    status: order.isDelivered ? "Delivered" : "Processing",
  };
}

export const ordersApi = {
  async list(userName?: string): Promise<Order[]> {
    const response = await localApi.get<OrderResponse>("/api/store/orders");
    const data = response.data.data;
    if (!Array.isArray(data)) throw new Error("Unexpected response from the orders API.");
    return data.map((order) => mapOrder(order, userName));
  },
  async placeOrder(
    cart: CartSnapshot,
    address: OrderAddress,
    userName?: string,
  ): Promise<Order> {
    if (!cart.id) throw new Error("The API cart is unavailable. Please try adding your products again.");
    const response = await localApi.post<OrderResponse>(`/api/store/orders/${cart.id}`, {
      shippingAddress: {
        details: [address.fullName, address.address, address.notes].filter(Boolean).join(", "),
        phone: address.phone,
        city: [address.city, getCountryName(address.country)].filter(Boolean).join(", "),
      },
    });
    const order = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
    if (!order?._id) throw new Error("The API did not return a confirmed order.");
    const mapped = mapOrder(order, userName);
    const items = mapped.items.length ? mapped.items : cart.items;
    const subtotal = mapped.items.length ? mapped.subtotal : cart.totalPrice;
    return {
      ...mapped,
      items,
      subtotal,
      shipping: Math.max(0, mapped.total - subtotal),
      payment: mapped.payment ?? "cash",
      address: { ...mapped.address, fullName: address.fullName },
    };
  },
};
