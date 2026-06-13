import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getDb() {
  if (!getApps().length) {
    const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT!, "base64").toString("utf8"));
    initializeApp({ credential: cert(sa) });
    const db = getFirestore();
    db.settings({ preferRest: true });
    return db;
  }
  return getFirestore();
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb();
    const snap = await db.collection("listings").doc(params.id).get();
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
