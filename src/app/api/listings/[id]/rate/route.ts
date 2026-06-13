import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue } from "@google-cloud/firestore";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { star } = await req.json();
    if (!star || star < 1 || star > 5) return NextResponse.json({ error: "invalid" }, { status: 400 });
    const db = getAdminDb();
    await db.collection("listings").doc(id).update({
      ratingTotal: FieldValue.increment(star),
      ratingCount: FieldValue.increment(1),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
