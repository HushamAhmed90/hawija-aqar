import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firestore-admin";
import { FieldValue } from "@google-cloud/firestore";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { type } = await req.json();
    const db = getAdminDb();
    const field = type === "whatsapp" ? "whatsappClicks" : "views";
    await db.collection("listings").doc(id).update({ [field]: FieldValue.increment(1) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
