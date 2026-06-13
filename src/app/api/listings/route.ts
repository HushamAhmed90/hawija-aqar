import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getDb() {
  if (!getApps().length) {
    const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8"));
    initializeApp({ credential: cert(sa) });
  }
  return getFirestore();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    await db.collection("listings").add({
      ...body,
      price: Number(body.price),
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
