import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("listings").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
