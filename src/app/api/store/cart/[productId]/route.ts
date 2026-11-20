import { NextResponse, type NextRequest } from "next/server";
import { MAX_QUANTITY } from "@/config/constants";
import { ENDPOINTS } from "@/services/api/endpoints";
import { forwardCommerceRequest, isObjectId } from "@/lib/commerce-api";

type Context = { params: Promise<{ productId: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const { productId } = await context.params;
  const body: unknown = await request.json().catch(() => null);
  if (!isObjectId(productId) || !body || typeof body !== "object" || !("count" in body) ||
      typeof body.count !== "number" || !Number.isInteger(body.count) || body.count < 1 || body.count > MAX_QUANTITY) {
    return NextResponse.json({ message: "Invalid cart quantity." }, { status: 400 });
  }
  return forwardCommerceRequest(request, `${ENDPOINTS.cart}/${productId}`, "PUT", { count: body.count });
}

export async function DELETE(request: NextRequest, context: Context) {
  const { productId } = await context.params;
  if (!isObjectId(productId)) {
    return NextResponse.json({ message: "Invalid product." }, { status: 400 });
  }
  return forwardCommerceRequest(request, `${ENDPOINTS.cart}/${productId}`, "DELETE");
}
