import { NextResponse, type NextRequest } from "next/server";
import { ENDPOINTS } from "@/services/api/endpoints";
import { forwardCommerceRequest, isObjectId } from "@/lib/commerce-api";

type Context = { params: Promise<{ productId: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  const { productId } = await context.params;
  if (!isObjectId(productId)) {
    return NextResponse.json({ message: "Invalid product." }, { status: 400 });
  }
  return forwardCommerceRequest(request, `${ENDPOINTS.wishlist}/${productId}`, "DELETE");
}
