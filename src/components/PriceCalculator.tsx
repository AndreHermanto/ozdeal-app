import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  MessageSquare, 
  Package, 
  MapPin, 
  DollarSign, 
  Maximize2, 
  Scale, 
  Info, 
  Check, 
  Search, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CalculatorState, CityRate, CalculationResult } from "../types";
import { CITY_RATES, REGIONAL_FALLBACKS, calculatePricing, formatCurrency, formatWeight, getWhatsAppLink } from "../utils";
import { useCurrency } from "./CurrencyContext";

interface PriceCalculatorProps {
  setView: (view: "home" | "calculator") => void;
}

const REGION_OPTIONS = Object.keys(REGIONAL_FALLBACKS) as string[];

export default function PriceCalculator({ setView }: PriceCalculatorProps) {
  const { exchangeRate, isLoading: isExchangeLoading, isLive: isExchangeLive, lastUpdated: exchangeLastUpdated, refreshRate } = useCurrency();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CalculatorState>({
    itemName: "",
    itemUrl: "",
    priceAud: 1,
    destinationCity: "",
    customCity: "Jawa",
    purchaseMethod: "",
    lengthCm: 10,
    widthCm: 10,
    heightCm: 10,
    weightKg: 1,
  });

  // State for searchable city dropdown
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: keyof CalculatorState, value: number) => {
    // Avoid negative values
    const safeVal = value < 0 ? 0 : value;
    setFormData((prev) => ({
      ...prev,
      [name]: safeVal,
    }));
  };

  const handleSelectCity = (cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      destinationCity: cityName,
    }));
    setCitySearchQuery("");
    setIsCityDropdownOpen(false);
  };

  const handleSelectFallbackRegion = (regionName: string) => {
    setFormData((prev) => ({
      ...prev,
      destinationCity: "Lainnya",
      customCity: regionName,
    }));
    setIsCityDropdownOpen(false);
  };

  const handleSelectMethod = (method: "self" | "assisted") => {
    setFormData((prev) => ({
      ...prev,
      purchaseMethod: method,
    }));
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setFormData({
      itemName: "",
      itemUrl: "",
      priceAud: 50,
      destinationCity: "",
      customCity: "Jawa",
      purchaseMethod: "",
      lengthCm: 10,
      widthCm: 10,
      heightCm: 10,
      weightKg: 1,
    });
    setStep(1);
    setCitySearchQuery("");
  };

  // Form step-by-step validations
  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        return formData.itemName.trim().length > 0;
      case 2:
        return formData.priceAud > 0;
      case 3:
        return formData.destinationCity !== "";
      case 4:
        return formData.purchaseMethod !== "";
      case 5:
        return formData.lengthCm > 0 && formData.widthCm > 0 && formData.heightCm > 0;
      case 6:
        return formData.weightKg > 0;
      default:
        return true;
    }
  };

  // Filter cities based on query
  const filteredCities = CITY_RATES.filter((city) =>
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const pricingResult = calculatePricing(formData, exchangeRate);

  // Quick helper to fill out dimension presets
  const applyPreset = (preset: { l: number; w: number; h: number; wt: number }) => {
    setFormData((prev) => ({
      ...prev,
      lengthCm: preset.l,
      widthCm: preset.w,
      heightCm: preset.h,
      weightKg: preset.wt,
    }));
  };

  // Animation variants for card slide effect (vibe iOS fluid slide)
  const slideVariants = {
    initial: { opacity: 0, x: 25 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -25 },
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Info */}
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#003b73] tracking-tight">
          Estimasi Kalkulator Kargo OzDeal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Dapatkan rincian biaya transparan secara instan dalam 6 langkah cepat.
        </p>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden relative">
        
        {/* Progress Bar Header */}
        {step <= 6 && (
          <div className="bg-[#e4f4ff]/40 px-6 py-4 border-b border-blue-100/50">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono mb-2">
              <span className="font-bold text-blue-600">Langkah {step} dari 6</span>
              <span className="font-semibold">{Math.round((step / 6) * 100)}% Selesai</span>
            </div>
            <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-linear-to-r from-blue-500 to-[#003b73] rounded-full"
                initial={{ width: "16.66%" }}
                animate={{ width: `${(step / 6) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {/* Wizard Form Viewport */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step <= 6 ? (
              <motion.div
                key={step}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                className="min-h-[280px] flex flex-col justify-between"
              >
              
              {/* Step 1: Item Name & Purchase Link */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Detail Barang</h3>
                      <p className="text-xs text-slate-400">Tuliskan nama barang dan sertakan link/URL toko jika ada.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono uppercase tracking-wider">
                        Nama Barang <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleTextChange}
                        placeholder="Contoh: Chemist Warehouse Swisse Vitamin C 150 Tablet"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400 transition-colors"
                        autoFocus
                        id="input-item-name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono uppercase tracking-wider">
                        Link Pembelian (Opsional)
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          name="itemUrl"
                          value={formData.itemUrl}
                          onChange={handleTextChange}
                          placeholder="https://www.chemistwarehouse.com.au/buy/..."
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400 transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Sertakan tautan agar mempermudah tim OzDeal dalam verifikasi barang.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Item Value in AUD */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Nilai Barang (AUD)</h3>
                      <p className="text-xs text-slate-400">Harga atau nilai nominal barang dalam mata uang Australia Dollar (AUD).</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono uppercase tracking-wider">
                        Nilai Barang (AUD $)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 font-semibold text-slate-500 text-base">$</span>
                        <input
                          type="number"
                          value={formData.priceAud || ""}
                          onChange={(e) => handleNumberChange("priceAud", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="1"
                          className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-base font-semibold text-[#003b73] transition-colors"
                          autoFocus
                          id="input-price-aud"
                        />
                      </div>
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mt-4 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <div className="text-xs text-slate-600 flex-grow">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>Kurs referensi:</span>
                              <strong className="text-[#003b73] font-mono">1 AUD = {formatCurrency(exchangeRate)}</strong>
                              {isExchangeLoading ? (
                                <span className="inline-flex items-center text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100 font-medium">
                                  <RefreshCw className="w-2.5 h-2.5 animate-spin mr-1" /> Mengambil...
                                </span>
                              ) : isExchangeLive ? (
                                <span className="inline-flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" /> Live Google API
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-200 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1" /> Offline Mode
                                </span>
                              )}
                            </div>
                            
                            {exchangeLastUpdated && (
                              <p className="text-[10px] text-slate-400 mt-0.5 font-light">
                                Terakhir diperbarui hari ini pukul {exchangeLastUpdated}
                              </p>
                            )}

                            <div className="mt-2 pt-2 border-t border-blue-100/50">
                              Nilai dalam Rupiah: <strong className="text-[#003b73] text-sm font-bold">{formatCurrency(formData.priceAud * exchangeRate)}</strong>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => refreshRate()}
                            disabled={isExchangeLoading}
                            title="Perbarui Kurs"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100/50 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isExchangeLoading ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Destination City (Searchable Dropdown) */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Kota Tujuan Pengiriman</h3>
                      <p className="text-xs text-slate-400">Pilih kota tujuan utama pengemasan akhir Anda di Indonesia.</p>
                    </div>
                  </div>

                  <div className="relative pt-2" ref={dropdownRef}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono uppercase tracking-wider">
                      Cari / Pilih Kota Tujuan
                    </label>
                    
                    {/* Trigger Input */}
                    <div 
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white flex justify-between items-center cursor-pointer hover:border-slate-300 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {formData.destinationCity 
                          ? (formData.destinationCity === "Lainnya" 
                              ? `Kota Lainnya - Regional (${formData.customCity})` 
                              : formData.destinationCity)
                          : "--- Pilih Kota Tujuan ---"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>

                    {/* Dropdown Menu */}
                    {isCityDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 overflow-hidden">
                        
                        {/* Search field */}
                        <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="Cari kota (contoh: Bandung, Makassar, Jayapura...)"
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-xs text-slate-700 placeholder:text-slate-400"
                            autoFocus
                          />
                        </div>

                        {/* List Area */}
                        <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city.name}
                                type="button"
                                onClick={() => handleSelectCity(city.name)}
                                className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#e4f4ff] hover:text-[#003b73] transition-colors flex justify-between items-center cursor-pointer"
                              >
                                <span>{city.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{city.region}</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                              Kota tidak ditemukan secara spesifik.
                            </div>
                          )}

                          {/* Fallback Regional Headers */}
                          <div className="p-3 bg-blue-50/50 text-[10px] font-bold text-[#003b73] font-mono uppercase tracking-wider">
                            Pilih Fallback Pulau / Regional Terdekat
                          </div>
                          {REGION_OPTIONS.map((region) => (
                            <button
                              key={region}
                              type="button"
                              onClick={() => handleSelectFallbackRegion(region)}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#e4f4ff] hover:text-[#003b73] transition-colors flex justify-between items-center cursor-pointer"
                            >
                              <span className="font-semibold text-slate-700">Lainnya - Pulau {region}</span>
                              <span className="text-[10px] text-blue-600 font-mono">Tarif Regional</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {formData.destinationCity && (
                    <div className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <div>
                        Kota Terpilih: <strong>{formData.destinationCity === "Lainnya" ? `Lainnya - Wilayah ${formData.customCity}` : formData.destinationCity}</strong>. 
                        <br />
                        Kargo rate: <strong className="font-mono">{formatCurrency(pricingResult.ratePerKg)}/Kg</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Purchase Method */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Metode Belanja / Jastip</h3>
                      <p className="text-xs text-slate-400">Bagaimana Anda ingin membeli barang incaran Anda?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {/* Option A: Beli Sendiri */}
                    <button
                      type="button"
                      onClick={() => handleSelectMethod("self")}
                      className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 relative cursor-pointer ${
                        formData.purchaseMethod === "self"
                          ? "border-[#003b73] bg-[#e4f4ff]/50 shadow-md"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {formData.purchaseMethod === "self" && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#003b73] flex items-center justify-center text-white text-[10px]">
                          ✓
                        </div>
                      )}
                      <h4 className="font-display font-bold text-base text-[#003b73] mb-1">
                        Metode "Beli Sendiri"
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Anda memesan mandiri dari website, lalu mengirimkannya ke gudang fisik OzDeal di Sydney. Kami menerima dan meneruskan pengiriman kargo ke Indonesia.
                      </p>
                      <div className="text-[10px] font-mono text-blue-600 uppercase font-bold mt-2">
                        + Flat Handling Fee Rp 100.000
                      </div>
                    </button>

                    {/* Option B: Dibantu OzDeal */}
                    <button
                      type="button"
                      onClick={() => handleSelectMethod("assisted")}
                      className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 relative cursor-pointer ${
                        formData.purchaseMethod === "assisted"
                          ? "border-[#003b73] bg-[#e4f4ff]/50 shadow-md"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {formData.purchaseMethod === "assisted" && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#003b73] flex items-center justify-center text-white text-[10px]">
                          ✓
                        </div>
                      )}
                      <h4 className="font-display font-bold text-base text-[#003b73] mb-1">
                        Metode "Dibantu OzDeal"
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Cukup berikan link barang. Tim admin OzDeal akan mengurus transaksi pembelian produk dan mengirimkannya langsung sampai depan rumah Anda di Indonesia.
                      </p>
                      <div className="text-[10px] font-mono text-blue-600 uppercase font-bold mt-2">
                        + Ongkos Barang (Termasuk Jasa)
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Dimensions */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Dimensi Volume Barang</h3>
                      <p className="text-xs text-slate-400">Panjang, lebar, dan tinggi paket dalam satuan Centimeter (cm).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">Panjang (cm)</label>
                      <input
                        type="number"
                        value={formData.lengthCm || ""}
                        onChange={(e) => handleNumberChange("lengthCm", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm text-[#003b73]"
                        placeholder="0"
                        min="1"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">Lebar (cm)</label>
                      <input
                        type="number"
                        value={formData.widthCm || ""}
                        onChange={(e) => handleNumberChange("widthCm", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm text-[#003b73]"
                        placeholder="0"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">Tinggi (cm)</label>
                      <input
                        type="number"
                        value={formData.heightCm || ""}
                        onChange={(e) => handleNumberChange("heightCm", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-sm text-[#003b73]"
                        placeholder="0"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Volume weight preview */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex justify-between items-center text-xs text-slate-600">
                    <span>Estimasi Berat Volume:</span>
                    <strong className="font-mono text-[#003b73]">
                      {formatWeight((formData.lengthCm * formData.widthCm * formData.heightCm) / 5000)}
                    </strong>
                  </div>

                  {/* Presets */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Saran Preset Ukuran:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyPreset({ l: 30, w: 20, h: 15, wt: 1 })}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        📦 Kotak Sepatu (30x20x15)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset({ l: 20, w: 20, h: 20, wt: 1 })}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        📦 Box Kotak Kecil (20x20x20)
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset({ l: 40, w: 30, h: 15, wt: 2 })}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        👜 Tas / Sling Bag (40x30x15)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Weight */}
              {step === 6 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#003b73]">Perkiraan Berat Aktual</h3>
                      <p className="text-xs text-slate-400">Berat asli timbangan fisik paket dalam satuan Kilogram (Kg).</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono uppercase tracking-wider">
                        Berat Paket (Kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weightKg || ""}
                        onChange={(e) => handleNumberChange("weightKg", parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                        min="0.1"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono text-base font-semibold text-[#003b73] transition-colors"
                        autoFocus
                      />
                    </div>

                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs text-slate-500 space-y-1">
                      <p className="font-bold text-slate-600 text-[10px] uppercase font-mono tracking-wider">Acuan Estimasi Berat:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        <li>Botol suplemen/vitamin per pcs: ~0.2 - 1 Kg</li>
                        <li>Satu pasang sepatu: ~1.0 - 3.0 Kg</li>
                        <li>Jaket tebal / Coat: ~1.0 - 2.0 Kg</li>
                        <li>Tas kosmetik / skincare: ~0.2 - 1.5 Kg</li>
                        <li>Baju/Celana casual: ~0.2 - 0.5 Kg</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Footer */}
              <div className="pt-8 border-t border-slate-100 flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    step === 1
                      ? "text-slate-300 cursor-not-allowed bg-transparent"
                      : "text-slate-600 hover:text-[#003b73] hover:bg-slate-100 cursor-pointer"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!validateStep()}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 hover:shadow-lg ${
                    validateStep()
                      ? "bg-[#003b73] text-white cursor-pointer hover:shadow-[#003b73]/10"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
              className="space-y-6"
            >
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#003b73]">Estimasi Biaya Selesai</h3>
                <p className="text-xs text-slate-500">Berikut adalah rincian lengkap tarif cargo dan handling dari OzDeal.</p>
              </div>

              {/* Rincian Calculation Box */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                
                {/* Section A: Info Items */}
                <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-200/60 pb-3.5">
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px] font-bold">Nama Barang:</span>
                    <strong className="text-slate-700 font-medium">{formData.itemName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px] font-bold">Kota Tujuan:</span>
                    <strong className="text-slate-700 font-medium">
                      {formData.destinationCity === "Lainnya" ? `Lainnya (${formData.customCity})` : formData.destinationCity}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px] font-bold">Nilai Barang:</span>
                    <strong className="text-slate-700 font-medium">${formData.priceAud} AUD (~{formatCurrency(pricingResult.itemCostIdr)})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono uppercase text-[9px] font-bold">Metode Layanan:</span>
                    <strong className="text-slate-700 font-medium">
                      {formData.purchaseMethod === "self" ? "Beli Sendiri (OzDeal Kirim)" : "Dibantu OzDeal"}
                    </strong>
                  </div>
                </div>

                {/* Section B: Weight Calculations */}
                <div className="bg-white rounded-xl border border-blue-100 p-4 space-y-2">
                  <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Perbandingan Berat (Chargeable weight):</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 flex items-center gap-1">
                      Berat Aktual Paket:
                    </span>
                    <span className="font-mono font-semibold text-slate-700">{formatWeight(pricingResult.actualWeight)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 flex items-center gap-1">
                      Berat Volume Dimesi ({formData.lengthCm}x{formData.widthCm}x{formData.heightCm} cm / 5000):
                    </span>
                    <span className="font-mono font-semibold text-slate-700">{formatWeight(pricingResult.volumeWeight)}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-1.5" />
                  <div className="flex justify-between items-center text-xs bg-blue-50/50 p-2 rounded-lg">
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-blue-700">Berat Kargo Terpilih (Tertinggi):</span>
                      <span className="text-[9px] text-slate-500 font-normal">Dibulatkan ke atas jika desimal &gt; 0.1 Kg</span>
                    </div>
                    <strong className="font-mono text-[#003b73]">{formatWeight(pricingResult.chargeableWeight)}</strong>
                  </div>
                </div>

                {/* Section C: Fees breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">
                      Ongkos Cargo Udara ({formatWeight(pricingResult.chargeableWeight)} x {formatCurrency(pricingResult.ratePerKg)}/kg):
                    </span>
                    <span className="font-mono font-medium text-slate-700">{formatCurrency(pricingResult.shippingCost)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">
                      {formData.purchaseMethod === "self" 
                        ? "Handling Fee (Beli Mandiri):" 
                        : "Ongkos Barang (Termasuk Jasa):"}
                    </span>
                    <span className="font-mono font-medium text-slate-700">{formatCurrency(pricingResult.additionalFee)}</span>
                  </div>

                  <div className="h-px bg-slate-200/80 my-2" />
                  
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-display font-extrabold text-sm text-[#003b73]">TOTAL ESTIMASI BIAYA:</span>
                    <strong className="font-mono text-base sm:text-lg font-bold text-blue-600">
                      {formatCurrency(pricingResult.totalCostIdr)}
                    </strong>
                  </div>
                  <div className="text-[10px] text-right text-slate-500 font-normal">
                    * Tersedia Asuransi Opsional sebesar 10% dari harga barang (~{formatCurrency(pricingResult.itemCostIdr * 0.1)})
                  </div>
                </div>

              </div>

              {/* Action Redirection buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={getWhatsAppLink(formData, pricingResult)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-3 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-[1.02] active:scale-98 hover:shadow-xl hover:shadow-emerald-500/25 text-sm sm:text-base"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span className="hidden sm:inline">Kirim & Hubungi OzDeal via WhatsApp</span>
                  <span className="sm:hidden">Hubungi OzDeal via WA</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#003b73] rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Hitung Ulang / Mulai Baru</span>
                </button>
              </div>

              {/* Note */}
              <div className="text-[10px] text-slate-400 text-center leading-relaxed pt-2">
                * Estimasi ini tidak termasuk ongkos kirim domestik dari gateway Jakarta ke rumah Anda (bisa menggunakan JNE/J&T/Sicepat sesuai preferensi Anda).
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>

      </div>

      {/* Quick Info Box Bottom */}
      {step <= 6 && (
        <div className="mt-6 text-center text-[10px] text-slate-400 font-light flex items-center justify-center gap-1 bg-slate-100/50 p-3 rounded-2xl border border-slate-200/30">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          <span>Rumus: Volume berat = (P x L x T) / 5000. OzDeal menggunakan nilai terbesar antara berat aktual vs volume kargo, dan dibulatkan ke atas jika desimalnya lebih dari 0.1 Kg (minimal 1 Kg).</span>
        </div>
      )}
    </div>
  );
}
