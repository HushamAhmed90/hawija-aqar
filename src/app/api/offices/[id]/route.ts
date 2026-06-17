import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const snap = await db.collection("offices").doc(id).get();
    if (!snap.exists) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ id: snap.id, ...snap.data(), createdAt: snap.data()?.createdAt?.toDate().toISOString() ?? null });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("offices").doc(id).update(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getAdminDb();
    await db.collection("offices").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
