import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue } from "@google-cloud/firestore";

export async function GET() {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("listings").orderBy("createdAt", "desc").get();
    const listings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
    }));
    return NextResponse.json(listings);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

async function notifyAdmin(title: string, village: string, phone: string, price: number) {
  const adminPhone = process.env.ADMIN_WHATSAPP;
  if (!adminPhone) return;
  const msg = `🏠 إعلان جديد على عقار الحويجة!\n\n📌 ${title}\n📍 ${village}\n💰 ${price.toLocaleString("ar-IQ")} دينار\n📞 ${phone}`;
  await fetch(`https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${encodeURIComponent(msg)}&apikey=${process.env.CALLMEBOT_APIKEY}`)
    .catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getAdminDb();
    await db.collection("listings").add({
      ...body,
      price: Number(body.price),
      createdAt: FieldValue.serverTimestamp(),
    });
    notifyAdmin(body.title, body.village, body.phone, Number(body.price));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
