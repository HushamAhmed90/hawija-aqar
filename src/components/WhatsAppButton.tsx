"use client";

export default function WhatsAppButton({ phone, listingId }: { phone: string; listingId: string }) {
  const handle = async () => {
    await fetch(`/api/listings/${listingId}/stat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "whatsapp" }),
    }).catch(() => {});
  };

  const waPhone = `964${phone.replace(/^0/, "")}`;

  return (
    <a
      href={`https://wa.me/${waPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handle}
      className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity mt-2"
    >
      واتساب
    </a>
  );
}
