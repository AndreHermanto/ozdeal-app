import { CityRate, CalculatorState, CalculationResult } from "./types";

export const CITY_RATES: CityRate[] = [
  { name: "Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi)", rate: 260000, region: "Jawa" },
  { name: "Bandung", rate: 270000, region: "Jawa" },
  { name: "Cilegon", rate: 270000, region: "Jawa" },
  { name: "Karawang", rate: 270000, region: "Jawa" },
  { name: "Serang", rate: 270000, region: "Jawa" },
  { name: "Semarang", rate: 275000, region: "Jawa" },
  { name: "Surabaya", rate: 275000, region: "Jawa" },
  { name: "Surakarta (Solo)", rate: 275000, region: "Jawa" },
  { name: "Tegal", rate: 275000, region: "Jawa" },
  { name: "Yogyakarta", rate: 275000, region: "Jawa" },
  { name: "Magelang", rate: 280000, region: "Jawa" },
  { name: "Malang", rate: 280000, region: "Jawa" },
  { name: "Denpasar", rate: 290000, region: "Bali" },
  { name: "Palembang", rate: 280000, region: "Sumatra" },
  { name: "Jambi", rate: 285000, region: "Sumatra" },
  { name: "Medan", rate: 290000, region: "Sumatra" },
  { name: "Padang", rate: 290000, region: "Sumatra" },
  { name: "Pekanbaru", rate: 290000, region: "Sumatra" },
  { name: "Pontianak", rate: 290000, region: "Kalimantan" },
  { name: "Singkawang", rate: 300000, region: "Kalimantan" },
  { name: "Makassar", rate: 300000, region: "Sulawesi" },
  { name: "Manado", rate: 320000, region: "Sulawesi" },
  { name: "Tomohon", rate: 320000, region: "Sulawesi" },
  { name: "Gorontalo", rate: 330000, region: "Sulawesi" },
  { name: "Mataram", rate: 295000, region: "Nusa Tenggara" },
  { name: "Lombok", rate: 310000, region: "Nusa Tenggara" },
  { name: "Ambon", rate: 335000, region: "Maluku & Papua" },
  { name: "Jayapura", rate: 370000, region: "Maluku & Papua" },
];

export const REGIONAL_FALLBACKS: { [key: string]: number } = {
  "Jawa": 280000,
  "Sumatra": 295000,
  "Bali": 295000,
  "Kalimantan": 310000,
  "Sulawesi": 325000,
  "Nusa Tenggara": 315000,
  "Maluku & Papua": 380000,
};

export const KURS_AUD_IDR = 12600;

export function roundWeight(val: number): number {
  if (val <= 0) return 0;
  
  const integerPart = Math.floor(val);
  const decimalPart = Math.round((val - integerPart) * 100) / 100; // floating point safety
  
  let rounded = val;
  if (decimalPart > 0.1) {
    rounded = Math.ceil(val);
  } else {
    rounded = Math.floor(val);
  }
  
  return Math.max(rounded, 1); // Minimum charge weight is 1 kg
}

export function calculatePricing(state: CalculatorState, customExchangeRate?: number): CalculationResult {
  const { lengthCm, widthCm, heightCm, weightKg, priceAud, purchaseMethod, destinationCity, customCity } = state;

  // Calculate volume weight: (P * L * T) / 5000
  const volumeWeight = (lengthCm * widthCm * heightCm) / 5000;
  
  // Chargeable weight is the maximum between actual and volume weight, rounded according to rules
  const rawChargeableWeight = Math.max(weightKg, volumeWeight);
  const chargeableWeight = roundWeight(rawChargeableWeight);

  // Resolve rate per KG
  let ratePerKg = 280000; // default/fallback
  
  const matchedCity = CITY_RATES.find(c => c.name === destinationCity);
  if (matchedCity) {
    ratePerKg = matchedCity.rate;
  } else if (destinationCity === "Lainnya" && customCity) {
    ratePerKg = REGIONAL_FALLBACKS[customCity] || 280000;
  }

  // Base shipping cost
  const shippingCost = chargeableWeight * ratePerKg;

  // Resolve current conversion rate
  const rate = customExchangeRate !== undefined ? customExchangeRate : KURS_AUD_IDR;

  // Additional fees
  let additionalFee = 0;
  const itemCostIdr = priceAud * rate;

  if (purchaseMethod === "self") {
    additionalFee = 100000; // Handling Fee
  } else if (purchaseMethod === "assisted") {
    additionalFee = itemCostIdr * 1.05; // Ongkos Barang = Nilai Barang + Jasa Titip Beli (5% hidden)
  }

  const totalCostIdr = shippingCost + additionalFee;

  return {
    chargeableWeight,
    volumeWeight,
    actualWeight: weightKg,
    shippingCost,
    additionalFee,
    totalCostIdr,
    ratePerKg,
    itemCostIdr,
    conversionRate: rate,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeight(val: number): string {
  return val.toFixed(2) + " kg";
}

export function generateWhatsAppMessage(state: CalculatorState, result: CalculationResult): string {
  const methodText = state.purchaseMethod === "self" ? "Beli Sendiri (OzDeal Kirim)" : "Dibantu OzDeal (Titip Beli & Kirim)";
  const feeLabel = state.purchaseMethod === "self" ? "Handling Fee" : "Ongkos Barang (Termasuk Jasa)";
  const cityText = state.destinationCity === "Lainnya" ? `Lainnya (${state.customCity})` : state.destinationCity;

  const msg = `Halo OzDeal, saya ingin berkonsultasi mengenai jasa pengiriman barang dari Australia. 

Berikut adalah rincian barang hasil kalkulasi website:
------------------------------------------
📦 *Rincian Barang:*
• Nama Barang: ${state.itemName}
• Link Pembelian: ${state.itemUrl || "-"}
• Nilai Barang (AUD): $${state.priceAud} AUD (~${formatCurrency(result.itemCostIdr)})
• Berat Aktual: ${formatWeight(state.weightKg)}
• Dimensi: ${state.lengthCm}x${state.widthCm}x${state.heightCm} cm
• Berat Volume: ${formatWeight(result.volumeWeight)}
• *Berat Chargeable:* ${formatWeight(result.chargeableWeight)}

📍 *Pengiriman:*
• Kota Tujuan: ${cityText}
• Metode: ${methodText}

💰 *Estimasi Biaya:*
• Tarif Cargo (${formatCurrency(result.ratePerKg)}/Kg): ${formatCurrency(result.shippingCost)}
• ${feeLabel}: ${formatCurrency(result.additionalFee)}
• *TOTAL ESTIMASI:* ${formatCurrency(result.totalCostIdr)}

------------------------------------------
Mohon dibantu info ketersediaan slot pengiriman terdekat dan langkah selanjutnya. Terima kasih!`;

  return encodeURIComponent(msg);
}

export function getWhatsAppLink(state: CalculatorState, result: CalculationResult): string {
  const phone = "61478527270"; // OzDeal WhatsApp Business Number (+61 478 527 270)
  const message = generateWhatsAppMessage(state, result);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    return `whatsapp://send?phone=${phone}&text=${message}`;
  } else {
    return `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
  }
}
