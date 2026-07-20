import React, { useState } from "react";
import { 
  Calculator, 
  MessageSquare, 
  Package, 
  ShoppingBag, 
  ChevronDown, 
  CheckCircle2, 
  Plane, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  HelpCircle,
  Search,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CITY_RATES, formatCurrency } from "../utils";
// @ts-ignore
import sydneyToMonasBg from "../assets/images/banner-sydney-jakarta.jpg";

interface HomeViewProps {
  setView: (view: "home" | "calculator") => void;
  faqRef: React.RefObject<HTMLDivElement | null>;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Berapa lama estimasi waktu pengiriman dari Australia ke Indonesia?",
    answer: "Pengiriman via Udara (Air Cargo) memakan waktu berkisar antara 10 hingga 15 hari kerja terhitung sejak barang diberangkatkan dari gudang Sydney kami."
  },
  {
    question: "Kapan jadwal keberangkatan kargo OzDeal?",
    answer: "Keberangkatan kargo kami dijadwalkan sebanyak 3 kali dalam sebulan, biasanya pada tanggal 10, 20, dan 30 setiap bulannya. Tanggal keberangkatan dapat mengalami penyesuaian (maju atau mundur) jika tanggal keberangkatan tersebut jatuh pada akhir pekan (weekend)."
  },
  {
    question: "Kapan batas waktu (cut-off / last drop) barang masuk ke gudang?",
    answer: "Batas waktu penerimaan barang di gudang (last drop / cut-off) biasanya dilakukan sekitar 2 hingga 3 hari sebelum tanggal keberangkatan kargo, tergantung pada hari pengiriman aktual. Jadwal cut-off yang tepat untuk setiap batch pengiriman dapat Anda pastikan langsung dengan menghubungi admin OzDeal."
  },
  {
    question: "Apa perbedaan antara metode 'Beli Sendiri' dan 'Dibantu OzDeal'?",
    answer: "Pada metode 'Beli Sendiri', Anda berbelanja mandiri di website Australia pilihan Anda lalu mengirimkannya ke alamat gudang fisik kami di Sydney (kami kenakan Handling Fee flat Rp 100.000). Sedangkan pada metode 'Dibantu OzDeal', Anda cukup mengirimkan link produk, dan tim kami akan mengurus pembayaran serta pembeliannya langsung (dikenakan Ongkos Barang yang mencakup nilai barang dan jasa titip beli secara praktis). Sangat memudahkan bagi Anda yang tidak memiliki kartu kredit internasional."
  },
  {
    question: "Bagaimana cara perhitungan berat barang (Aktual vs Volume)?",
    answer: "Sesuai standar asosiasi kargo udara internasional, berat yang ditagih (Chargeable Weight) diambil dari angka tertinggi antara berat timbangan aktual atau berat volume dimensi barang. Rumus Berat Volume: (Panjang x Lebar x Tinggi dalam cm) / 5000. Contoh: Boneka ringan berukuran besar akan dikenakan tarif berdasarkan berat volumenya."
  },
  {
    question: "Apakah ada batas minimal berat barang yang dikirim?",
    answer: "Kami berkomitmen melayani jastip skala kecil maupun besar tanpa batas minimum yang memberatkan. Namun, pembulatan tarif kargo terkecil yang berlaku adalah 1 Kg. Jika barang Anda memiliki berat di bawah 1 Kg (misal 400 gram), tarif kargo yang dikenakan akan tetap dihitung sebagai tarif minimal 1 Kg."
  },
  {
    question: "Barang apa saja yang dilarang dikirim melalui kargo OzDeal?",
    answer: "Untuk keselamatan dan kepatuhan regulasi kepabeanan, kami dilarang mengirimkan: barang mudah terbakar (aerosol, parfum beralkohol tinggi), baterai lepas (powerbank), senjata tajam/api, obat-obatan tanpa resep dokter, rokok/vape, produk tiruan/KW (counterfeit items), serta bahan makanan segar yang mudah membusuk."
  },
  {
    question: "Apakah pengiriman barang dijamin aman sampai tujuan?",
    answer: "Tentu saja. Semua barang yang masuk ke gudang kami akan didokumentasikan berupa foto kedatangan dan ditangani dengan standar pengemasan tinggi. Kami juga menyediakan opsi proteksi asuransi pengiriman penuh untuk memberikan ketenangan total bagi Anda."
  },
  {
    question: "Apakah OzDeal bertanggung jawab terhadap kerusakan atau kehilangan barang?",
    answer: "OzDeal berusaha semaksimal mungkin memastikan keamanan barang, tetapi dalam kasus langka yang menyebabkan adanya barang rusak atau hilang, kami tidak dapat bertanggung jawab, kecuali jika Anda telah membeli asuransi opsional barang (maka nilai dari barang yang rusak/hilang tersebut akan diganti penuh). Pastikan Anda selalu membuat video unboxing lengkap tanpa terputus jika ingin mengajukan klaim kerusakan atau kehilangan barang."
  }
];

