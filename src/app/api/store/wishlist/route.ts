import { NextResponse, type NextRequest } from "next/server";
import { ENDPOINTS } from "@/services/api/endpoints";
import { forwardCommerceRequest, isObjectId } from "@/lib/commerce-api";

export function GET(request: NextRequest) {
  return forwardCommerceRequest(request, ENDPOINTS.wishlist, "GET");
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("productId" in body) || typeof body.productId !== "string" || !isObjectId(body.productId)) {
    return NextResponse.json({ message: "Invalid product." }, { status: 400 });
  }
  return forwardCommerceRequest(request, ENDPOINTS.wishlist, "POST", { productId: body.productId });
}
