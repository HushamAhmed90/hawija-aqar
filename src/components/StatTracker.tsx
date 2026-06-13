"use client";
import { useEffect } from "react";

export default function StatTracker({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/api/listings/${id}/stat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view" }),
    }).catch(() => {});
  }, [id]);
  return null;
}
