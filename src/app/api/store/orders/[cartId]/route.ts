import { NextResponse, type NextRequest } from "next/server";
import { ENDPOINTS } from "@/services/api/endpoints";
import { forwardCommerceRequest, isObjectId } from "@/lib/commerce-api";

type Context = { params: Promise<{ cartId: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { cartId } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!isObjectId(cartId) || !body || typeof body !== "object" ||
      !("shippingAddress" in body) || !body.shippingAddress || typeof body.shippingAddress !== "object") {
    return NextResponse.json({ message: "Invalid checkout details." }, { status: 400 });
  }
  const address = body.shippingAddress as Record<string, unknown>;
  if (typeof address.details !== "string" || typeof address.phone !== "string" || typeof address.city !== "string") {
    return NextResponse.json({ message: "Invalid shipping address." }, { status: 400 });
  }
  return forwardCommerceRequest(
    request,
    `${ENDPOINTS.orders}/${cartId}`,
    "POST",
    { shippingAddress: { details: address.details, phone: address.phone, city: address.city } },
  );
}
