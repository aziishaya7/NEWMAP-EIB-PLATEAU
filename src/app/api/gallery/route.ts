import { NextResponse } from "next/server";
import { listApprovedGalleryItems } from "@/lib/gallery";

export async function GET() {
  try {
    const items = await listApprovedGalleryItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/gallery", error);
    return NextResponse.json(
      { error: "Failed to load gallery." },
      { status: 500 }
    );
  }
}
