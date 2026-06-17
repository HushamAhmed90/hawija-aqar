export type RequestCategory = "عقار" | "سيارة";
export type RequestListingType = "شراء" | "إيجار";

export interface PropertyRequest {
  id: string;
  category: RequestCategory;
  listingType: RequestListingType;
  description: string;
  village: string;
  minPrice: number;
  maxPrice: number;
  phone: string;
  name: string;
  createdAt: Date;
  expiresAt: Date;
  closed?: boolean;
}
