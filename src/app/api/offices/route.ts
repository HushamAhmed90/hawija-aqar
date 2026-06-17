import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue } from "@google-cloud/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("offices").orderBy("createdAt", "desc").get();
    return NextResponse.json(snap.docs.map(d => ({
      id: d.id, ...d.data(),
      createdAt: d.data().createdAt?.toDate().toISOString() ?? null,
    })));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const ref = await db.collection("offices").add({ ...body, createdAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ success: true, id: ref.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
