export interface CalculatorState {
  itemName: string;
  itemUrl: string;
  priceAud: number;
  destinationCity: string;
  customCity: string; // If city not in list, fallback region
  purchaseMethod: "self" | "assisted" | "";
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
}

export interface CityRate {
  name: string;
  rate: number;
  region: "Jawa" | "Sumatra" | "Bali" | "Kalimantan" | "Sulawesi" | "Nusa Tenggara" | "Maluku & Papua";
}

export interface CalculationResult {
  chargeableWeight: number;
  volumeWeight: number;
  actualWeight: number;
  shippingCost: number;
  additionalFee: number;
  totalCostIdr: number;
  ratePerKg: number;
  itemCostIdr: number;
  conversionRate: number;
}
