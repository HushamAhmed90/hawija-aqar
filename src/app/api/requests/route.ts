import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue, Timestamp } from "@google-cloud/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("requests").orderBy("createdAt", "desc").get();
    const now = Date.now();
    return NextResponse.json(snap.docs.map(d => ({
      id: d.id, ...d.data(),
      createdAt: d.data().createdAt?.toDate().toISOString() ?? null,
      expiresAt: d.data().expiresAt?.toDate().toISOString() ?? null,
    })).filter((r: any) => !r.closed && new Date(r.expiresAt).getTime() > now));
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    await db.collection("requests").add({
      ...body,
      minPrice: Number(body.minPrice || 0),
      maxPrice: Number(body.maxPrice || 0),
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromDate(expires),
      closed: false,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
