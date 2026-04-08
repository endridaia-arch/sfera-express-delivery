import { NextResponse } from "next/server";
import { getShipmentByTrackingCode } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const shipment = await getShipmentByTrackingCode(code);

  if (!shipment) {
    return NextResponse.json({ error: "Kodi nuk u gjet." }, { status: 404 });
  }

  return NextResponse.json(shipment);
}
