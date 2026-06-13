export type ListingType = "بيع" | "إيجار";
export type PropertyType = "أرض" | "بيت" | "شقة" | "محل" | "مزرعة" | "أخرى";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  area: string;
  village: string;
  phone: string;
  images: string[];
  createdAt: Date;
  userId?: string;
  featured?: boolean;
  sold?: boolean;
  ratingTotal?: number;
  ratingCount?: number;
  views?: number;
  whatsappClicks?: number;
}
