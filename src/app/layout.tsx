import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "عقار الحويجة | HawijaAqar",
  description: "منصة بيع وشراء وإيجار العقارات في قضاء الحويجة - كركوك",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
