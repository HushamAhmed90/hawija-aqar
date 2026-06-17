export type CarListingType = "بيع" | "إيجار";
export type CarCondition = "جديد" | "مستعمل";
export type FuelType = "بنزين" | "ديزل" | "كهربائي" | "هجين";
export type Transmission = "أوتوماتيك" | "يدوي";

export interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: CarListingType;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  fuelType: FuelType;
  transmission: Transmission;
  condition: CarCondition;
  village: string;
  phone: string;
  images: string[];
  createdAt: Date;
  sold?: boolean;
  views?: number;
  whatsappClicks?: number;
}
