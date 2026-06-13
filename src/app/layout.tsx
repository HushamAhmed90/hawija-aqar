import type { Metadata } from "next";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "عقار الحويجة | بيع وشراء وإيجار العقارات في الحويجة كركوك",
  description: "منصة عقارية متخصصة في قضاء الحويجة — كركوك، العراق. أضف إعلانك مجاناً أو تصفح إعلانات بيع وشراء وإيجار الأراضي والبيوت والشقق والمحلات.",
  keywords: "عقار الحويجة, عقارات الحويجة, بيع عقار الحويجة, إيجار الحويجة, كركوك عقار, أراضي الحويجة",
  openGraph: {
    title: "عقار الحويجة — منصة العقارات الأولى في الحويجة",
    description: "تصفح أو أضف إعلانات عقارية في قضاء الحويجة وقراها — مجاناً",
    url: "https://hawija-aqar.vercel.app",
    siteName: "عقار الحويجة",
    locale: "ar_IQ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="google" content="nositelinkssearchbox" />
        <link rel="canonical" href="https://hawija-aqar.vercel.app" />
      </head>
      <body className="min-h-full flex flex-col">{children}<WhatsAppFloat /></body>
    </html>
  );
}
