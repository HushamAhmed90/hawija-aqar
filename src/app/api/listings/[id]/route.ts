import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const snap = await db.collection("listings").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data()?.createdAt?.toDate().toISOString() ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
