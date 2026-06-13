import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").get();
    return NextResponse.json({ count: snap.size });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