export default function HomeView({ setView, faqRef }: HomeViewProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleWhatsAppContact = () => {
    const phone = "61478527270";
    const text = encodeURIComponent("Halo OzDeal, saya ingin bertanya mengenai layanan jasa titip/kirim barang.");
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile 
      ? `whatsapp://send?phone=${phone}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:py-24 text-center relative overflow-hidden rounded-3xl">
        {/* Subtle decorative background graphic (Sydney Opera House to Monas) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] select-none flex items-center justify-center transition-opacity duration-1000">
          <img 
            src={sydneyToMonasBg} 
            alt="" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
          className="space-y-6 max-w-4xl mx-auto relative z-10"
        >
          {/* Kangaroo Icon and Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003b73]/10 border border-[#003b73]/20 text-[#003b73] font-semibold text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Jastip & Cargo Premium Australia — Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#003b73] leading-[1.1] tracking-tight">
            Kirim Barang Impian Dari <span className="text-blue-600 underline decoration-wavy decoration-2 underline-offset-8">Australia</span> Terasa Dekat & Instan!
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Bebas belanja dari Chemist Warehouse, Amazon, JB-HiFi, hingga butik eksklusif Australia(LSKD, Lorna Jane, dll). OzDeal mengurus cargo, bea cukai, sampai pengiriman lokal ke depan rumah Anda dengan aman.
          </p>

          {/* Starting Price Highlight Badge */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 max-w-xl mx-auto flex items-center justify-center gap-3 shadow-sm">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <p className="text-sm sm:text-base text-slate-700 font-medium">
              Harga mulai dari <strong className="text-[#003b73] text-lg sm:text-xl font-bold">Rp 260.000 / Kg</strong> untuk jastip atau kirim dari Australia ke Indonesia!
            </p>
          </div>

          {/* Interactive CTA Buttons with Bounce effect */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView("calculator")}
              className="w-full sm:w-auto px-8 py-4 bg-[#003b73] text-white rounded-2xl font-bold shadow-lg shadow-[#003b73]/20 flex items-center justify-center gap-2 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-[#003b73]/30"
              id="btn-calc-cta"
            >
              <Calculator className="w-5 h-5" />
              <span>Hitung Estimasi Harga</span>
            </button>

            <button
              onClick={handleWhatsAppContact}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-emerald-500/20"
              id="btn-wa-cta"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Tanya Langsung via WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. How It Works Section */}
      <section className="w-full bg-white/60 py-20 border-y border-blue-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#003b73]">
              Alur Jasa OzDeal Teramat Mudah
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Proses transparan tanpa kerumitan administrasi impor yang membingungkan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-[#e4f4ff]/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-md hover:bg-white">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-blue-100/70 font-display">
                01
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#003b73] mb-2">
                Pilih Barang Favorit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Temukan barang impian Anda dari e-commerce atau gerai fisik di seluruh Australia (Amazon AU, Chemist Warehouse, Ebay, dll).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#e4f4ff]/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-md hover:bg-white">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-blue-100/70 font-display">
                02
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#003b73] mb-2">
                Hitung Estimasi Biaya
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gunakan kalkulator online kami untuk mendapatkan rincian tarif kargo dan jasa handling yang akurat, transparan, dan instan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#e4f4ff]/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-md hover:bg-white">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-blue-100/70 font-display">
                03
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#003b73] mb-2">
                Konfirmasi & Beli
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kirim data ke kami. Kami bisa bantu belikan langsung atau Anda belanja mandiri dan dikirim ke gudang Sydney kami.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#e4f4ff]/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group transition-all duration-500 hover:shadow-md hover:bg-white">
              <div className="absolute top-4 right-4 text-4xl font-extrabold text-blue-100/70 font-display">
                04
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                <Plane className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#003b73] mb-2">
                Kargo & Kirim Rumah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kami urus bea cukai kargo udara internasional sampai beres, lalu mengirimkannya langsung ke alamat pintu rumah Anda di Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Benefits Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#003b73]">
            Kenapa Ratusan Pelanggan Memilih OzDeal?
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Komitmen kami adalah kepraktisan, keamanan, dan harga yang bersahabat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/40 p-8 rounded-2xl border border-blue-100/50 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#003b73] mb-3">Keamanan Garansi 100%</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Setiap paket dipotret saat sampai di Sydney dan di-pack ulang secara aman dengan bubble wrap tanpa biaya tambahan untuk menjaga kondisi barang utuh.
            </p>
          </div>

          <div className="bg-white/40 p-8 rounded-2xl border border-blue-100/50 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#003b73] mb-3">Rutin Berangkat Mingguan</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tidak perlu menunggu kargo penuh lama-lama. Pengiriman udara kami dijadwalkan terbang setiap minggu, meminimalkan waktu tunggu barang Anda.
            </p>
          </div>

          <div className="bg-white/40 p-8 rounded-2xl border border-blue-100/50 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#003b73] mb-3">Transparan Tanpa Biaya Siluman</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Biaya yang tercantum di kalkulator adalah rincian bersih. Tidak ada tambahan biaya impor, pajak bea cukai, atau retribusi mendadak saat barang tiba.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section 
        ref={faqRef}
        id="faq-section"
        className="w-full bg-white/70 py-20 border-t border-blue-100/80 scroll-mt-20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1 text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-[#003b73]">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-slate-500">
              Temukan jawaban cepat seputar pengiriman, tarif, dan panduan jastip OzDeal.
            </p>
          </div>

          {/* Elegant fluid custom Accordion */}
          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="bg-[#e4f4ff]/40 hover:bg-[#e4f4ff]/70 border border-blue-100/80 rounded-2xl transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-[#003b73] focus:outline-none cursor-pointer"
                  >
                    <span className="font-display text-base sm:text-lg">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-5 h-5 text-blue-600 shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-blue-100/40 pt-2 bg-white/20">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4.5 Shipping Rates Table Section */}
      <section className="w-full bg-slate-50/40 py-16 border-t border-blue-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#003b73]">
              Daftar Tarif Kirim & Jastip per KG
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Tarif flat per Kilogram (Kg) All-In (sudah termasuk cargo udara, pengurusan bea cukai, dan pajak impor) ke kota-kota tujuan Anda.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Cari kota tujuan Anda... (misal: Bandung, Surabaya)"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="w-full px-4 py-3 pl-11 rounded-2xl border border-blue-100 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
            <div className="absolute left-4 top-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            {citySearch && (
              <button
                onClick={() => setCitySearch("")}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Tabs */}
          {!citySearch && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
              {[
                { id: "All", label: "Semua Wilayah" },
                { id: "Jawa", label: "Jawa" },
                { id: "Sumatra", label: "Sumatra" },
                { id: "Bali & Nusa Tenggara", label: "Bali & NT" },
                { id: "Kalimantan & Sulawesi", label: "Kalimantan & Sulawesi" },
                { id: "Maluku & Papua", label: "Maluku & Papua" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
                    selectedTab === tab.id
                      ? "bg-[#003b73] text-white shadow-sm shadow-[#003b73]/20"
                      : "bg-white border border-blue-100 text-slate-600 hover:bg-blue-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Rates Table */}
          <div className="bg-white border border-blue-100 rounded-3xl overflow-hidden shadow-sm max-w-2xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0f7ff]/80 border-b border-blue-100 text-[#003b73] font-mono text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Kota Tujuan</th>
                    <th className="px-6 py-4 font-bold">Wilayah</th>
                    <th className="px-6 py-4 font-bold text-right">Tarif / Kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50/50">
                  {(() => {
                    const filteredRates = CITY_RATES.filter(city => {
                      const matchesSearch = city.name.toLowerCase().includes(citySearch.toLowerCase());
                      if (citySearch) return matchesSearch;

                      if (selectedTab === "All") return true;
                      if (selectedTab === "Jawa") return city.region === "Jawa";
                      if (selectedTab === "Sumatra") return city.region === "Sumatra";
                      if (selectedTab === "Bali & Nusa Tenggara") return city.region === "Bali" || city.region === "Nusa Tenggara";
                      if (selectedTab === "Kalimantan & Sulawesi") return city.region === "Kalimantan" || city.region === "Sulawesi";
                      if (selectedTab === "Maluku & Papua") return city.region === "Maluku & Papua";
                      return true;
                    });

                    if (filteredRates.length > 0) {
                      return filteredRates.map((city, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{city.name}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                            {city.region}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-[#003b73] text-right">
                            {formatCurrency(city.rate)}
                          </td>
                        </tr>
                      ));
                    } else {
                      return (
                        <tr>
                          <td colSpan={3} className="px-6 py-10 text-center text-sm text-slate-400">
                            Kota tidak ditemukan. Coba ketik nama kota lainnya atau hubungi admin.
                          </td>
                        </tr>
                      );
                    }
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Fallbacks info note */}
          <div className="max-w-2xl mx-auto mt-4 px-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Untuk kota tujuan lainnya yang tidak tercantum di atas, tarif disesuaikan berdasarkan tarif wilayah regional (Regional Fallback) berkisar dari <strong className="text-slate-600">Rp 280.000 / Kg</strong> hingga <strong className="text-slate-600">Rp 380.000 / Kg</strong>. Silakan hubungi admin OzDeal untuk konfirmasi tarif tepat lokasi Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Bottom Trust Banner */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-[#003b73] to-[#012a52] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 scale-150 pointer-events-none">
            <Plane className="w-80 h-80 text-white" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Sudah Siap Mendapatkan Barang Impian Anda?
            </h3>
            <p className="text-sm sm:text-base text-blue-100/90 font-light leading-relaxed">
              Gunakan kalkulator pengiriman kami untuk melihat rincian biaya yang transparan atau diskusikan barang khusus Anda sekarang juga.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setView("calculator")}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#003b73] hover:bg-blue-50 font-bold rounded-xl text-sm transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Mulai Hitung Sekarang
              </button>
              <button
                onClick={handleWhatsAppContact}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat Admin OzDeal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
