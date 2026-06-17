import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue } from "@google-cloud/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("cars").orderBy("createdAt", "desc").get();
    const cars = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
    }));
    return NextResponse.json(cars);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("cars").add({
      ...body,
      price: Number(body.price),
      year: Number(body.year),
      mileage: Number(body.mileage),
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
