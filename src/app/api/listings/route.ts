import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    const toValue = (v: unknown): unknown => {
      if (typeof v === "string") return { stringValue: v };
      if (typeof v === "number") return { integerValue: String(v) };
      if (Array.isArray(v)) return { arrayValue: { values: v.map((s) => ({ stringValue: s })) } };
      return { stringValue: String(v) };
    };

    const fields: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(body)) {
      fields[key] = toValue(val);
    }
    fields.createdAt = { timestampValue: new Date().toISOString() };

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/listings?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
