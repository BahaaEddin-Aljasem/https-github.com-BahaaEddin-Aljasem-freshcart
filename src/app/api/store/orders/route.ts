import { NextResponse, type NextRequest } from "next/server";
import { ENDPOINTS } from "@/services/api/endpoints";
import { forwardCommerceRequest, getSessionUser, isObjectId } from "@/lib/commerce-api";

export function GET(request: NextRequest) {
  const user = getSessionUser(request);
  if (!user?._id || !isObjectId(user._id)) {
    return NextResponse.json({ message: "Your session is missing a valid user ID." }, { status: 401 });
  }
  return forwardCommerceRequest(request, `${ENDPOINTS.orders}/user/${user._id}`, "GET");
}
